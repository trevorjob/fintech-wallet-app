// src/routes/index.ts
import { Router } from "express";
import { authRouter } from "./auth.routes";
import { walletRouter } from "./wallet.routes";

export const router = Router();

router.use("/auth", authRouter);
router.use("/wallet", walletRouter);
