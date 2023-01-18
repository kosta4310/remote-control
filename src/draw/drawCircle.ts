import { Action } from "../controller";

export function drawCircle(action: Action) {
  const [_, drawCmd] = action.cmd.split("_");

  console.log(action.cmd);
  return action.cmd;
}
