import type { Request, Response } from "express";
import type { AuthService } from "../services/AuthService.js";
import { toPublicUser } from "../../users/mapper/userMapper.js";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const { user, sessionId } = await this.authService.login({
      email,
      password,
    });

    res.cookie("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(200).json({
      data: {
        user: toPublicUser(user),
      },
    });
  };
}
