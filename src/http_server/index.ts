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

  duplex.on("end", async () => {
    console.log("Client closed the connection");
  });

  socket.on("error", (socket) => console.log(`error socket: ${socket}`));
});

webSocketServer.on("listening", () =>
  console.log(`Tcp server listen on port ${TCP_PORT} pid: ${process.pid}`)
);

process.on("SIGINT", () => {
  console.log("Server was closed");

  httpServer.close();
  webSocketServer.close();
});
