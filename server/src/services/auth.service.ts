// src/services/auth.service.ts
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { WalletRepository } from "../repositories/wallet.repository";
import { AppError } from "../utils/errors";
import { AuthPayload, UserDocument } from "../types";
import { config } from "../config/config";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/email";
export class AuthService {
  private userRepository: UserRepository;
  private walletRepository: WalletRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.walletRepository = new WalletRepository();
  }
  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Generate reset token
    const resetToken = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: "1h",
    });

    // Send email with reset link
    const resetLink = `${config.clientUrl}/reset-password?token=${resetToken}`;
    await sendEmail(
      user.email,
      user.firstName,
      "Password Reset Request",
      `Click here to reset your password: ${resetLink}`,
      ""
    );

    return "Password reset email sent";
  }

  /**
   * Reset password
   */
  async resetPassword(token: string, newPassword: string): Promise<string> {
    try {
      const decoded: any = jwt.verify(token, config.jwtSecret);
      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        throw new AppError("Invalid or expired token", 400);
      }

      user.password = newPassword;
      await user.save();

      return "Password reset successful";
    } catch (error) {
      throw new AppError("Invalid or expired token", 400);
    }
  }

  /**
   * Register a new user
   */
  async register(
    userData: Pick<
      UserDocument,
      "email" | "password" | "firstName" | "lastName"
    >
  ): Promise<{ user: UserDocument; token: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError("User with this email already exists", 400);
    }

    // Create user
    const user = await this.userRepository.create(userData);

    // Create wallet for the user
    await this.walletRepository.create(user._id as string);

    // Generate JWT token
    const token = this.generateToken(user);

    return { user, token };
  }

  /**
   * Login a user
   */
  async login(
    email: string,
    password: string
  ): Promise<{ user: UserDocument; token: string }> {
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // Check if password is correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    // Generate JWT token
    const token = this.generateToken(user);

    return { user, token };
  }
  /**
   * Login a user
   */
  async profile(userId: string): Promise<{ user: UserDocument }> {
    // Find user by email
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError("user not found", 404);
    }

    return { user };
  }

  /**
   * Get wallet balance
   */
  async getUserInfo(walletId: string): Promise<{
    firstName: string;
    lastName: string;
    email: string;
    walletId: string;
  }> {
    const wallet = await this.walletRepository.findByWalletId(walletId);
    if (!wallet) {
      throw new AppError("Wallet not found", 404);
    }
    const user = await this.userRepository.findById(wallet.userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      walletId: walletId,
    };
  }

  /**
   * Generate JWT token
   */
  private generateToken(user: UserDocument): string {
    const payload: AuthPayload = {
      userId: user._id as string,
      email: user.email,
    };

    return jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
  }
}
