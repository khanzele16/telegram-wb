import { Context, InlineKeyboard } from "grammy";
import Promocode from "../models/Promocode";
import User from "../models/User";

export const createPromocode = async (ctx: Context) => {
  const promocode = new Promocode({
    code: "test",
    discount: 0.25,
    useNumber: 50,
  });
  await promocode.save();
};

export const getPromocode = async (ctx: Context, userPromocode: string) => {
  try {
    const promocode = await Promocode.findOne({ code: userPromocode });
    const user = await User.findOne({ telegramId: ctx.from?.id });
    
    if (!promocode) {
      await ctx.reply(
        "🤔 Промокод не найден.\n\nМожете попробовать еще раз, введите промокод:",
        { reply_markup: new InlineKeyboard().text("◀️ Назад", "step:video") }
      );
      return;
    }

    // Проверяем, использовал ли пользователь этот промокод
    const userUsedPromocodes = user?.usedPromocodes.find(
      (promo) => promo.toString() === promocode._id.toString()
    );

    if (userUsedPromocodes) {
      await ctx.reply("🤔 Промокод уже использован.");
      return;
    }

    // Проверяем, не исчерпан ли промокод
    if (promocode.useNumber <= 0) {
      await ctx.reply("🤔 Промокод исчерпан.");
      return;
    }

    // Активируем промокод для пользователя
    if (user && promocode._id) {
      user.usedPromocodes.push(promocode._id);
      await user.save();
      
      // Уменьшаем количество использований промокода
      promocode.useNumber -= 1;
      await promocode.save();
    }

    await ctx.reply(
      `🎉 Промокод на скидку в ${Math.round(promocode.discount * 100)}% активирован!`
    );
  } catch (err) {
    console.error("Ошибка при обработке промокода:", err);
    await ctx.reply("❌ Произошла ошибка при обработке промокода. Попробуйте позже.");
  }
};
