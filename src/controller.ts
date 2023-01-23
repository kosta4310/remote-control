import { drawing } from "./draw/drawing";
import { parseMessage } from "./func/parseMessage";
import { mouseMove } from "./mouse/mouseMove";
import { printScreen } from "./print/printScreen";

export type Action = {
  cmd: string;
  rest: Array<string>;
};

export type ParseAction = {
  command: string;
  subcommand: string;
  rest: Array<string>;
};

const active: {
  [key: string]: (
    action: ParseAction
  ) => Promise<string | void> | string | void;
} = {
  mouse: (action: ParseAction) => mouseMove(action),
  draw: (action: ParseAction) => drawing(action),
  prnt: () => printScreen(),
};

export async function controller(data: string) {
  try {
    const action = parseMessage(data);
    const [command, subcommand] = action.cmd.split("_");
    return await active[command]({ command, subcommand, rest: action.rest });
  } catch (error) {
    throw error;
  }
}
