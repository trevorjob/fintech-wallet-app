// src/pages/dashboard/Transfer.jsx
import React from "react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import TransferForm from "../../components/wallet/TransferForm";
import WalletCard from "../../components/wallet/WalletCard";
import { useWallet } from "../../hooks/useWallet";

const Transfer = () => {
  const { balance, isLoading, walletId } = useWallet();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-semibold">Transfer Funds</h1>

            <WalletCard
              balance={balance}
              isLoading={isLoading}
              walletId={walletId}
            />

            <TransferForm />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Transfer;
