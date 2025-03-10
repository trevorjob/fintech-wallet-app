// src/components/wallet/FundWalletForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const FundWalletForm = () => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  //   const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate amount
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setIsLoading(true);

    try {
      const response = await walletService.initiateFunding({
        amount: numAmount,
        paymentMethod: "paystack",
      });

      // Redirect to payment page if provided
      if (response.data.authorizationUrl) {
        window.location.href = response.data.authorizationUrl;
      } else {
        toast.info("Funding initiated", {
          description: "You will be redirected to complete the payment.",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Funding error:", error);
      setError(
        (error as Error).message ||
          "Failed to initiate funding. Please try again."
      );
      toast.error("Funding failed", {
        description:
          (error as Error).message ||
          "Failed to initiate funding. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fund Your Wallet</CardTitle>
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
            <Label htmlFor="amount">Amount (NGN)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1000"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            variant={"outline"}
          >
            {isLoading ? "Processing..." : "Proceed to Payment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FundWalletForm;
