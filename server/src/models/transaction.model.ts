import mongoose, { Schema, Document, Model } from "mongoose";
import {
  TransactionDocument,
  TransactionStatus,
  TransactionType,
} from "../types";
import { generateTransactionReference } from "../utils/helpers";

interface TransactionModel extends Document, TransactionDocument {}

const transactionSchema = new Schema(
  {
    referenceId: {
      type: String,
      required: true,
      unique: true,
      default: generateTransactionReference,
    },
    walletId: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
transactionSchema.index({ walletId: 1, userId: 1 });
transactionSchema.index({ referenceId: 1 });

export const Transaction = mongoose.model<TransactionModel>(
  "Transaction",
  transactionSchema
);
