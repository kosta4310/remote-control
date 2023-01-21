import { screen, Region, mouse } from "@nut-tree/nut-js";
import jimp from "jimp";

export async function printScreen() {
  try {
    const { x, y } = await mouse.getPosition();
    const image = await screen.grabRegion(new Region(x, y, 200, 200));

    const imgRGB = await image.toRGB();

    const jimpImg = new jimp(imgRGB, (err) => {
      if (err) {
        console.log(err);
      }
    });

    const buffer = await jimpImg.getBufferAsync(jimp.MIME_PNG);

    const stringBase64 = buffer.toString("base64");

    console.log(`image buffer size: ${stringBase64.length}bytes`);

    return `prnt_scrn ${stringBase64}`;
  } catch (error) {
    throw "error_print_screen";
  }
}
