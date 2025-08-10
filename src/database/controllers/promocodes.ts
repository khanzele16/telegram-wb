import User from "../models/User";
import Promocode from "../models/Promocode";
import { Context, InlineKeyboard } from "grammy";
import { video } from "../../conversations";
import { type MyConversation, MyConversationContext } from "../../types";

export const createPromocode = async (ctx: Context) => {
  const promocode = new Promocode({
    code: "test",
    discount: 0.25,
    useNumber: 50,
  });
  await promocode.save();
};

export const getPromocode = async (
  conversation: MyConversation,
  ctx: MyConversationContext,
  userPromocode: string
) => {
  try {
    const promocode = await Promocode.findOne({ code: userPromocode });
    const user = await User.findOne({ telegramId: ctx.from?.id });
    if (!promocode) {
      await ctx.reply(
        "🤔 Промокод не найден.\n\nМожете попробовать еще раз, введите промокод:",
        { reply_markup: new InlineKeyboard().text("◀️ Назад", "step:video") }
      );
      const { message, callbackQuery } = await conversation.waitFor([
        "message",
        "callback_query",
      ]);
      if (message && message.text) {
        await getPromocode(conversation, ctx, message.text);
      } else if (callbackQuery?.data === "step:video") {
        await ctx.api.answerCallbackQuery(callbackQuery.id, {
          text: "◀️ Назад",
        });
        await video(conversation, ctx);
      }
      return;
    }
    if (user?.activePromocode) {
      await ctx.reply(
        "⚠️ У вас уже есть активный промокод. Сначала используйте его для покупки подписки.",
        { reply_markup: new InlineKeyboard().text("◀️ Назад", "step:video") }
      );
      const { callbackQuery } = await conversation.waitFor("callback_query");
      if (callbackQuery?.data === "step:video") {
        await ctx.api.answerCallbackQuery(callbackQuery.id, {
          text: "◀️ Назад",
        });
        await video(conversation, ctx);
      }
      return;
    }
    const userUsedPromocodes = user?.usedPromocodes.find(
      (promo) => promo.toString() === promocode._id.toString()
    );
    if (userUsedPromocodes) {
      await ctx.reply("🤔 Промокод уже использован.", {
        reply_markup: new InlineKeyboard().text("◀️ Назад", "step:video"),
      });
      return;
    }
    if (promocode.useNumber <= 0) {
      await ctx.reply("🤔 Промокод исчерпан.", {
        reply_markup: new InlineKeyboard().text("◀️ Назад", "step:video"),
      });
      return;
    }
    if (user && promocode._id) {
      user.activePromocode = promocode._id;
      user.usedPromocodes.push(promocode._id);
      await user.save();
      promocode.useNumber -= 1;
      await promocode.save();
    }
    await ctx.reply(
      `🎉 Промокод на скидку в ${Math.round(
        promocode.discount * 100
      )}% активирован!\n\nТеперь вы можете использовать его при покупке подписки.`
    );
  } catch (err) {
    console.error("Ошибка при обработке промокода:", err);
    await ctx.reply(
      "❌ Произошла ошибка при обработке промокода. Попробуйте позже."
    );
  }
};

export const isActivePromocode = async (
  conversation: MyConversation,
  ctx: MyConversationContext
) => {
  const user = await User.findOne({ telegramId: ctx.from?.id });
  if (user?.activePromocode) {
    const promocode = await Promocode.findById(user.activePromocode);
    if (promocode) {
      await ctx.reply(
        `⚠️ У вас уже есть активный промокод: <b>${
          promocode.code
        }</b>\nСкидка: ${Math.round(
          promocode.discount * 100
        )}%\n\nСначала используйте его для покупки подписки.`,
        {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard().text("◀️ Назад", "step:video"),
        }
      );
      const { callbackQuery } = await conversation.waitFor("callback_query");
      if (callbackQuery?.data === "step:video") {
        await ctx.api.answerCallbackQuery(callbackQuery.id, {
          text: "◀️ Назад",
        });
        await video(conversation, ctx);
      }
      return true;
    }
  }
  return false;
};

export const isPromocode = async (ctx: MyConversationContext) => {
  const user = await User.findOne({ telegramId: ctx.from?.id });
  if (user?.activePromocode) {
    const promocode = await Promocode.findById(user.activePromocode);
    if (promocode) {
      return promocode;
    } else {
      return false;
    }
  }
  return false;
};
