import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { config } from "../../config/env.js";

export class WebSocketServer {
  private readonly io: Server;

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: config.frontend.url,
        credentials: true,
      },
    });

    this.registerConnectionHandler();
  }

  private registerConnectionHandler(): void {
    this.io.on("connection", (socket) => {
      console.log(`WebSocket connected: ${socket.id}`);

      socket.on("disconnect", (reason) => {
        console.log(`WebSocket disconnected: ${socket.id} (${reason})`);
      });
    });
  }
}
