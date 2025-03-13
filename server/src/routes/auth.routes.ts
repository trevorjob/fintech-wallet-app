import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  forgotPasswordScheme,
} from "../utils/validation";
import { authenticate } from "../middlewares/auth.middleware";

export const authRouter = Router();
const authController = new AuthController();

// Register user
authRouter.post("/register", validate(registerSchema), authController.register);

// Login user
authRouter.post("/login", validate(loginSchema), authController.login);
authRouter.post(
  "/forgot-password",
  validate(forgotPasswordScheme),
  authController.forgotPassword
);
authRouter.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword
);
authRouter.get("/profile", authenticate, authController.profile);
authRouter.get("/user/:walletId", authenticate, authController.getUserWallet);
