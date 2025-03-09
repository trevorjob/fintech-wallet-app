import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import { loginSchema, registerSchema } from "../utils/validation";
import { authenticate } from "../middlewares/auth.middleware";

export const authRouter = Router();
const authController = new AuthController();

// Register user
authRouter.post("/register", validate(registerSchema), authController.register);

// Login user
authRouter.post("/login", validate(loginSchema), authController.login);
authRouter.get("/profile", authenticate, authController.profile);
