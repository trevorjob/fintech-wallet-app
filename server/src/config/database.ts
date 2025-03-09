import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/fintech-wallet";

export const connectDB = async (test: boolean = false): Promise<void> => {
  try {
    if (test) {
      await mongoose.connect(`${MONGODB_URI}-test`);
    } else {
      await mongoose.connect(MONGODB_URI);
    }
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
