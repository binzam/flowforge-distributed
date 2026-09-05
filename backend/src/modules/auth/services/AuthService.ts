import { AppError } from "../../../errors/AppError.js";
import type { PasswordHasher } from "../../../infrastructure/security/PasswordHasher.js";
import type { UserRepository } from "../../users/repositories/UserRepository.js";
import type { LoginInput } from "../schemas/auth.schemas.js";
import type { User } from "../../users/types/user.types.js";
import type { SessionRepository } from "../repositories/SessionRepository.js";

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async login(input: LoginInput): Promise<{
    user: User;
    sessionId: string;
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

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    const session = await this.sessionRepository.create(user.id, expiresAt);

    return {
      user,
      sessionId: session.id,
    };
  }
  async logout(sessionId: string): Promise<void> {
    await this.sessionRepository.deleteById(sessionId);
  }
}
