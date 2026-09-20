import type { Server as HttpServer } from "node:http";
import { WebSocketServer } from "./WebSocketServer.js";

export const initializeWebSocketServer = (
  httpServer: HttpServer,
): WebSocketServer => {
  return new WebSocketServer(httpServer);
};
