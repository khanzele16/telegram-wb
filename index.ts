import mongoose from "mongoose";
import cron from "node-cron";
import dotenv from "dotenv";
import {
  Bot,
  GrammyError,
  HttpError,
  NextFunction,
  type Context,
} from "grammy";
import {
  ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { start } from "./src/conversations";
import { commands } from "./src/config";
import { hydrate } from "@grammyjs/hydrate";
import Redis from "ioredis";
import { Job, Worker, Queue } from "bullmq";
import { KickJob } from "./src/types";
import User from "./src/database/models/User";

dotenv.config();

const bot = new Bot<ConversationFlavor<Context>>(
  process.env.BOT_TOKEN as string
);
mongoose.connect(process.env.MONGO_URL as string);

bot.use(conversations());
bot.command("start", async (ctx, next: NextFunction) => {
  await ctx.conversation.exit("start");
  return next();
});
bot.use(createConversation(start, { plugins: [hydrate()] }));

commands.map((command) => {
  bot.command(command.command, command.action);
});

const connection = new Redis({ maxRetriesPerRequest: null });

new Worker(
  "kickUsers",
  async (job: Job<KickJob>) => {
    const { chatId, userId } = job.data;
    try {
      await bot.api.banChatMember(chatId, userId);
      await bot.api.unbanChatMember(chatId, userId);
      console.log(`[WORKER] Кикнут userId: ${userId}`);
    } catch (err) {
      console.error(`[WORKER] Ошибка кика userId: ${userId}:`, err);
    }
  },
  {
    connection,
    concurrency: 1,
  }
);

const kickQueue = new Queue<KickJob>("kickUsers", { connection });

cron.schedule("* * * * *", async () => {
  console.log("[CRON] Проверка подписок началась");
  try {
    const now = new Date();
    const expiredUsers = await User.find({
      dateOfSubscription: {
        $lte: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      },
      subscription: true,
    });

    for (const user of expiredUsers) {
      await kickQueue.add("kick", {
        chatId: Number(process.env.CHANNEL_ID),
        userId: user.telegramId,
        username: user.username ?? undefined,
      });

      user.subscription = false;
      user.dateOfSubscription = null as any;
      await user.save();

      console.log(
        `[CRON] Подписка деактивирована для telegramId: ${user.telegramId}`
      );
    }

    console.log("[CRON] Проверка подписок завершена");
  } catch (err) {
    console.error("[CRON] Ошибка при проверке подписок:", err);
  }
});

bot.on("message", (ctx) => {
  ctx.reply(JSON.stringify(ctx));
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.start();
