import { Button, down, left, mouse, right, up } from "@nut-tree/nut-js";
import { ParseAction } from "../controller";

export async function drawRectangle(action: ParseAction) {
  try {
    const [x, y] = action.rest;

    mouse.config.mouseSpeed = 500;

    await mouse.pressButton(Button.LEFT);

    await mouse.move(right(Number(x)));
    await mouse.move(down(Number(y)));
    await mouse.move(left(Number(x)));
    await mouse.move(up(Number(y)));

    await mouse.releaseButton(Button.LEFT);
  } catch (error) {
    throw new Error("error_draw_rectangle");
  }
}
