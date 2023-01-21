import { screen, Region, mouse } from "@nut-tree/nut-js";
import jimp from "jimp";
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

    const image = await screen.grabRegion(
      new Region(abscissa, ordinate, 200, 200)
    );

    const imgRGB = await image.toRGB();

    const jimpImg = new jimp(imgRGB, (err) => {
      if (err) {
        console.log(err);
      }
    });

    const buffer = await jimpImg.getBufferAsync(jimp.MIME_PNG);

    const stringBase64 = buffer.toString("base64");

    console.log(`image buffer size: ${stringBase64.length}bytes`);

    duplex.write(`prnt_scrn ${stringBase64}`);
  } catch (error) {
    throw new Error("error_print_screen");
  }
}
