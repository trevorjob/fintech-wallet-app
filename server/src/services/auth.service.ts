// src/services/auth.service.ts
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { WalletRepository } from "../repositories/wallet.repository";
import { AppError } from "../utils/errors";
import { AuthPayload, UserDocument } from "../types";
import { config } from "../config/config";

export class AuthService {
  private userRepository: UserRepository;
  private walletRepository: WalletRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.walletRepository = new WalletRepository();
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
    await this.walletRepository.create(user._id);

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
   * Generate JWT token
   */
  private generateToken(user: UserDocument): string {
    const payload: AuthPayload = {
      userId: user._id,
      email: user.email,
    };

    return jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
  }
}
