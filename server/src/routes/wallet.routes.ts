// src/routes/wallet.routes.ts
import { Router } from "express";
import { WalletController } from "../controllers/wallet.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { fundingRateLimiter } from "../middlewares/rate-limiter.middleware";
import {
  fundWalletSchema,
  transferSchema,
  withdrawSchema,
  paginationSchema,
} from "../utils/validation";

export const walletRouter = Router();
const walletController = new WalletController();

walletRouter.get("/fund/verify/:reference", walletController.completeFunding);
// Apply authentication middleware to all wallet routes
walletRouter.use(authenticate);

// Get wallet balance
walletRouter.get("/balance", walletController.getBalance);

// Fund wallet
walletRouter.post(
  "/fund",
  fundingRateLimiter,
  validate(fundWalletSchema),
  walletController.initializeFunding
);

// Complete wallet funding (webhook)

// Transfer funds to another wallet
walletRouter.post(
  "/transfer",
  validate(transferSchema),
  walletController.transferFunds
);

// Withdraw funds
walletRouter.post(
  "/withdraw",
  validate(withdrawSchema),
  walletController.withdrawFunds
);

// Get transaction history
// walletRouter.get(
//   "/transactions",
//   validate({ query: paginationSchema }),
//   walletController.getTransactionHistory
// );
walletRouter.get(
  "/transactions",
  validate(paginationSchema),
  walletController.getTransactionHistory
);
