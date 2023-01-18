import { controller } from "./controller";
import { parseMessage } from "./func/parseMessage";

export async function dispatcher(data: string) {
  try {
    const action = parseMessage(data);
    const callback = await controller(action);
    return callback;
  } catch (error) {
    throw error;
  }
}
