import { Request, Response, NextFunction } from "express";
import { WalletService } from "../services/wallet.service";
import { formatResponse } from "../utils/helpers";
import {
  fundWalletSchema,
  transferSchema,
  withdrawSchema,
  paginationSchema,
} from "../utils/validation";

export class WalletController {
  private walletService: WalletService;

  constructor() {
    this.walletService = new WalletService();
  }

  /**
   * Get wallet balance
   */
  getBalance = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const balance = await this.walletService.getBalance(userId);

      res
        .status(200)
        .json(
          formatResponse(true, "Wallet balance retrieved successfully", balance)
        );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Initialize wallet funding
   */
  initializeFunding = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { amount } = fundWalletSchema.parse(req.body);

      const fundingDetails = await this.walletService.initializeFunding(
        userId,
        amount
      );

      res
        .status(200)
        .json(
          formatResponse(
            true,
            "Funding initialized successfully",
            fundingDetails
          )
        );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Complete wallet funding (webhook/callback)
   */
  completeFunding = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { reference } = req.params;

      const result = await this.walletService.completeFunding(reference);

      res
        .status(200)
        .json(formatResponse(true, "Funding completed successfully", result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Transfer funds to another wallet
   */
  transferFunds = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { amount, walletId, description } = transferSchema.parse(req.body);

      const result = await this.walletService.transferFunds(
        userId,
        walletId,
        amount,
        description
      );

      res
        .status(200)
        .json(formatResponse(true, "Transfer completed successfully", result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Withdraw funds from wallet
   */
  withdrawFunds = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { amount, bankAccount, bankCode, description } =
        withdrawSchema.parse(req.body);

      const result = await this.walletService.withdrawFunds(
        userId,
        amount,
        bankAccount,
        bankCode,
        description
      );

      res
        .status(200)
        .json(
          formatResponse(true, "Withdrawal completed successfully", result)
        );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get transaction history
   */
  getTransactionHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { page, limit } = paginationSchema.parse(req.query);

      const transactions = await this.walletService.getTransactionHistory(
        userId,
        page,
        limit
      );

      res
        .status(200)
        .json(
          formatResponse(
            true,
            "Transaction history retrieved successfully",
            transactions
          )
        );
    } catch (error) {
      next(error);
    }
  };
}
