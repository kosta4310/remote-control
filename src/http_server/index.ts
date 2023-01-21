import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import { WebSocketServer, createWebSocketStream } from "ws";
import { controller } from "../controller";

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

httpServer.on("close", () => {
  console.log("WebSocketServer was closed");
  webSocketServer.close();
});

const TCP_PORT = 8080;

const webSocketServer = new WebSocketServer({ port: TCP_PORT });

webSocketServer.on("connection", (socket) => {
  const duplex = createWebSocketStream(socket, {
    decodeStrings: false,
  });

  duplex.on("data", async (data: Buffer) => {
    try {
      console.log("Command from client:", data.toString());

      const res = await controller(data.toString());

      duplex.write(res);
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
  console.log(`Tcp server listen on port ${TCP_PORT}`)
);
