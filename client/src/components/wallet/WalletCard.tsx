// src/components/wallet/WalletCard.jsx
import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { Wallet, Eye, EyeOff } from "lucide-react";
import { formatNumberToCurrency } from "../../utils/formatters";

interface WalletCardProps {
  balance: number;
  isLoading: boolean;
  walletId: string;
}

const WalletCard = ({ balance, isLoading, walletId }: WalletCardProps) => {
  const [showBalance, setShowBalance] = React.useState(true);

  const toggleBalance = () => {
    setShowBalance((prev) => !prev);
  };

  return (
    <Card className="bg-blue-600 text-white border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Wallet className="h-8 w-8" />
            <h2 className="text-xl font-semibold">Wallet Balance</h2>
          </div>
          <button
            onClick={toggleBalance}
            className="p-2 rounded-full hover:bg-blue-500 text-black"
            aria-label={showBalance ? "Hide balance" : "Show balance"}
          >
            {showBalance ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <Skeleton className="h-10 w-48 bg-blue-500" />
          ) : (
            <div className="flex items-end space-x-2">
              <span className="text-3xl md:text-4xl font-bold">
                {showBalance ? formatNumberToCurrency(balance) : "••••••••"}
              </span>
              <span className="text-blue-200 mb-1">NGN</span>
            </div>
          )}
        </div>

        <div className="mt-4 text-blue-200">
          <p>Wallet ID: {isLoading ? "••••••••••" : walletId}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
