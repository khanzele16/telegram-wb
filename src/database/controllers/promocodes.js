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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPromocode = exports.isActivePromocode = exports.getPromocode = exports.createPromocode = void 0;
const User_1 = __importDefault(require("../models/User"));
const Promocode_1 = __importDefault(require("../models/Promocode"));
const grammy_1 = require("grammy");
const conversations_1 = require("../../conversations");
const createPromocode = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const promocode = new Promocode_1.default({
        code: "test",
        discount: 0.25,
        useNumber: 50,
    });
    yield promocode.save();
});
exports.createPromocode = createPromocode;
const getPromocode = (conversation, ctx, userPromocode) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const promocode = yield Promocode_1.default.findOne({ code: userPromocode });
        const user = yield User_1.default.findOne({ telegramId: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id });
        if (!promocode) {
            yield ctx.reply("🤔 Промокод не найден.\n\nМожете попробовать еще раз, введите промокод:", { reply_markup: new grammy_1.InlineKeyboard().text("◀️ Назад", "step:video") });
            const { message, callbackQuery } = yield conversation.waitFor([
                "message",
                "callback_query",
            ]);
            if (message && message.text) {
                yield (0, exports.getPromocode)(conversation, ctx, message.text);
            }
            else if ((callbackQuery === null || callbackQuery === void 0 ? void 0 : callbackQuery.data) === "step:video") {
                yield ctx.api.answerCallbackQuery(callbackQuery.id, {
                    text: "◀️ Назад",
                });
                yield (0, conversations_1.video)(conversation, ctx);
            }
            return;
        }
        if (user === null || user === void 0 ? void 0 : user.activePromocode) {
            yield ctx.reply("⚠️ У вас уже есть активный промокод. Сначала используйте его для покупки подписки.", { reply_markup: new grammy_1.InlineKeyboard().text("◀️ Назад", "step:video") });
            const { callbackQuery } = yield conversation.waitFor("callback_query");
            if ((callbackQuery === null || callbackQuery === void 0 ? void 0 : callbackQuery.data) === "step:video") {
                yield ctx.api.answerCallbackQuery(callbackQuery.id, {
                    text: "◀️ Назад",
                });
                yield (0, conversations_1.video)(conversation, ctx);
            }
            return;
        }
        const userUsedPromocodes = user === null || user === void 0 ? void 0 : user.usedPromocodes.find((promo) => promo.toString() === promocode._id.toString());
        if (userUsedPromocodes) {
            yield ctx.reply("🤔 Промокод уже использован.", {
                reply_markup: new grammy_1.InlineKeyboard().text("◀️ Назад", "step:video"),
            });
            return;
        }
        if (promocode.useNumber <= 0) {
            yield ctx.reply("🤔 Промокод исчерпан.", {
                reply_markup: new grammy_1.InlineKeyboard().text("◀️ Назад", "step:video"),
            });
            return;
        }
        if (user && promocode._id) {
            user.activePromocode = promocode._id;
            user.usedPromocodes.push(promocode._id);
            yield user.save();
            promocode.useNumber -= 1;
            yield promocode.save();
        }
        yield ctx.reply(`🎉 Промокод на скидку в ${Math.round(promocode.discount * 100)}% активирован!\n\nТеперь вы можете использовать его при покупке подписки.`);
    }
    catch (err) {
        console.error("Ошибка при обработке промокода:", err);
        yield ctx.reply("❌ Произошла ошибка при обработке промокода. Попробуйте позже.");
    }
});
exports.getPromocode = getPromocode;
const isActivePromocode = (conversation, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield User_1.default.findOne({ telegramId: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id });
    if (user === null || user === void 0 ? void 0 : user.activePromocode) {
        const promocode = yield Promocode_1.default.findById(user.activePromocode);
        if (promocode) {
            yield ctx.reply(`⚠️ У вас уже есть активный промокод: <b>${promocode.code}</b>\nСкидка: ${Math.round(promocode.discount * 100)}%\n\nСначала используйте его для покупки подписки.`, {
                parse_mode: "HTML",
                reply_markup: new grammy_1.InlineKeyboard().text("◀️ Назад", "step:video"),
            });
            const { callbackQuery } = yield conversation.waitFor("callback_query");
            if ((callbackQuery === null || callbackQuery === void 0 ? void 0 : callbackQuery.data) === "step:video") {
                yield ctx.api.answerCallbackQuery(callbackQuery.id, {
                    text: "◀️ Назад",
                });
                yield (0, conversations_1.video)(conversation, ctx);
            }
            return true;
        }
    }
    return false;
});
exports.isActivePromocode = isActivePromocode;
const isPromocode = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield User_1.default.findOne({ telegramId: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id });
    if (user === null || user === void 0 ? void 0 : user.activePromocode) {
        const promocode = yield Promocode_1.default.findById(user.activePromocode);
        if (promocode) {
            return promocode;
        }
        else {
            return false;
        }
    }
    return false;
});
exports.isPromocode = isPromocode;
