"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.video = exports.start = void 0;
const grammy_1 = require("grammy");
const promocodes_1 = require("../database/controllers/promocodes");
const lib_1 = require("../lib");
const start = (conversation, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply("🎉 Ты в боте закрытого канала\n<b>«Эльвира | WB CLUB | Альбина»</b>\n\nЧуть-чуть о нас, если ты ещё не в курсе, куда попал(а):\n\n👋 Привет! Мы — Эльвира и Альбина.\nУже более 5 лет работаем на маркетплейсах, глубоко погружаемся в аналитику и в рекламу , обучаем новичков, менеджеров и практиков.\n\n✅ За плечами:\n\n— 4 потока учеников\n— сотни консультаций\n— десятки сильных кейсов (https://t.me/wbclubotzivi)\n\n<b>📌 Зачем этот канал?</b>\n\nЧтобы ты больше не покупал(а) «воду» под видом обучения.\nЗдесь — максимум пользы:\n\n✅ Только рабочие инструменты\n✅ Только практика\n✅ Только то, что помогает зарабатывать\n\n🔐 Канал закрытый, информация — только для своих.\n👇 Жми старт, чтобы начать.\nДобро пожаловать в комьюнити сильных!", {
        reply_markup: new grammy_1.InlineKeyboard().text("✨ Старт", "step:video"),
        parse_mode: "HTML",
    });
    const { callbackQuery } = yield conversation.waitFor("callback_query");
    if (callbackQuery.data === "step:video") {
        yield ctx.api.answerCallbackQuery(callbackQuery.id, {
            text: "Начало положено!",
        });
        yield (0, exports.video)(conversation, ctx);
    }
});
exports.start = start;
const video = (conversation, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.replyWithVideo("BAACAgIAAxkBAAMkaI409NfKm8Kn-S0i-IJuK3tYqdEAArh-AAJGMXFI4zid0un5t7w2BA", {
        reply_markup: new grammy_1.InlineKeyboard()
            .text("🛒 Приобрести подписку", "step:buy")
            .row()
            .text("🔑 У меня есть промокод", "step:promocode")
            .row()
            .url("❓ Нужна помощь", "https://t.me/WB_Elvira_Albina"),
        caption: "🔒ЗАКРЫТЫЙ КАНАЛ ДЛЯ ПРОДАВЦОВ НА WILDBERRIES\n\nТы просил — и мы сделали. Пространство, где каждый урок = рост твоего оборота.\n\n🎁 Что ты получаешь на 30 дней?\n\n✅ Уроки по Mpstats\n✅ Готовые связки для анализа и продвижения\n✅ Подробные разборы карточек\n✅ Таблицы, чек-листы, шпаргалки\n✅ Видео по закупке в Китае + обратная связь\n✅ Уроки по инфографике\n✅ Контакты подрядчиков (фотостудии, байеры, дизайн)\n✅ Прямые эфиры с ответами на вопросы\n\n🔥 Для новичков — стартовый мини-курс:\n- Регистрация ИП/кабинета\n- Создание карточки + SEO\n- Поставки и логистика\n- Алгоритмы ранжирования\n- Пошаговая инструкция запуска\n\nНаши кейсы и отзывы (тут будет ссылка)\n\n💸 Стоимость доступа — всего 1990₽/30 дней\n\nЭто меньше, чем бюджет одной твоей рекламной кампании\n\nТы либо пробуешь с нами, либо покупаешь 💴очередное обучение 📚, которое оставит тебя с вопросами\n\n🔗 Переходи по ссылке в профиле",
    });
    const { callbackQuery } = yield conversation.waitFor("callback_query");
    if (callbackQuery.data === "step:buy") {
        yield ctx.api.answerCallbackQuery(callbackQuery.id, {
            text: "🛒 Приобрести подписку",
        });
        yield buy(conversation, ctx);
    }
    if (callbackQuery.data === "step:promocode") {
        yield ctx.api.answerCallbackQuery(callbackQuery.id, {
            text: "🔑 Ввести промокод",
        });
        yield promocode(conversation, ctx);
    }
});
exports.video = video;
const buy = (conversation, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const hasActive = yield (0, promocodes_1.isPromocode)(ctx);
    if (hasActive === false) {
        yield ctx.reply(`🛒 <b>Приобрести подписку</b>\n\nСтоимость — <b>1990₽</b> за 30 дней.\n\nПосле оплаты вы в течении 10 минут получите доступ в <b>закрытый Telegram-канал</b> 🔒`, {
            reply_markup: new grammy_1.InlineKeyboard()
                .url(`Оплатить 1990₽`, yield (0, lib_1.prodamusHref)((_b = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : 1))
                .row()
                .text("◀️ Назад", "step:video"),
            parse_mode: "HTML",
        });
        const { callbackQuery } = yield conversation.waitFor("callback_query");
        if ((callbackQuery === null || callbackQuery === void 0 ? void 0 : callbackQuery.data) === "step:video") {
            yield ctx.api.answerCallbackQuery(callbackQuery.id, {
                text: "◀️ Назад",
            });
            yield (0, exports.video)(conversation, ctx);
        }
    }
    else {
        const price = Math.round(2000 * (1 - hasActive.discount));
        yield ctx.reply(`🛒 <b>Приобрести подписку</b>\n\n⚠️ У вас активирован промокод <b>${hasActive.code}</b> на скидку в <b>${hasActive.discount * 100}%</b>\nСтоимость — <b>${price}₽</b> за 30 дней.\n\nПосле оплаты вы автоматически получите доступ в <b>закрытый Telegram-канал</b> 🔒`, {
            reply_markup: new grammy_1.InlineKeyboard()
                .url(`Оплатить ${price}₽`, yield (0, lib_1.prodamusHref)((_d = (_c = ctx.from) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : 1, hasActive.discount))
                .row()
                .text("◀️ Назад", "step:video"),
            parse_mode: "HTML",
        });
        const { callbackQuery } = yield conversation.waitFor("callback_query");
        if ((callbackQuery === null || callbackQuery === void 0 ? void 0 : callbackQuery.data) === "step:video") {
            yield ctx.api.answerCallbackQuery(callbackQuery.id, {
                text: "◀️ Назад",
            });
            yield (0, exports.video)(conversation, ctx);
        }
    }
});
const promocode = (conversation, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const hasActive = yield (0, promocodes_1.isActivePromocode)(conversation, ctx);
    if (hasActive)
        return;
    yield ctx.reply("🔑 Введите промокод:", {
        reply_markup: new grammy_1.InlineKeyboard().text("◀️ Назад", "step:video"),
    });
    const { message, callbackQuery } = yield conversation.waitFor([
        "message",
        "callback_query",
    ]);
    if (message && message.text) {
        yield (0, promocodes_1.getPromocode)(conversation, ctx, message.text);
    }
    else if ((callbackQuery === null || callbackQuery === void 0 ? void 0 : callbackQuery.data) === "step:video") {
        yield (0, exports.video)(conversation, ctx);
    }
});
