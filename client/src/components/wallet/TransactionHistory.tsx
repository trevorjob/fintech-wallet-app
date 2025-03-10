// src/components/wallet/TransactionHistory.jsx
import {
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { formatNumberToCurrency, relativeTime } from "../../utils/formatters";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Transaction } from "../../types/transactions";
interface TransactionItemProps {
  transaction: Transaction;
}
const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "FUNDING":
        return <ArrowDownLeft className="h-4 w-4 text-emerald-500" />;
      case "TRANSFER":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case "WITHDRAWAL":
        return <CreditCard className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "FUNDING":
        return "text-emerald-600";
      case "TRANSFER":
        return "text-red-600";
      case "WITHDRAWAL":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const getTransactionDescription = (transaction: Transaction) => {
    switch (transaction.type) {
      case "FUNDING":
        return "Wallet funding";
      case "TRANSFER":
        // return `Transfer to ${transaction.metadata.recipient || "user"}`;
        return `user`;
      case "WITHDRAWAL":
        return "Withdrawal to bank";
      default:
        return "Transaction";
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full bg-gray-100`}>
            {getTransactionIcon(transaction.type)}
          </div>
          <div>
            <p className="font-medium">
              {getTransactionDescription(transaction)}
            </p>
            <p className="text-xs text-gray-500">
              {relativeTime(transaction.createdAt)}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <span
          className={`font-medium ${getTransactionColor(transaction.type)}`}
        >
          {transaction.type === "FUNDING" ? "+" : "-"}{" "}
          {formatNumberToCurrency(transaction.amount)}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <span
          className={`text-xs inline-block px-2 py-1 rounded ${
            transaction.status === "COMPLETED"
              ? "bg-green-100 text-green-700"
              : transaction.status === "PENDING"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {transaction.status}
        </span>
      </TableCell>
    </TableRow>
  );
};

const TransactionSkeleton = () => (
  <TableRow>
    <TableCell>
      <div className="flex items-center space-x-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </TableCell>
    <TableCell className="text-right">
      <Skeleton className="h-4 w-20 ml-auto" />
    </TableCell>
    <TableCell className="text-right">
      <Skeleton className="h-6 w-16 ml-auto" />
    </TableCell>
  </TableRow>
);

const EmptyState = () => (
  <TableRow>
    <TableCell colSpan={3} className="h-24 text-center">
      <div className="flex flex-col items-center justify-center text-gray-500">
        <CreditCard className="h-8 w-8 mb-2" />
        <p>No transactions yet</p>
        <p className="text-sm">Your transactions will appear here</p>
      </div>
    </TableCell>
  </TableRow>
);
interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading: boolean;
  limit?: number;
}

const TransactionHistory = ({
  transactions,
  isLoading,
  limit = 5,
}: TransactionHistoryProps) => {
  console.log(transactions);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array(limit)
            .fill(null)
            .map((_, index) => <TransactionSkeleton key={index} />)
        ) : transactions && transactions.length > 0 ? (
          transactions.map((transaction) => (
            <TransactionItem key={transaction._id} transaction={transaction} />
          ))
        ) : (
          <EmptyState />
        )}
      </TableBody>
    </Table>
  );
};

export default TransactionHistory;
