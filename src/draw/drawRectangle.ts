import { Action } from "../controller";

export function drawRectangle(action: Action) {
  console.log(action.cmd);
  return action.cmd;
}
