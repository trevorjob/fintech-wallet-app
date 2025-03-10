// src/components/wallet/WithdrawForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { useToast } from "../../components/ui/use-toast";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { AlertCircle, Info } from "lucide-react";
import { walletService } from "../../services/walletService";

const WithdrawForm = () => {
  const [formData, setFormData] = useState({
    accountNumber: "",
    accountName: "",
    amount: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  interface Bank {
    bank_name: string;
    code: string;
  }
  const [bankList, setBankList] = useState([] as Bank[]);
  const [selectedBankComp, setSelectedBankComp] = useState<Bank>({
    bank_name: "",
    code: "",
  });
  const [selectedBank, setSelectedBank] = useState("");
  //   const { toast } = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("https://app.nuban.com.ng/bank_codes.json")
      .then((response) => {
        setBankList(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch banks:", error);
        toast.error("Failed to fetch");
      });
  }, []);

  const selectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log({ name, value });
    const bC = bankList.find((bank: Bank) => bank.bank_name === value);
    if (bC) {
      setSelectedBank(bC.bank_name);
    }
    if (bC) {
      // console.log(bankCode);
      setSelectedBankComp(bC);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // console.log(bankCode);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(formData);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate amount
    const numAmount = parseFloat(formData.amount);
    if (isNaN(numAmount) || numAmount < 1000) {
      setError("Minimum withdrawal amount is ₦1,000");
      return;
    }

    setIsLoading(true);

    try {
      await walletService.withdrawFunds({
        bankCode: selectedBankComp.code,
        bankAccount: formData.accountNumber,
        accountName: formData.accountName,
        amount: numAmount,
      });

      toast.info("Withdrawal initiated", {
        description: `₦${numAmount.toFixed(
          2
        )} will be sent to your bank account`,
      });
      navigate("/");
    } catch (error) {
      console.error("Withdrawal error:", error);
      setError(
        (error as Error).message || "Withdrawal failed. Please try again."
      );
      toast.error("Withdrawal failed", {
        description:
          (error as Error).message || "Withdrawal failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBankComp.code && formData.accountNumber) {
      axios
        .get(
          `https://app.nuban.com.ng/api/NUBAN-VPWTUJWJ1943?bank_code=${selectedBankComp.code}&acc_no=${formData.accountNumber}`
        )
        .then((response) => {
          const { account_name } = response.data[0];
          //   setAccount(response.data[0]);
          setFormData((prevData) => ({
            ...prevData,
            accountName: account_name,
          }));
          console.log(account_name);
        })
        .catch((error) => {
          toast.error((error as Error).message || "Error getting account");
        });
    }
  }, [formData.accountNumber, selectedBankComp.code]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdraw Funds</CardTitle>
        <CardDescription>
          Minimum withdrawal: ₦1,000. A fee of ₦50 applies.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center p-3 text-sm border rounded bg-red-50 text-red-600 border-red-200">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <div className="p-3 text-sm border rounded bg-blue-50 text-blue-600 border-blue-200">
            <div className="flex items-start">
              <Info className="w-4 h-4 mr-2 mt-0.5" />
              <div>
                <p>A flat fee of ₦50 will be charged for withdrawals.</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank">Bank Name</Label>
            <select
              id="bank"
              name="bank"
              value={selectedBankComp.code}
              onChange={selectChange}
            >
              <option>{selectedBank || "Select Bank"}</option>
              {bankList.map((bank, index) => (
                <option key={index} value={bank.bank_name}>
                  {bank.bank_name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              name="accountNumber"
              placeholder="Enter your account number"
              value={formData.accountNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              name="accountName"
              placeholder="Enter your account name"
              value={formData.accountName}
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
            {isLoading ? "Processing..." : "Withdraw Funds"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WithdrawForm;
