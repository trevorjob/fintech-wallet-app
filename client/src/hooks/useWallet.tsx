import { useContext } from "react";
import { WalletContext } from "../context/WalletContext";
import { api } from "../services/api";
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
