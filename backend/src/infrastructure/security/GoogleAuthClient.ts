import { OAuth2Client } from "google-auth-library";
import { AppError } from "../../errors/AppError.js";
import type {
  GoogleAuthVerifier,
  GoogleUserPayload,
} from "./GoogleAuthVerifier.js";

export class GoogleAuthClient implements GoogleAuthVerifier {
  private readonly client: OAuth2Client;

  constructor(private readonly clientId: string) {
    this.client = new OAuth2Client(clientId);
  }

  async verify(idToken: string): Promise<GoogleUserPayload> {
    let ticket;

    try {
      ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.clientId,
      });
    } catch {
      throw new AppError("Invalid Google token", 401);
    }

    const payload = ticket.getPayload();

    if (!payload || !payload.sub || !payload.email) {
      throw new AppError("Invalid Google token", 401);
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name ?? payload.email,
      emailVerified: payload.email_verified ?? false,
    };
  }
}
