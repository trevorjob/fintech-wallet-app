// src/pages/dashboard/Dashboard.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import WalletCard from "../../components/wallet/WalletCard";
import TransactionHistory from "../../components/wallet/TransactionHistory";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle, Send, CreditCard } from "lucide-react";
import { walletService } from "../../services/walletService";
// import { useToast } from "../../components/ui/use-toast";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { useWallet } from "../../hooks/useWallet";
const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [walletId, setWalletId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //   const { toast } = useToast();
  const query = new URLSearchParams(useLocation().search);
  const reference = query.get("reference");
  const { refreshWallet } = useWallet();
  useEffect(() => {
    const completeFunding = async () => {
      if (reference) {
        console.log("----------");
        const response = await walletService.completeFunding(reference);
        console.log(response);
        setBalance(response.data.wallet.balance);
        setWalletId(response.data.wallet.walletId);
        refreshWallet();
        if (response.success) {
          toast.success("Payment successful", {
            description: `You have successfully funded your wallet with ₦${response.amount}`,
          });
        } else {
          toast.error("Payment failed", {
            description: "Failed to fund wallet. Please try again.",
          });
        }
      }
    };

    const fetchDashboardData = async () => {
      try {
        // Fetch wallet balance

        const balanceData = await walletService.getBalance();
        console.log(balanceData.data);
        setBalance(balanceData.data.balance);
        setWalletId(balanceData.data.walletId);

        // Fetch recent transactions
        const transactionsData = await walletService.getTransactions({
          page: 1,
          limit: 5,
        });
        setTransactions(transactionsData.data.transactions);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Error", {
          description: "Failed to load dashboard data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    completeFunding();
    fetchDashboardData();
  }, [toast, reference]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>

            <WalletCard
              balance={balance}
              isLoading={isLoading}
              walletId={walletId}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: PlusCircle,
                  title: "Fund Wallet",
                  description: "Add money to your wallet",
                  path: "/fund",
                  color: "bg-emerald-100 text-emerald-700",
                },
                {
                  icon: Send,
                  title: "Transfer",
                  description: "Send money to friends",
                  path: "/transfer",
                  color: "bg-blue-100 text-blue-700",
                },
                {
                  icon: CreditCard,
                  title: "Withdraw",
                  description: "Cash out to your bank",
                  path: "/withdraw",
                  color: "bg-purple-100 text-purple-700",
                },
              ].map((action, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${action.color}`}>
                        <action.icon className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-sm text-gray-500">
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link to={action.path}>
                        <Button className="w-full text-black">
                          {action.title}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionHistory
                  transactions={transactions}
                  isLoading={isLoading}
                  limit={5}
                />
                <div className="mt-4 text-center">
                  <Link to="/transactions">
                    <Button variant="outline">View All Transactions</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
