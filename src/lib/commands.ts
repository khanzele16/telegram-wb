import { ConversationFlavor } from "@grammyjs/conversations";
import { Context } from "grammy";
import { register } from "../database/controllers/auth";
import { createPromocode } from "../database/controllers/promocodes";

export const start = async (ctx: ConversationFlavor<Context>) => {
  await register(ctx);
  await ctx.conversation.enter("start");
};

export const help = async (ctx: ConversationFlavor<Context>) => {
  await ctx.reply("Help");
};
