// src/pages/dashboard/Withdraw.jsx
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import WithdrawForm from "../../components/wallet/WithdrawForm";
import WalletCard from "../../components/wallet/WalletCard";
import { useWallet } from "../../hooks/useWallet";

const Withdraw = () => {
  const { balance, isLoading, walletId } = useWallet();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-semibold">Withdraw Funds</h1>

            <WalletCard
              balance={balance}
              isLoading={isLoading}
              walletId={walletId}
            />

            <WithdrawForm />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Withdraw;
