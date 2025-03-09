import { v4 as uuidv4 } from "uuid";

/**
 * Generate a 10-digit wallet ID
 */
export const generateWalletId = (): string => {
  // Generate a random number between 1000000000 and 9999999999
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

/**
 * Generate a UUID for transaction reference
 */
export const generateTransactionReference = (): string => {
  return uuidv4();
};

/**
 * Format response for API
 */
export const formatResponse = <T>(
  success: boolean,
  message: string,
  data?: T
) => {
  return {
    success,
    message,
    data: data || null,
  };
};
