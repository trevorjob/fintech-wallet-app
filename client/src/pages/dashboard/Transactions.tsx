// src/pages/dashboard/Transactions.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import TransactionHistory from "../../components/wallet/TransactionHistory";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
// import { useToast } from "../../components/ui/use-toast";
import { walletService } from "../../services/walletService";
import { toast } from "sonner";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 10,
    totalTransactions: 0,
  });

  //   const { toast } = useToast();

  const fetchTransactions = async (page = 1) => {
    setIsLoading(true);
    try {
      const data = await walletService.getTransactions({
        page,
        limit: pagination.limit,
      });
      console.log("---------");
      console.log(data.data);
      setTransactions(data.data.transactions);
      setPagination({
        page: data.data.page,
        limit: data.data.limit,
        totalPages: data.data.pages,
        totalTransactions: data.data.total,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Error", {
        description: "Failed to load transactions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      fetchTransactions(pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      fetchTransactions(pagination.page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-2xl font-semibold">Transaction History</h1>

            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionHistory
                  transactions={transactions}
                  isLoading={isLoading}
                  limit={pagination.limit}
                />

                {!isLoading && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-500">
                      Showing {transactions.length} of{" "}
                      {pagination.totalTransactions} transactions
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={handlePrevPage}
                        disabled={pagination.page <= 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleNextPage}
                        disabled={pagination.page >= pagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Transactions;
