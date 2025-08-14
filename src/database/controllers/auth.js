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
exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const register = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const isUserExist = yield User_1.default.findOne({ telegramId: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id });
    if (!isUserExist) {
        if (!((_b = ctx.from) === null || _b === void 0 ? void 0 : _b.username)) {
            const user = new User_1.default({
                telegramId: (_c = ctx.from) === null || _c === void 0 ? void 0 : _c.id,
            });
            yield user.save();
        }
        else {
            const user = new User_1.default({
                telegramId: (_d = ctx.from) === null || _d === void 0 ? void 0 : _d.id,
                username: (_e = ctx.from) === null || _e === void 0 ? void 0 : _e.username,
            });
            yield user.save();
        }
    }
});
exports.register = register;
