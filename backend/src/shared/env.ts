import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT || 3000,
  resendApiKey: process.env.RESEND_API_KEY || "",
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  appUrl: process.env.APP_URL || "http://localhost:3000",

  // JWT
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "access-secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "refresh-secret",
  jwtEmailVerificationSecret:
    process.env.JWT_EMAIL_VERIFICATION_SECRET || "email-secret",
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  jwtEmailVerificationExpiresIn:
    process.env.JWT_EMAIL_VERIFICATION_EXPIRES_IN || "24h",
  emailVerificationTokenExpiration:
    Number(process.env.EMAIL_VERIFICATION_TOKEN_EXPIRATION) ||
    1000 * 60 * 60 * 24, // 24h in ms

  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
};
