import { Wallet } from "../models/wallet.model";
import { WalletDocument } from "../types";
import mongoose from "mongoose";

export class WalletRepository {
  async create(userId: string): Promise<WalletDocument> {
    const wallet = new Wallet({ userId });
    return await wallet.save();
  }

  async findByUserId(userId: string): Promise<WalletDocument | null> {
    return await Wallet.findOne({ userId });
  }

  async findByWalletId(walletId: string): Promise<WalletDocument | null> {
    return await Wallet.findOne({ walletId });
  }

  async updateBalance(
    walletId: string,
    amount: number,
    operation: "add" | "subtract"
  ): Promise<WalletDocument | null> {
    const updateOperation =
      operation === "add"
        ? { $inc: { balance: amount } }
        : { $inc: { balance: -amount } };

    return await Wallet.findOneAndUpdate({ walletId }, updateOperation, {
      new: true,
      runValidators: true,
    });
  }

  async hasEnoughBalance(walletId: string, amount: number): Promise<boolean> {
    const wallet = await Wallet.findOne({ walletId });
    return wallet ? wallet.balance >= amount : false;
  }
}
