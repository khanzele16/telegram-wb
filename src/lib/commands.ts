import { ConversationFlavor } from "@grammyjs/conversations";
import { Context } from "grammy";
import { register } from "../database/controllers/auth";

export const start = async (ctx: ConversationFlavor<Context>) => {
  await ctx.conversation.exitAll();
  await register(ctx);
  await ctx.conversation.enter("start");
};

export const help = async (ctx: ConversationFlavor<Context>) => {
  await ctx.reply("Help");
};
