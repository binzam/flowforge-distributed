import type { Request, Response } from "express";
import type { AuthService } from "../services/AuthService.js";
import { toPublicUser } from "../../users/mapper/userMapper.js";
import { AppError } from "../../../errors/AppError.js";
import { config } from "../../../config/env.js";
import {
  ACCESS_TOKEN_MAX_AGE_MS,
  REFRESH_TOKEN_MAX_AGE_MS,
} from "../config/token-config.js";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await this.authService.login({
      email,
      password,
    });

    this.setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      data: {
        user: toPublicUser(user),
      },
    });
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      throw new AppError("Refresh token missing", 401);
    }

    const { accessToken, refreshToken: rotatedRefreshToken } =
      await this.authService.refreshAccessToken(refreshToken);

    this.setAuthCookies(res, accessToken, rotatedRefreshToken);

    res.status(204).send();
  };

  me = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError("Authenticated user missing", 500);
    }

    const user = await this.authService.getUserById(req.user.id);

    res.status(200).json({
      data: {
        user: toPublicUser(user),
      },
    });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refresh_token;

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "lax",
    });
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "lax",
    });

    res.status(204).send();
  };

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "lax",
      maxAge: ACCESS_TOKEN_MAX_AGE_MS,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "lax",
      maxAge: REFRESH_TOKEN_MAX_AGE_MS,
    });
  }
}
