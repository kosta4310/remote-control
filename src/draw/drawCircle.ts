import { Button, mouse, Point, straightTo, screen } from "@nut-tree/nut-js";
import { Action, ParseAction } from "../controller";

export async function drawCircle(action: ParseAction): Promise<void> {
  try {
    const [r] = action.rest;
    const pos = await mouse.getPosition();
    const boundX = await screen.width();
    const boundY = await screen.height();
    await mouse.pressButton(Button.LEFT);

    for (let i = 270; i < 630; i++) {
      let x = pos.x + Math.cos((Math.PI * i) / 180) * Number(r);
      let y = pos.y + Number(r) + Math.sin((Math.PI * i) / 180) * Number(r);

      x = x < 0 ? 0 : x;
      x = x > boundX ? boundX : x;

      y = y < 80 ? 80 : y;
      y = y > boundY ? boundY - 20 : y;

      await mouse.move(straightTo(new Point(x, y)));
    }
    await mouse.releaseButton(Button.LEFT);
  } catch (error) {
    throw new Error("error");
  }
}
