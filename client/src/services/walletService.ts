// src/services/walletService.js
import api from "./api";

export const walletService = {
  // Get wallet balance
  getBalance: async () => {
    return api.get("/wallet/balance");
  },
  getUserInfo: async (walletId: string) => {
    return api.get(`/wallet/balance/${walletId}`);
  },

  // Initiate wallet funding
  initiateFunding: async (data: object) => {
    return api.post("/wallet/fund", data);
  },

  // Complete wallet funding (after payment gateway callback)
  completeFunding: async (reference: string) => {
    return api.get(`/wallet/fund/verify/${reference}`);
  },

  // Transfer funds to another wallet
  transferFunds: async (data: object) => {
    return api.post("/wallet/transfer", data);
  },

  // Withdraw funds
  withdrawFunds: async (data: object) => {
    return api.post("/wallet/withdraw", data);
  },

  // Get transaction history
  getTransactions: async ({ page = 1, limit = 10 }) => {
    return api.get("/wallet/transactions", { params: { page, limit } });
  },
};
