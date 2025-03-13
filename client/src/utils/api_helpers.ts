import axios from "axios";

export const getAllBanks = async () => {
  return axios.get("https://app.nuban.com.ng/bank_codes.json");
};

export const getBankAccountInfo = async (
  code: string,
  accountNumber: string
) => {
  return axios.get(
    `https://app.nuban.com.ng/api/NUBAN-VPWTUJWJ1943?bank_code=${code}&acc_no=${accountNumber}`
  );
};
