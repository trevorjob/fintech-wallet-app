type TransactionType = "TRANSFER" | "WITHDRAWAL" | "FUNDING";
type TransactionStatus = "COMPLETED" | "PENDING" | "FAILED";

interface TransferMetadata {
  recipientWalletId?: string;
  recipientEmail?: string;
  recipientName?: string;
  description: string;
  transferType: "debit" | "credit";
  senderName?: string;
  senderEmail?: string;
  senderWalletId?: string;
}

interface WithdrawalMetadata {
  bankAccount: string;
  bankCode: string;
  fee: number;
  actualAmount: number;
  description: string;
}

interface PaymentDetails {
  status: boolean;
  amount: number;
  metadata: {
    userId: string;
    walletId: string;
    referrer?: string;
  };
}

interface FundingMetadata {
  reference: string;
  paymentGateway: string;
  paymentDetails: PaymentDetails;
}

type Metadata = TransferMetadata | WithdrawalMetadata | FundingMetadata;

interface BaseTransaction {
  _id: string;
  referenceId: string;
  walletId: string;
  userId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  metadata: Metadata;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type {
  BaseTransaction,
  TransferMetadata,
  WithdrawalMetadata,
  FundingMetadata,
};
