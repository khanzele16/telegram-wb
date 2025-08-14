"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
const commands_1 = require("../lib/commands");
exports.commands = [
    { command: "start", description: "Запустить бота", action: commands_1.start },
    { command: "help", description: "Помощь", action: commands_1.help },
];
