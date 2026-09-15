import { EncryptJWT, jwtDecrypt } from "jose";
import type { AccessTokenPayload } from "../modules/auth/types/session.types.js";
import { ACCESS_TOKEN_TTL } from "../modules/auth/config/token-config.js";
import { config } from "../config/env.js";

const encryptionKey = Buffer.from(config.JWT_ENCRYPTION_KEY, "base64");

const isAccessTokenPayload = (
  payload: unknown,
): payload is AccessTokenPayload => {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const candidate = payload as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.role === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.name === "string"
  );
};

export const signAccessToken = (
  payload: AccessTokenPayload,
): Promise<string> => {
  return new EncryptJWT({ ...payload })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .encrypt(encryptionKey);
};

export const verifyAccessToken = async (
  token: string,
): Promise<AccessTokenPayload> => {
  const { payload } = await jwtDecrypt(token, encryptionKey);

  if (!isAccessTokenPayload(payload)) {
    throw new Error("Malformed access token payload");
  }

  return payload;
};
