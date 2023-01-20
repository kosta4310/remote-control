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

type Callback = (action: Action) => string;

const active: {
  [key: string]: (
    action: ParseAction
  ) => Promise<string | void> | string | void;
} = {
  mouse: (action: ParseAction) => mouseMove(action),
  // mouse_down: (action: Action) => mouseMove(action),
  // mouse_left: (action: Action) => mouseMove(action),
  // mouse_right: (action: Action) => mouseMove(action),
  // mouse_position: (action: Action) => mousePosition(action),
  draw: (action: ParseAction) => drawing(action),
  // draw_circle: (action: Action) => mousePosition(action),
  // draw_rectangle: (action: Action) => mousePosition(action),
  // draw_square: (action: Action) => mousePosition(action),
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
