import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { config } from "../config/config";
import { AppError } from "../utils/errors";

export class PaymentService {
  private paystackBaseUrl = "https://api.paystack.co";

  async initializePayment(
    amount: number,
    email: string,
    metadata: Record<string, any> = {}
  ): Promise<{
    authorizationUrl: string;
    reference: string;
    // referenceId: string;
  }> {
    try {
      const reference = uuidv4();
      const response = await axios.post(
        `${this.paystackBaseUrl}/transaction/initialize`,
        {
          amount: amount * 100, // Paystack uses kobo (multiply by 100)
          email,
          reference,
          metadata,
          callback_url: process.env.FRONTEND_URL, // Your callback URL
        },
        {
          headers: {
            Authorization: `Bearer ${config.paystackSecretKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.data);
      return {
        authorizationUrl: response.data.data.authorization_url,
        reference: response.data.data.reference,
        // referenceId: response.data.data.reference,
      };
    } catch (error) {
      throw new AppError("Payment initialization failed", 500);
    }
  }

  async verifyPayment(reference: string): Promise<{
    status: boolean;
    amount: number;
    metadata: Record<string, any>;
  }> {
    try {
      console.log(reference);
      const response = await axios.get(
        `${this.paystackBaseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${config.paystackSecretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      const { status, amount, metadata } = response.data.data;
      return {
        status: status === "success",
        amount: amount / 100, // Convert back to naira
        metadata,
      };
    } catch (error) {
      throw new AppError("Payment verification failed ---", 500);
    }
  }
}
