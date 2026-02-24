import dotenv from "dotenv";
dotenv.config();

export const env = {
  apiPort: process.env.API_PORT || 3000,
  apiUrl: process.env.API_URL || "",
  frontendUrl: process.env.FRONTEND_URL || "",

  databaseUrl: process.env.DATABASE_URL || "",
  dbHost: process.env.DB_HOST || "",
  dbPort: process.env.DB_PORT || "",
  dbName: process.env.DB_NAME || "",
  dbUser: process.env.DB_USER || "",
  dbPassword: process.env.DB_PASSWORD || "",

  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,

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
};
