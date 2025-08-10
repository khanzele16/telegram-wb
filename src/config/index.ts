import { start, help } from "../lib/commands";
import { ICommand } from "../types";

export const commands: ICommand[] = [
  { command: "start", description: "Запустить бота", action: start },
  { command: "help", description: "Помощь", action: help },
];