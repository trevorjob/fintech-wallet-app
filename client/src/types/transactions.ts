// // src/types/transaction.ts
// export interface PaymentDetails {
//   status: boolean;
//   amount: number;
//   metadata?: {
//     userId?: string;
//     walletId?: string;
//     referrer?: string;
//     [key: string]: any; // For any other properties
//   };
// }

// export interface TransactionMetadata {
//   reference?: string;
//   paymentGateway?: string;
//   paymentDetails?: PaymentDetails;
//   recipient?: string; // For transfer transactions
//   accountNumber?: string; // For withdrawal transactions
//   bankName?: string; // For withdrawal transactions
//   description?: string;
//   [key: string]: any; // For any other metadata properties
// }

export interface Transaction {
  _id: string;
  referenceId: string;
  walletId: string;
  userId: string;
  type: "FUNDING" | "WITHDRAWAL" | "TRANSFER" | string; // Add other transaction types you have
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED" | string; // Add other statuses
  metadata: object;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
