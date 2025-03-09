// src/services/wallet.service.ts
import { UserRepository } from "../repositories/user.repository";
import { WalletRepository } from "../repositories/wallet.repository";
import { TransactionRepository } from "../repositories/transaction.repository";
import { PaymentService } from "./payment.service";
import { AppError } from "../utils/errors";
import {
  TransactionDocument,
  TransactionStatus,
  TransactionType,
  WalletDocument,
} from "../types";
import { config } from "../config/config";
import { v4 as uuidv4 } from "uuid";

export class WalletService {
  private userRepository: UserRepository;
  private walletRepository: WalletRepository;
  private transactionRepository: TransactionRepository;
  private paymentService: PaymentService;

  constructor() {
    this.userRepository = new UserRepository();
    this.walletRepository = new WalletRepository();
    this.transactionRepository = new TransactionRepository();
    this.paymentService = new PaymentService();
  }

  /**
   * Get wallet balance
   */
  async getBalance(
    userId: string
  ): Promise<{ balance: number; walletId: string }> {
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new AppError("Wallet not found", 404);
    }

    return {
      balance: wallet.balance,
      walletId: wallet.walletId,
    };
  }

  /**
   * Initialize wallet funding
   */
  async initializeFunding(
    userId: string,
    amount: number
  ): Promise<{
    authorizationUrl: string;
    reference: string;
    transaction: TransactionDocument;
  }> {
    if (amount <= 0) {
      throw new AppError("Amount must be greater than zero", 400);
    }

    // Find user
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Find wallet
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new AppError("Wallet not found", 404);
    }

    // Initialize payment with payment gateway
    const paymentResponse = await this.paymentService.initializePayment(
      amount,
      user.email,
      { userId, walletId: wallet.walletId }
    );

    // Create a pending transaction
    const transaction = await this.transactionRepository.create({
      walletId: wallet.walletId,
      userId,
      type: TransactionType.FUNDING,
      amount,
      status: TransactionStatus.PENDING,
      metadata: {
        reference: paymentResponse.reference,
        paymentGateway: "mock_payment",
      },
      referenceId: paymentResponse.reference,
    });

    return {
      authorizationUrl: paymentResponse.authorizationUrl,
      reference: paymentResponse.reference,
      transaction,
    };
  }

  /**
   * Complete wallet funding (callback from payment gateway)
   */
  async completeFunding(
    reference: string
  ): Promise<{ transaction: TransactionDocument; wallet: WalletDocument }> {
    // Verify payment with payment gateway
    const verificationResponse =
      await this.paymentService.verifyPayment(reference);
    console.log(verificationResponse);
    if (
      !verificationResponse.status
      // verificationResponse.data.data.status !== "success"
    ) {
      throw new AppError("Payment verification failed", 400);
    }

    // Find transaction by reference
    console.log(reference);
    const transaction =
      await this.transactionRepository.findByReferenceId(reference);
    console.log(transaction);
    if (!transaction) {
      throw new AppError("Transaction not found", 404);
    }

    // If transaction is already completed, return it
    if (transaction.status === TransactionStatus.COMPLETED) {
      const wallet = await this.walletRepository.findByWalletId(
        transaction.walletId
      );
      if (!wallet) {
        throw new AppError("Wallet not found", 404);
      }
      return { transaction, wallet };
    }

    // Update transaction status
    const updatedTransaction = await this.transactionRepository.updateStatus(
      reference,
      TransactionStatus.COMPLETED,
      {
        ...transaction.metadata,
        paymentDetails: verificationResponse,
      }
    );

    if (!updatedTransaction) {
      throw new AppError("Failed to update transaction", 500);
    }

    // Update wallet balance
    const wallet = await this.walletRepository.updateBalance(
      transaction.walletId,
      transaction.amount,
      "add"
    );

    if (!wallet) {
      throw new AppError("Failed to update wallet balance", 500);
    }

    return { transaction: updatedTransaction, wallet };
  }

  /**
   * Transfer funds to another wallet
   */
  async transferFunds(
    senderId: string,
    recipientEmail: string,
    amount: number,
    description?: string
  ): Promise<{ transaction: TransactionDocument; wallet: WalletDocument }> {
    if (amount <= 0) {
      throw new AppError("Amount must be greater than zero", 400);
    }

    // Find sender wallet
    const senderWallet = await this.walletRepository.findByUserId(senderId);
    if (!senderWallet) {
      throw new AppError("Sender wallet not found", 404);
    }

    // Check if sender has enough balance
    if (senderWallet.balance < amount) {
      throw new AppError("Insufficient balance", 400);
    }

    // Find recipient by email
    const recipient = await this.userRepository.findByEmail(recipientEmail);
    if (!recipient) {
      throw new AppError("Recipient not found", 404);
    }

    // Ensure sender is not recipient
    if (senderId === (recipient._id as string).toString()) {
      throw new AppError("Cannot transfer to yourself", 400);
    }

    // Find recipient wallet
    const recipientWallet = await this.walletRepository.findByUserId(
      recipient._id as string
    );
    if (!recipientWallet) {
      throw new AppError("Recipient wallet not found", 404);
    }

    // Create transaction for sender (debit)
    const senderTransaction = await this.transactionRepository.create({
      referenceId: uuidv4(),
      // referenceId: uu
      walletId: senderWallet.walletId,
      userId: senderId,
      type: TransactionType.TRANSFER,
      amount,
      status: TransactionStatus.COMPLETED,
      metadata: {
        recipientWalletId: recipientWallet.walletId,
        recipientEmail,
        description: description || "Wallet transfer",
        transferType: "debit",
      },
    });

    // Create transaction for recipient (credit)
    const recipientTransaction = await this.transactionRepository.create({
      referenceId: uuidv4(),
      walletId: recipientWallet.walletId,
      userId: recipient._id as string,
      type: TransactionType.TRANSFER,
      amount,
      status: TransactionStatus.COMPLETED,
      metadata: {
        senderWalletId: senderWallet.walletId,
        senderEmail: recipient.email, // This should be the sender's email in the real implementation
        description: description || "Wallet transfer",
        transferType: "credit",
      },
    });

    // Update sender wallet balance (subtract)
    const updatedSenderWallet = await this.walletRepository.updateBalance(
      senderWallet.walletId,
      amount,
      "subtract"
    );

    if (!updatedSenderWallet) {
      throw new AppError("Failed to update sender wallet balance", 500);
    }

    // Update recipient wallet balance (add)
    await this.walletRepository.updateBalance(
      recipientWallet.walletId,
      amount,
      "add"
    );

    return { transaction: senderTransaction, wallet: updatedSenderWallet };
  }

  /**
   * Withdraw funds from wallet
   */
  async withdrawFunds(
    userId: string,
    amount: number,
    bankAccount: string,
    bankCode: string,
    description?: string
  ): Promise<{ transaction: TransactionDocument; wallet: WalletDocument }> {
    // Check minimum withdrawal amount
    if (amount < config.withdrawalMinAmount) {
      throw new AppError(
        `Minimum withdrawal amount is ₦${config.withdrawalMinAmount}`,
        400
      );
    }

    // Calculate total amount with fee
    const totalAmount = amount + config.withdrawalFee;

    // Find wallet
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new AppError("Wallet not found", 404);
    }

    // Check if user has enough balance
    if (wallet.balance < totalAmount) {
      throw new AppError("Insufficient balance for withdrawal and fee", 400);
    }

    // Create withdrawal transaction
    const transaction = await this.transactionRepository.create({
      referenceId: uuidv4(),
      walletId: wallet.walletId,
      userId,
      type: TransactionType.WITHDRAWAL,
      amount: totalAmount,
      status: TransactionStatus.COMPLETED, // We'll set it to completed immediately for simplicity
      metadata: {
        bankAccount,
        bankCode,
        fee: config.withdrawalFee,
        actualAmount: amount,
        description: description || "Wallet withdrawal",
      },
    });

    // Update wallet balance
    const updatedWallet = await this.walletRepository.updateBalance(
      wallet.walletId,
      totalAmount,
      "subtract"
    );

    if (!updatedWallet) {
      throw new AppError("Failed to update wallet balance", 500);
    }

    return { transaction, wallet: updatedWallet };
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    transactions: TransactionDocument[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    // Find wallet
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new AppError("Wallet not found", 404);
    }

    // Get transactions
    return await this.transactionRepository.findByUserIdAndWalletId({
      walletId: wallet.walletId,
      userId,
      page,
      limit,
    });
  }
}
