import dotenv from "dotenv";
dotenv.config();

export const env = {
  serverPort: process.env.SERVER_PORT || 3001,
  serverUrl: process.env.SERVER_URL || "",
  clientUrl: process.env.CLIENT_URL || "",

  databaseUrl: process.env.DATABASE_URL || "",
  dbHost: process.env.DB_HOST || "",
  dbPort: process.env.DB_PORT || "",
  dbName: process.env.DB_NAME || "",
  dbUser: process.env.DB_USER || "",
  dbPassword: process.env.DB_PASSWORD || "",

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "",
  jwtEmailVerificationSecret: process.env.JWT_EMAIL_VERIFICATION_SECRET || "",
  jwtResetPasswordSecret: process.env.JWT_RESET_PASSWORD_SECRET || "",
  jwtAccessExpiresInMs: Number(process.env.JWT_ACCESS_EXPIRES_IN_MS) || 900000,
  jwtRefreshExpiresInMs:
    Number(process.env.JWT_REFRESH_EXPIRES_IN_MS) || 604800000,
  jwtEmailVerificationExpiresInMs:
    Number(process.env.JWT_EMAIL_VERIFICATION_EXPIRES_IN_MS) || 600000,
  jwtResetPasswordExpiresInMs:
    Number(process.env.JWT_RESET_PASSWORD_EXPIRES_IN_MS) || 900000,

  resendApiKey: process.env.RESEND_API_KEY || "",

  redisHost: process.env.REDIS_HOST || "",
  redisPort: Number(process.env.REDIS_PORT) || 6379,

  geminiApiKey: process.env.GEMINI_API_KEY || "",
  mockAi: process.env.MOCK_AI === "true" ? true : false,

  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpUser: process.env.SMTP_USER || "",
  smtpPassword: process.env.SMTP_PASSWORD || "",
  smtpFrom: process.env.SMTP_FROM || "",
};

export const EMAIL_TEMPLATES = {
  VERIFY_EMAIL: "VERIFY_EMAIL",
  RESET_PASSWORD: "RESET_PASSWORD",
} as const;
export type IEMAIL_TEMPLATES =
  (typeof EMAIL_TEMPLATES)[keyof typeof EMAIL_TEMPLATES];
