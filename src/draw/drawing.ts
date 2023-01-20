import { ParseAction } from "../controller";
import { drawCircle } from "./drawCircle";
import { drawRectangle } from "./drawRectangle";
import { drawSquare } from "./drawSquare";

const drawAction: { [key: string]: (action: ParseAction) => Promise<void> } = {
  circle: drawCircle,
  square: drawSquare,
  rectangle: drawRectangle
};

export async function drawing(action: ParseAction) {
  try {
    const cb = drawAction[action.subcommand];
    await cb(action);
    return `${action.command}_${action.subcommand}`;
  } catch (error) {}
}
