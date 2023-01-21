import { ParseAction } from "../controller";
import {
  mouse,
  left,
  right,
  up,
  down,
  MouseClass,
  Point,
} from "@nut-tree/nut-js";

const mouseAction: {
  [key: string]: (px: number) => Promise<MouseClass | Point>;
} = {
  left: (px: number) => mouse.move(left(px)),
  up: (px: number) => mouse.move(up(px)),
  right: (px: number) => mouse.move(right(px)),
  down: (px: number) => mouse.move(down(px)),
  position: () => mouse.getPosition(),
};

export async function mouseMove({ command, subcommand, rest }: ParseAction) {
  try {
    let cmd = `${command}_${subcommand}`;

    if (cmd === "mouse_position") {
      const { x, y } = await mouse.getPosition();

      cmd = `${cmd} ${x},${y}`;
      console.log("Response from server:", cmd);
    } else {
      const [x] = rest;
      const cb = mouseAction[subcommand];
      await cb(Number(x));
      cmd = `${cmd} ${x}`;
    }

    return cmd;
  } catch (error) {
    throw new Error("error");
  }
}
