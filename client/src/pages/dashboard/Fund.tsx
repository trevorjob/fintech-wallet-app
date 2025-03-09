// src/pages/dashboard/Fund.jsx
import React from "react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import FundWalletForm from "../../components/wallet/FundWalletForm";
import WalletCard from "../../components/wallet/WalletCard";
import { useWallet } from "../../hooks/useWallet";
import { walletService } from "../../services/walletService";
const Fund = () => {
  const { balance, isLoading, walletId } = useWallet();

  console.log("Balance: " + balance);
  console.log("Wallet ID: " + walletId);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-semibold">Fund Wallet</h1>

            <WalletCard
              balance={balance}
              walletId={walletId}
              isLoading={isLoading}
            />

            <FundWalletForm />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Fund;
