import "dotenv/config";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || "", // Ensure this is in your .env file
});

const sentFrom = new Sender(
  "trevor@trial-z86org8p1mklew13.mlsender.net",
  "FinWallet"
);

/**
 * Sends an email using MailerSend
 * @param {string} toEmail - Recipient's email
 * @param {string} toName - Recipient's name
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content of the email
 * @param {string} textContent - Plain text content of the email
 * @returns {Promise<object>} - MailerSend response
 */
const sendEmail = async (
  toEmail: string,
  toName: string,
  subject: string,
  htmlContent: string,
  textContent: string
) => {
  try {
    const recipients = [new Recipient(toEmail, toName)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(subject)
      .setHtml(htmlContent)
      .setText(textContent);

    const response = await mailerSend.email.send(emailParams);
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export { sendEmail };
