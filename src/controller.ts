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
  [key: string]: (action: ParseAction) => Promise<string> | string;
} = {
  mouse: (action: ParseAction) => mouseMove(action),
  // mouse_down: (action: Action) => mouseMove(action),
  // mouse_left: (action: Action) => mouseMove(action),
  // mouse_right: (action: Action) => mouseMove(action),
  // mouse_position: (action: Action) => mousePosition(action),
  // draw_circle: (action: Action) => mousePosition(action),
  // draw_rectangle: (action: Action) => mousePosition(action),
  // draw_square: (action: Action) => mousePosition(action),
  // prnt_scrn: (action: Action) => printScreen(action),
};

export async function controller(action: Action) {
  try {
    const [command, subcommand] = action.cmd.split("_");
    return await active[command]({ command, subcommand, rest: action.rest });
  } catch (error) {
    throw error;
  }
}
