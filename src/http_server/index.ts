import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import { WebSocketServer, createWebSocketStream } from "ws";
import { controller } from "../controller";
import internal from "stream";

export const httpServer = http.createServer(function (req, res) {
  const __dirname = path.resolve(path.dirname(""));
  const file_path =
    __dirname + (req.url === "/" ? "/front/index.html" : "/front" + req.url);
  fs.readFile(file_path, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

const TCP_PORT = 8080;

const webSocketServer = new WebSocketServer({ port: TCP_PORT });

export let duplex: internal.Duplex;
webSocketServer.on("connection", (socket) => {
  duplex = createWebSocketStream(socket, {
    decodeStrings: false,
  });

  duplex.on("data", async (data: Buffer) => {
    try {
      console.log("Command from client:", data.toString());

      await controller(data.toString());
    } catch (error) {
      if (typeof error === "string") {
        console.log(error);
        duplex.write(error);
      } else {
        console.log(`Error`);
        duplex.write("Error");
      }
    }
  });

  duplex.on("end", () => {
    // duplex.write("server_will_be_been_closed");
    console.log("Socket is closed");
  });

  socket.on("error", (socket) => console.log(`error socket: ${socket}`));
});

webSocketServer.on("listening", () =>
  console.log(`Tcp server listen on port ${TCP_PORT} pid: ${process.pid}`)
);

process.on("SIGINT", () => {
  console.log("\nAll connection and sockets will closed");
  webSocketServer.clients.forEach((socket) => {
    socket.send("server_was_closed");
    socket.close();
  });
  webSocketServer.close();
  httpServer.close(() => process.exit(0));
});

httpServer.on("close", () => console.log("Http server is closed"));
webSocketServer.on("close", () => console.log("Tcp server is closed"));
