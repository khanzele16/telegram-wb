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
const mongoose_1 = __importDefault(require("mongoose"));
const node_cron_1 = __importDefault(require("node-cron"));
const dotenv_1 = __importDefault(require("dotenv"));
const grammy_1 = require("grammy");
const conversations_1 = require("@grammyjs/conversations");
const conversations_2 = require("./src/conversations");
const config_1 = require("./src/config");
const hydrate_1 = require("@grammyjs/hydrate");
dotenv_1.default.config();
const bot = new grammy_1.Bot(process.env.BOT_TOKEN);
mongoose_1.default.connect(process.env.MONGO_URL);
bot.use((0, conversations_1.conversations)());
bot.command("start", (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.conversation.exit("start");
    return next();
}));
bot.use((0, conversations_1.createConversation)(conversations_2.start, { plugins: [(0, hydrate_1.hydrate)()] }));
node_cron_1.default.schedule('* * * * *', () => {
    const now = new Date().toLocaleString();
    console.log(`[CRON] Задача сработала в ${now}`);
});
console.log('CRON-тест запущен. Ждём срабатывания...');
config_1.commands.map((command) => {
    bot.command(command.command, command.action);
});
bot.on("message", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.reply(JSON.stringify(ctx.from));
}));
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof grammy_1.GrammyError) {
        console.error("Error in request:", e.description);
    }
    else if (e instanceof grammy_1.HttpError) {
        console.error("Could not contact Telegram:", e);
    }
    else {
        console.error("Unknown error:", e);
    }
});
bot.start();
