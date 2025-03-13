import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { formatResponse } from "../utils/helpers";
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  forgotPasswordScheme,
} from "../utils/validation";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register a new user
   */
  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password, firstName, lastName } = req.body;

      const { user, token } = await this.authService.register({
        email,
        password,
        firstName,
        lastName,
      });

      // Remove password from response
      const userWithoutPassword = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      };

      res.status(201).json(
        formatResponse(true, "User registered successfully", {
          user: userWithoutPassword,
          token,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * User Profile
   */
  profile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { user } = await this.authService.profile(userId);

      // Remove password from response
      const userWithoutPassword = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      };

      res.status(200).json(
        formatResponse(true, "profile retreved successful", {
          user: userWithoutPassword,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get wallet balance
   */
  getUserWallet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { walletId } = req.params;
      const userInfo = await this.authService.getUserInfo(walletId);

      res
        .status(200)
        .json(
          formatResponse(true, "User Info retrieved successfully", userInfo)
        );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get wallet balance
   */
  forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email } = forgotPasswordScheme.parse(req.body);
      const userInfo = await this.authService.forgotPassword(email);

      res.status(200).json(formatResponse(true, "successful", userInfo));
    } catch (error) {
      next(error);
    }
  };
  /**
   * Get wallet balance
   */
  resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { token, newPassword } = resetPasswordSchema.parse(req.body);
      const userInfo = await this.authService.resetPassword(token, newPassword);

      res
        .status(200)
        .json(
          formatResponse(true, "successfully reset your password", userInfo)
        );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login a user
   */
  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const { user, token } = await this.authService.login(email, password);

      // Remove password from response
      const userWithoutPassword = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      };

      res.status(200).json(
        formatResponse(true, "Login successful", {
          user: userWithoutPassword,
          token,
        })
      );
    } catch (error) {
      next(error);
    }
  };
}
