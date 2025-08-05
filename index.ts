import dotenv from "dotenv";
import { Bot, GrammyError, HttpError, type Context } from "grammy";
import {
  ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { start } from "./src/conversations";
import { commands } from "./src/config";
import mongoose from "mongoose";

dotenv.config();

const bot = new Bot<ConversationFlavor<Context>>(
  process.env.BOT_TOKEN as string
);
mongoose.connect(process.env.MONGO_URL as string);

bot.use(conversations());
bot.use(createConversation(start));

commands.map((command) => {
  bot.command(command.command, command.action);
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
