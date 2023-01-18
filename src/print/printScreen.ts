import { Action } from "../controller";

export function printScreen(action: Action) {
  console.log(action.cmd);
  return action.cmd;
}
