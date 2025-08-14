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
  ConversationMenuFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { start } from "./src/conversations";
import { commands } from "./src/config";
import { hydrate } from "@grammyjs/hydrate";

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

cron.schedule('* * * * *', () => {
  const now = new Date().toLocaleString();
  console.log(`[CRON] Задача сработала в ${now}`);
});

console.log('CRON-тест запущен. Ждём срабатывания...');

commands.map((command) => {
  bot.command(command.command, command.action);
});

bot.on("message", async (ctx) => {
  ctx.reply(JSON.stringify(ctx.from));
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
