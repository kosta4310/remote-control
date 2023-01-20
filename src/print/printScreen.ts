import { Action, ParseAction } from "../controller";
import { FileType, screen, Region } from "@nut-tree/nut-js";
import fs from "node:fs/promises";
import jimp from "jimp";

export async function printScreen() {
  try {
    // await screen.captureRegion(
    //   "snapshot.png",
    //   new Region(100, 100, 200, 200),
    //   FileType.PNG
    // );
    // const rs = await fs.readFile("snapshot.png", { encoding: "base64" });

    const image = await screen.grabRegion(new Region(100, 100, 50, 50));
    const imgRGB = await image.toRGB();
    const buf = Buffer.from(imgRGB.data);

    const res = await jimp.read(buf, (err, img) => {
      if (err) {
        console.log(err);
      }
      return `prnt_scrn ${img}`;
    });
  } catch (error) {
    throw "error_print_screen";
  }
}
