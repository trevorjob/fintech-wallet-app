import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "First name is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export const forgotPasswordScheme = z.object({
  email: z.string().email("Invalid email address"),
});
export const fundWalletSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  paymentMethod: z.string().min(1, "Payment method is required"),
});

export const transferSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  walletId: z.string().min(10, "Wallet ID is required"),
  description: z.string().optional(),
});

export const withdrawSchema = z.object({
  amount: z.number().min(1000, "Minimum withdrawal amount is ₦1000"),
  bankAccount: z.string().min(1, "Bank account is required"),
  bankCode: z.string().min(1, "Bank code is required"),
  description: z.string().optional(),
});

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),
});
