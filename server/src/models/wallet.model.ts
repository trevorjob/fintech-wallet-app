// src/models/wallet.model.ts
import mongoose, { Schema, Document } from "mongoose";
import { WalletDocument } from "../types";
import { generateWalletId } from "../utils/helpers";

interface WalletModel extends Document, WalletDocument {}

const walletSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    walletId: {
      type: String,
      required: true,
      unique: true,
      default: generateWalletId,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0, // Ensure balance can't be negative
    },
  },
  {
    timestamps: true,
  }
);

export const Wallet = mongoose.model<WalletModel>("Wallet", walletSchema);
