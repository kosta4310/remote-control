import {
  Button,
  down,
  left,
  mouse,
  Point,
  right,
  straightTo,
  up,
} from "@nut-tree/nut-js";
import { Action, ParseAction } from "../controller";

export async function drawSquare(action: ParseAction) {
  try {
    const [x] = action.rest;
    // let target = new Point(500, 350);

    // await mouse.move(straightTo(target));
    mouse.config.mouseSpeed = 500;

    await mouse.pressButton(Button.LEFT);

    await mouse.move(right(Number(x)));
    await mouse.move(down(Number(x)));
    await mouse.move(left(Number(x)));
    await mouse.move(up(Number(x)));

    await mouse.releaseButton(Button.LEFT);
  } catch (error) {
    throw new Error("error");
  }
}
