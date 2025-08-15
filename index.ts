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
    const { chatId, userId, username } = job.data;
    try {
      await bot.api.banChatMember(chatId, userId);
      await bot.api.unbanChatMember(chatId, userId);
      console.log(`[WORKER] Кикнут: ${username || userId}`);
    } catch (err) {
      console.error(`[WORKER] Ошибка кика ${username || userId}:`, err);
    }
  },
  {
    connection,
    concurrency: 1,
  }
);

// создаём очередь
const kickQueue = new Queue<KickJob>("kickUsers", { connection });

// --- тестовая задача ---
(async () => {
  await kickQueue.add("kick", {
    chatId: -1001234567890, // ← твой ID группы
    userId: 123456789, // ← твой Telegram ID
    username: "TestUser",
  });
  console.log("[TEST] Джоба на кик добавлена");
})();

cron.schedule("* * * * *", () => {
  const now = new Date().toLocaleString();
  console.log(`[CRON] Задача сработала в ${now}`);
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

console.log("Bot started with cron");
bot.start();
