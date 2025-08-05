import { InlineKeyboard, type Context } from "grammy";
import { type Conversation } from "@grammyjs/conversations";

export const start = async (conversation: Conversation, ctx: Context) => {
  await ctx.reply(
    "🎉 Ты в боте закрытого канала\n<b>«Эльвира | WB CLUB | Альбина»</b>\n\nЧуть-чуть о нас, если ты ещё не в курсе, куда попал(а):\n\n👋 Привет! Мы — Эльвира и Альбина.\nУже более 5 лет работаем на маркетплейсах, глубоко погружаемся в аналитику и в рекламу , обучаем новичков, менеджеров и практиков.\n\n✅ За плечами:\n\n— 4 потока учеников\n— сотни консультаций\n— десятки сильных кейсов (https://t.me/wbclubotzivi)\n\n<b>📌 Зачем этот канал?</b>\n\nЧтобы ты больше не покупал(а) «воду» под видом обучения.\nЗдесь — максимум пользы:\n\n✅ Только рабочие инструменты\n✅ Только практика\n✅ Только то, что помогает зарабатывать\n\n🔐 Канал закрытый, информация — только для своих.\n👇 Жми старт, чтобы начать.\nДобро пожаловать в комьюнити сильных!",
    {
      reply_markup: new InlineKeyboard().text("✨ Старт", "step:video"),
      parse_mode: "HTML",
    }
  );
  const { callbackQuery } = await conversation.waitFor([
    "message",
    "callback_query",
  ]);
  if (callbackQuery?.data === "step:video") {
    await video(conversation, ctx);
  }
};

const video = async (conversation: Conversation, ctx: Context) => {
  await ctx.replyWithVideo(
    "BAACAgIAAxkBAAMkaI409NfKm8Kn-S0i-IJuK3tYqdEAArh-AAJGMXFI4zid0un5t7w2BA",
    {
      reply_markup: new InlineKeyboard()
        .text("🛒 Приобрести подписку", "step:buy")
        .row()
        .text("🔑 У меня есть промокод", "step:promocode")
        .row()
        .url("❓ Нужна помощь", "https://t.me/WB_Elvira_Albina"),
      caption:
        "🔒ЗАКРЫТЫЙ КАНАЛ ДЛЯ ПРОДАВЦОВ НА WILDBERRIES\n\nТы просил — и мы сделали. Пространство, где каждый урок = рост твоего оборота.\n\n🎁 Что ты получаешь на 30 дней?\n\n✅ Уроки по Mpstats\n✅ Готовые связки для анализа и продвижения\n✅ Подробные разборы карточек\n✅ Таблицы, чек-листы, шпаргалки\n✅ Видео по закупке в Китае + обратная связь\n✅ Уроки по инфографике\n✅ Контакты подрядчиков (фотостудии, байеры, дизайн)\n✅ Прямые эфиры с ответами на вопросы\n\n🔥 Для новичков — стартовый мини-курс:\n- Регистрация ИП/кабинета\n- Создание карточки + SEO\n- Поставки и логистика\n- Алгоритмы ранжирования\n- Пошаговая инструкция запуска\n\nНаши кейсы и отзывы (тут будет ссылка)\n\n💸 Стоимость доступа — всего 1990₽/30 дней\n\nЭто меньше, чем бюджет одной твоей рекламной кампании\n\nТы либо пробуешь с нами, либо покупаешь 💴очередное обучение 📚, которое оставит тебя с вопросами\n\n🔗 Переходи по ссылке в профиле",
    }
  );
  const { callbackQuery } = await conversation.waitFor("callback_query");
  if (callbackQuery.data === "step:buy") {
    await buy(conversation, ctx);
  }
  if (callbackQuery.data === "step:promocode") {
    await promocode(conversation, ctx);
  }
};

const buy = async (conversation: Conversation, ctx: Context) => {
  await ctx.reply("Привет! Как ты?");
};

const promocode = async (conversation: Conversation, ctx: Context) => {
  await ctx.reply("🔑 Введите промокод:", {
    reply_markup: new InlineKeyboard().text("◀️ Назад", "step:video"),
  });
  const { message, callbackQuery } = await conversation.waitFor([
    "message",
    "callback_query",
  ]);
  if (message && message.text) {
    await ctx.reply(`Промокод: ${message.text}`);
  } else if (callbackQuery?.data === "step:video") {
    await video(conversation, ctx);
  }
};
