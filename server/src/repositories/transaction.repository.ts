import { Transaction } from "../models/transaction.model";
import {
  TransactionDocument,
  TransactionStatus,
  TransactionType,
} from "../types";
import { v4 as uuidv4 } from "uuid";
interface CreateTransactionParams {
  referenceId: string;
  walletId: string;
  userId: string;
  type: TransactionType;
  amount: number;
  status?: TransactionStatus;
  metadata?: Record<string, any>;
}

interface FindTransactionsParams {
  walletId: string;
  userId: string;
  page: number;
  limit: number;
}

export class TransactionRepository {
  async create(params: CreateTransactionParams): Promise<TransactionDocument> {
    const transaction = new Transaction({
      referenceId: params.referenceId || uuidv4(),
      walletId: params.walletId,
      userId: params.userId,
      type: params.type,
      amount: params.amount,
      status: params.status || TransactionStatus.PENDING,
      metadata: params.metadata || {},
    });

    return await transaction.save();
  }

  async findByReferenceId(
    referenceId: string
  ): Promise<TransactionDocument | null> {
    return await Transaction.findOne({ referenceId });
  }

  async updateStatus(
    referenceId: string,
    status: TransactionStatus,
    metadata?: Record<string, any>
  ): Promise<TransactionDocument | null> {
    const updateData: any = { status };
    if (metadata) {
      updateData.metadata = metadata;
    }

    return await Transaction.findOneAndUpdate({ referenceId }, updateData, {
      new: true,
    });
  }

  async findByUserIdAndWalletId({
    walletId,
    userId,
    page,
    limit,
  }: FindTransactionsParams): Promise<{
    transactions: TransactionDocument[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      Transaction.find({ walletId, userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments({ walletId, userId }),
    ]);

    return {
      transactions,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }
}
