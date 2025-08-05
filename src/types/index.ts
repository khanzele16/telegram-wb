import { ConversationFlavor } from "@grammyjs/conversations";
import { BotCommand } from "@grammyjs/types";
import { Context } from "grammy";

export interface ICommand extends BotCommand {
  action: (ctx: ConversationFlavor<Context>) => Promise<void>;
}
