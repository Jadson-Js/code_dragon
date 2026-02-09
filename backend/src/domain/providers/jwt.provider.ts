export interface IJWTProvider {
  generateRefreshToken(userId: string): Promise<string>;
  generateAccessToken(userId: string): Promise<string>;
  generateEmailVerificationToken(userId: string): Promise<string>;
  verifyRefreshToken(token: string): Promise<boolean>;
  verifyAccessToken(token: string): Promise<boolean>;
  verifyEmailVerificationToken(token: string): Promise<boolean>;
}
