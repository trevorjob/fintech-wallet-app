import { Document } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface WalletDocument {
  // _id: string;
  userId: string;
  walletId: string; // 10-digit unique ID
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum TransactionType {
  FUNDING = "FUNDING",
  TRANSFER = "TRANSFER",
  WITHDRAWAL = "WITHDRAWAL",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  SUCCESS = "success",
}

export interface TransactionDocument {
  // _id: any;
  referenceId: string; // UUID
  walletId: string;
  userId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthPayload {
  userId: string;
  email: string;
}
