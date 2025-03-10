// src/contexts/WalletContext.jsx
import { createContext, useState, useEffect } from "react";
import { walletService } from "../services/walletService";
import { useAuth } from "../hooks/useAuth";

// Create a context
interface WalletContextType {
  balance: number;
  isLoading: boolean;
  walletId: string;
  transactions: object[]; // Define proper transaction type
  refreshWallet: () => Promise<void>;
  // Add other properties
}

export const WalletContext = createContext<WalletContextType | null>(null);
export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [balance, setBalance] = useState(0);
  const [walletId, setWalletId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useAuth();
  console.log(user);
  // Fetch wallet data when auth state changes
  useEffect(() => {
    if (user) {
      fetchWalletData();
    } else {
      // Reset wallet state when logged out
      setBalance(0);
      setTransactions([]);
      setWalletId("");
    }
  }, [user]);

  // Function to fetch wallet data
  const fetchWalletData = async () => {
    setIsLoading(true);
    try {
      // Fetch wallet balance
      const balanceResponse = await walletService.getBalance();

      setBalance(balanceResponse.data.balance);
      setWalletId(balanceResponse.data.walletId);
      console.log(balanceResponse.data.walletId);

      // Fetch transaction history
      const transactionsResponse = await walletService.getTransactions({
        page: 1,
        limit: 10,
      });
      setTransactions(transactionsResponse.data.transactions);

      setError("");
    } catch (err) {
      console.error("Error fetching wallet data:", err);
      setError((err as Error).message || "Failed to load wallet data");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to initiate wallet funding
  const initiateFunding = async (amount: number) => {
    setIsLoading(true);
    try {
      const response = await walletService.initiateFunding({ amount });
      await fetchWalletData(); // Refresh wallet data
      return response;
    } catch (err) {
      console.error("Funding error:", err);
      setError((err as Error).message || "Failed to initiate funding");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to withdraw funds
  const withdrawFunds = async (withdrawalData: object) => {
    setIsLoading(true);
    try {
      const response = await walletService.withdrawFunds(withdrawalData);
      await fetchWalletData(); // Refresh wallet data
      return response;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to withdraw funds");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh wallet data manually
  const refreshWallet = async () => {
    fetchWalletData();
  };

  const value = {
    balance,
    transactions,
    isLoading,
    walletId,
    error,
    initiateFunding,
    withdrawFunds,
    refreshWallet,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

// Custom hook to use the wallet context
