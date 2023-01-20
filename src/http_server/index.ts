import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import { WebSocketServer, createWebSocketStream } from "ws";
import { mouse, left, right, up, down } from "@nut-tree/nut-js";
import { parseMessage } from "../func/parseMessage";
import { controller } from "../controller";
// import { dispatcher } from "../dispatcher";

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

webSocketServer.on("connection", (socket, req) => {
  const duplex = createWebSocketStream(socket, {
    // encoding: "utf8",
    decodeStrings: false,
  });

  const data: Array<string> = [];

  duplex.on("data", async (data: Buffer) => {
    try {
      console.log("Command from client:", data.toString());

      const res = await controller(data.toString());

      // console.log(res);
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
    // console.log("end" + data);
    console.log("Client closed the connection");
  });
  // console.log("Client is connected");

  // socket.on("open", () => console.log("open"));
  // socket.on("message", async (data) => {
  //   try {
  //     const res = await controller(data.toString());
  //     console.log(res);

  //     socket.send(res);
  //   } catch (error) {
  //     console.log(`Error`);
  //     socket.send("Error_on_frontend");
  //   }
  // });

  socket.on("error", (socket) => console.log(`error socket: ${socket}`));
  // socket.on("close", () => {
  //   console.log("Client closed the connection");
  //   duplex.destroy();
  // });
  socket.on("upgrade", (req) => console.log("upgrade"));
});

webSocketServer.on("listening", () =>
  console.log(`Tcp server listen on port ${TCP_PORT}`)
);
