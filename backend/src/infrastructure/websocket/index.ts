import type { Server as HttpServer } from "node:http";
import { WebSocketServer } from "./WebSocketServer.js";

let websocketServer: WebSocketServer | null = null;

export const initializeWebSocketServer = (
  httpServer: HttpServer,
): WebSocketServer => {
  websocketServer = new WebSocketServer(httpServer);

  return websocketServer;
};

export const getWebSocketServer = (): WebSocketServer => {
  if (!websocketServer) {
    throw new Error("WebSocket server has not been initialized");
  }

  return websocketServer;
};
