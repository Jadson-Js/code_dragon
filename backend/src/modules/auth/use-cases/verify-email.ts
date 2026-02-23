import { inject, injectable } from "tsyringe";
import type { VerifyEmailDTO } from "../auth.dto";
import type { IJWTProvider } from "@/domain/providers/jwt.provider";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import type { ITokenRepository } from "@/domain/repositories/token.repository";
import type { IHashProvider } from "@/domain/providers/hash.provider";
import { NotFoundError, BadRequestError } from "@/shared/app.error";
import { env } from "@/shared/env";

@injectable()
export class VerifyEmailUseCase {
  constructor(
    @inject("IJWTProvider")
    private readonly jwtProvider: IJWTProvider,

    @inject("IHashProvider")
    private readonly hashProvider: IHashProvider,

    @inject("UserRepository")
    private readonly userRepository: IUserRepository,

    @inject("TokenRepository")
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(params: VerifyEmailDTO) {
    const isValidToken = await this.jwtProvider.verifyEmailVerificationToken(
      params.token,
    );

    if (!isValidToken) {
      throw new BadRequestError("Invalid or expired token");
    }

    const decoded = await this.jwtProvider.decodeToken(params.token);
    const userId = decoded.sub as string;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.verifiedAt) {
      throw new BadRequestError("Email already verified");
    }

    // Find and validate the token in database by comparing hashes
    const tokens = await this.tokenRepository.findByUserId(userId);
    const emailVerificationTokens = tokens.filter(
      (t) => t.type === "EMAIL_VERIFICATION",
    );

    // Find the token that matches the received token hash
    let emailToken = null;
    for (const token of emailVerificationTokens) {
      const isMatch = await this.hashProvider.compare(
        params.token,
        token.tokenHash,
      );
      if (isMatch) {
        emailToken = token;
        break;
      }
    }

    if (!emailToken) {
      throw new BadRequestError("Token not found or invalid");
    }

    // Mark user as verified using entity method
    const verifiedUser = user.markAsVerified();
    await this.userRepository.update(verifiedUser);

    // Delete the used token
    await this.tokenRepository.delete(emailToken.id);

    // Redirect to success page or return success message
    return {
      success: true,
      redirectUrl: `${env.frontendUrl}/email-verified`,
    };
  }
}
