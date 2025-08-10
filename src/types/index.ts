import { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { HydrateFlavor } from "@grammyjs/hydrate";
import { BotCommand } from "@grammyjs/types";
import { Context } from "grammy";

export interface ICommand extends BotCommand {
  action: (ctx: ConversationFlavor<Context>) => Promise<void>;
}

export type MyContext = ConversationFlavor<Context>;
export type MyConversationContext = HydrateFlavor<Context>;
export type MyConversation = Conversation<MyContext, MyConversationContext>;