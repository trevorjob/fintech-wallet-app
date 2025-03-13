// src/components/wallet/TransferForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useToast } from "../../components/ui/use-toast";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { AlertCircle } from "lucide-react";
import { walletService } from "../../services/walletService";
import { useWallet } from "../../hooks/useWallet";
import { authService } from "../../services/authService";
const TransferForm = () => {
  interface User {
    firstName: string;
    lastName: string;
    walletId: string;
    email: string;
  }
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    walletId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({} as User);
  const [error, setError] = useState("");
  const { balance } = useWallet();
  //   const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log({ name, value });
    if (name == "walletId" && value.length == 10) {
      authService.getUser(value).then((res) => {
        console.log(res);
        setUser(res.data);
        // setFormData((prev) => ({ ...prev, accountName: res.data.accountName }));
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate amount
    const numAmount = parseFloat(formData.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (numAmount > balance) {
      setError("Insufficient funds");
      return;
    }

    setIsLoading(true);

    try {
      await walletService.transferFunds({
        walletId: formData.walletId,
        amount: numAmount,
        description: formData.description,
      });

      toast.success("Transfer successful", {
        description: `₦${numAmount.toFixed(2)} has been sent to ${
          formData.walletId
        }`,
      });
      navigate("/");
    } catch (error) {
      console.error("Transfer error:", error);
      setError(
        (error as Error).message || "Transfer failed. Please try again."
      );
      toast.error("Transfer failed", {
        description:
          (error as Error).message || "Transfer failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Funds</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center p-3 text-sm border rounded bg-red-50 text-red-600 border-red-200">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="walletId">Wallet ID</Label>
            <Input
              id="walletId"
              name="walletId"
              type="text"
              placeholder="wallet Id"
              value={formData.walletId}
              onChange={handleChange}
              required
            />
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="recipientEmail">Recipient Email</Label>
            <Input
              id="recipientEmail"
              name="recipientEmail"
              type="email"
              placeholder="recipient@example.com"
              value={formData.recipientEmail}
              onChange={handleChange}
              required
            />
          </div> */}
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              name="accountName"
              placeholder="Enter your account name"
              value={
                formData.walletId.length == 10 && user
                  ? user.firstName + " " + user.lastName
                  : ""
              }
              onChange={handleChange}
              //   required
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (NGN)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              name="description"
              placeholder="What's this for?"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            variant={"outline"}
          >
            {isLoading ? "Processing..." : "Send Money"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransferForm;
