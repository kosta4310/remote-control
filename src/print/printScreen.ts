import { screen, Region, mouse, FileType } from "@nut-tree/nut-js";
import fs from "fs/promises";
import { duplex } from "../http_server";

export async function printScreen() {
  try {
    const { x, y } = await mouse.getPosition();
    const boundX = await screen.width();
    const boundY = await screen.height();

    let abscissa = x - 100 > 0 ? x - 100 : 0;
    abscissa = abscissa + 200 > boundX ? boundX - 200 : abscissa;

    let ordinate = y - 100 > 0 ? y - 100 : 0;
    ordinate = ordinate + 200 > boundY ? boundY - 200 : ordinate;

    screen.highlight(new Region(abscissa, ordinate, 200, 200));

    await screen.captureRegion(
      "screenshot",
      new Region(abscissa, ordinate, 200, 200),
      FileType.PNG,
      "./"
    );

    const readFile = await fs.readFile("./screenshot.png", {
      encoding: "base64",
    });
    console.log(`Response from server: prnt_scrn ${readFile.length}bytes`);

    duplex.write(`prnt_scrn ${readFile}`);
  } catch (error) {
    throw new Error("error_print_screen");
  }
}
