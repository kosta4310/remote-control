import { Action } from "../controller";

export function drawSquare(action: Action) {
  console.log(action.cmd);
  return action.cmd;
}
