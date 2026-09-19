import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { config } from "../../config/env.js";
import { parseCookies } from "./parseCookies.js";
import { verifyAccessToken } from "../../middleware/accessToken.js";
import type { AccessTokenPayload } from "../../modules/auth/types/session.types.js";

export class WebSocketServer {
  private readonly io: Server;

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: config.frontend.url,
        credentials: true,
      },
    });

    this.registerAuthentication();
    this.registerConnectionHandler();
  }
  private registerAuthentication(): void {
    this.io.use(async (socket, next) => {
      try {
        const cookies = parseCookies(socket.handshake.headers.cookie);

        const accessToken = cookies.access_token;

        if (!accessToken) {
          return next(new Error("Authentication required"));
        }

        const user = await verifyAccessToken(accessToken);

        socket.data.user = user;

        next();
      } catch {
        next(new Error("Invalid or expired access token"));
      }
    });
  }

  private registerConnectionHandler(): void {
    this.io.on("connection", (socket) => {
      const user = socket.data.user as AccessTokenPayload;

      const room = `user:${user.id}`;

      socket.join(room);

      console.log(
        `WebSocket connected: ${socket.id} | user: ${user.name} | room: ${room}`,
      );

      socket.on("disconnect", (reason) => {
        console.log(`WebSocket disconnected: ${socket.id} (${reason})`);
      });
    });
  }
}
