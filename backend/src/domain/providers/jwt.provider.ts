export interface IJWTProvider {
  generateRefreshToken(userId: string): Promise<string>;
  generateAccessToken(userId: string): Promise<string>;
  generateEmailVerificationToken(userId: string): Promise<string>;
  generatePasswordResetToken(userId: string): Promise<string>;
  verifyRefreshToken(token: string): Promise<boolean>;
  verifyAccessToken(token: string): Promise<boolean>;
  verifyEmailVerificationToken(token: string): Promise<boolean>;
  verifyPasswordResetToken(token: string): Promise<boolean>;
  decodeToken(token: string): Promise<{ sub: string; [key: string]: unknown }>;
}
