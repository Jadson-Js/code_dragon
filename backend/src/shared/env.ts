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

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "access-secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "refresh-secret",
  jwtEmailVerificationSecret:
    process.env.JWT_EMAIL_VERIFICATION_SECRET || "email-verification-secret",
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "5m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "24h",
  jwtEmailVerificationExpiresIn:
    process.env.JWT_EMAIL_VERIFICATION_EXPIRES_IN || "10m",

  resendApiKey: process.env.RESEND_API_KEY || "",
};
