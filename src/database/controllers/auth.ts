import { Context } from "grammy";
import User from "../models/User";

export const register = async (ctx: Context) => {
  const isUserExist = await User.findOne({ telegramId: ctx.from?.id });
  if (!isUserExist) {
    if (!ctx.from?.username) {
      const user = new User({
        telegramId: ctx.from?.id,
      });
      await user.save();
    } else {
      const user = new User({
        telegramId: ctx.from?.id,
        username: ctx.from?.username,
      });
      await user.save();
    }
  }
};
