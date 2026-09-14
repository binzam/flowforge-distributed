import jwt from "jsonwebtoken";
import { AppError } from "../../../errors/AppError.js";
import type { PasswordHasher } from "../../../infrastructure/security/PasswordHasher.js";
import type { UserRepository } from "../../users/repositories/UserRepository.js";
import type { LoginInput } from "../schemas/auth.schemas.js";
import type { User } from "../../users/types/user.types.js";
import type { SessionRepository } from "../repositories/SessionRepository.js";
import type { AccessTokenPayload } from "../types/session.types.js";
import { config } from "../../../config/env.js";

const ACCESS_TOKEN_TTL = "5m";
const REFRESH_TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async login(input: LoginInput): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const passwordMatches = await this.passwordHasher.verify(
      input.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new AppError("Invalid email or password", 401);
    }

    const refreshExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
    const session = await this.sessionRepository.create(
      user.id,
      refreshExpiresAt,
    );

    const accessToken = this.signAccessToken({
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    });

    return {
      user,
      accessToken,
      refreshToken: session.id,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
  }> {
    const session = await this.sessionRepository.findById(refreshToken);

    if (!session) {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    if (session.expiresAt <= new Date()) {
      await this.sessionRepository.deleteById(session.id);

      throw new AppError("Refresh token has expired", 401);
    }

    const user = await this.userRepository.findById(session.userId);

    if (!user) {
      await this.sessionRepository.deleteById(session.id);

      throw new AppError("User associated with session not found", 401);
    }

    const accessToken = this.signAccessToken({
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    });

    return { accessToken };
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  async logout(refreshToken: string): Promise<void> {
    await this.sessionRepository.deleteById(refreshToken);
  }

  private signAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
      expiresIn: ACCESS_TOKEN_TTL,
    });
  }
}
