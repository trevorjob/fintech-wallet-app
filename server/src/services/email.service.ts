// First, install these dependencies:
// npm install nodemailer @types/nodemailer dotenv

// src/services/emailService.ts
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Email service interface
export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    path: string;
    contentType?: string;
  }>;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE, // e.g., 'gmail', 'outlook', etc.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      // secure: Boolean(process.env.EMAIL_SECURE), // true for 465, false for other ports
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent: ", info.messageId);
      return true;
    } catch (error) {
      console.error("Error sending email: ", error);
      return false;
    }
  }

  // Utility method for sending verification emails
  async sendVerificationEmail(
    to: string,
    verificationLink: string
  ): Promise<boolean> {
    const options: EmailOptions = {
      to,
      subject: "Verify Your Email Address",
      html: `
        <h1>Email Verification</h1>
        <p>Thank you for registering. Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
      `,
    };

    return this.sendEmail(options);
  }
  async sendFundingSuccessfullEmail(
    to: string,
    userId: string
  ): Promise<boolean> {
    const options: EmailOptions = {
      to,
      subject: "Successfully Funded Your FinWallet",
      html: `
        <h1>FinWallet Funded</h1>
        <p>Thank you for registering. Please verify your email by clicking the link below:</p>
        <a href="${userId}">Verify Email</a>
      `,
    };

    return this.sendEmail(options);
  }

  // Utility method for sending password reset emails
  async sendPasswordResetEmail(
    to: string,
    resetLink: string
  ): Promise<boolean> {
    const options: EmailOptions = {
      to,
      subject: "Password Reset Request",
      html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    return this.sendEmail(options);
  }
}
