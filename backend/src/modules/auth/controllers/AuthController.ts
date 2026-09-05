import type { Request, Response } from "express";
import type { AuthService } from "../services/AuthService.js";
import { toPublicUser } from "../../users/mapper/userMapper.js";
import { AppError } from "../../../errors/AppError.js";

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
  me = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError("Authenticated user missing", 500);
    }

    res.status(200).json({
      data: {
        user: toPublicUser(req.user),
      },
    });
  };
  logout = async (req: Request, res: Response): Promise<void> => {
    const sessionId = req.cookies.session_id;

    if (sessionId) {
      await this.authService.logout(sessionId);
    }

    res.clearCookie("session_id", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(204).send();
  };
}
