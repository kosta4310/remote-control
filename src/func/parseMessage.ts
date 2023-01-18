export function parseMessage(msg: string) {
  const [cmd, ...rest] = msg.split(" ");
  return { cmd, rest };
}
