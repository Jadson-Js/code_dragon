import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT || 3000,
  resendApiKey: process.env.RESEND_API_KEY || "",
};
