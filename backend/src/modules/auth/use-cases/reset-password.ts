import { inject, injectable } from "tsyringe";
import type { IResetPasswordInputDTO } from "../auth.dto";
import type { IJWTProvider } from "@/infra/providers/jwt.provider";
import type { IHashProvider } from "@/infra/providers/hash.provider";
import type { IUserRepository } from "@/infra/database/prisma/user.prisma.repository";
import type { ITokenRepository } from "@/infra/database/prisma/token.prisma.repository";
import type { IResetPasswordRepository } from "@/infra/database/prisma/auth/reset-password.prisma.repository";
import { NotFoundError, BadRequestError } from "@/shared/app.error";

@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject("IJWTProvider")
    private readonly jwtProvider: IJWTProvider,

    @inject("IHashProvider")
    private readonly hashProvider: IHashProvider,

    @inject("IUserRepository")
    private readonly userRepository: IUserRepository,

    @inject("ITokenRepository")
    private readonly tokenRepository: ITokenRepository,

    @inject("IResetPasswordRepository")
    private readonly resetPasswordRepository: IResetPasswordRepository,
  ) {}

  async execute(params: IResetPasswordInputDTO): Promise<void> {
    // 1. Verify the JWT signature
    const isValidToken = await this.jwtProvider.verifyPasswordResetToken(
      params.token,
    );

    if (!isValidToken) throw new BadRequestError("Invalid or expired token");

    // 2. Decode to get the userId
    const decoded = await this.jwtProvider.decodeToken(params.token);
    const userId = decoded.sub as string;

    // 3. Find the user
    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFoundError("User not found");
    if (!user.isVerified()) throw new BadRequestError("User is not verified");

    // 4. Find the matching token in the database
    const tokens = await this.tokenRepository.findByUserId(userId);
    const passwordResetTokens = tokens.filter(
      (t) => t.type === "PASSWORD_RESET",
    );

    const token = passwordResetTokens[0];
    if (!token) throw new BadRequestError("Token not found or invalid");

    const isMatch = await this.hashProvider.compare(
      params.token,
      token.tokenHash,
    );

    if (!isMatch) throw new BadRequestError("Token not found or invalid");
    if (token.isExpired()) throw new BadRequestError("Token has expired");

    // 5. Hash the new password and update atomically
    const passwordHash = await this.hashProvider.hash(params.password);
    const updatedUser = user.changePassword(passwordHash);

    await this.resetPasswordRepository.execute(updatedUser, token.id);
  }
}
