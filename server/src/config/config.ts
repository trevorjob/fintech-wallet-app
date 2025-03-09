import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "default_jwt_secret",
  jwtExpiresIn: "7d",
  nodeEnv: process.env.NODE_ENV || "development",
  withdrawalMinAmount: 1000, // Minimum amount in Naira
  withdrawalFee: 50, // Flat fee in Naira
  paystackSecretKey: process.env.PAYSTACK_SECRET,
};
