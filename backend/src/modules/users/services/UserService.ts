import { AppError } from "../../../errors/AppError.js";
import type { PasswordHasher } from "../../../infrastructure/security/PasswordHasher.js";
import type { UserRepository } from "../repositories/UserRepository.js";
import type {
  CreateUserInput,
  GetUsersQuery,
} from "../schemas/user.schemas.js";
import type { User } from "../types/user.types.js";

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async createUser(input: CreateUserInput): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new AppError("User with this email already exists", 409);
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    return this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  async getUsers(options: GetUsersQuery) {
    return this.userRepository.findAll(options);
  }
}
