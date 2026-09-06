import type { Request, Response } from "express";
import type { UserService } from "../services/UserService.js";
import { toPublicUser } from "../mapper/userMapper.js";
import { AppError } from "../../../errors/AppError.js";
import type { GetUsersQuery } from "../schemas/user.schemas.js";

export class UserController {
  constructor(private readonly userService: UserService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    const user = await this.userService.createUser({
      name,
      email,
      password,
    });

    res.status(201).json({
      data: toPublicUser(user),
    });
  };
  getById = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    const user = await this.userService.getUserById(req.params.id);

    res.status(200).json({
      data: toPublicUser(user),
    });
  };

  getAll = async (
    req: Request,
    res: Response<unknown, { validated: GetUsersQuery }>,
  ): Promise<void> => {
    const query = res.locals.validated;

    const { users, total } = await this.userService.getUsers(query);

    res.status(200).json({
      data: users.map(toPublicUser),
      total,
      limit: query.limit ?? null,
      offset: query.offset ?? null,
    });
  };
}
