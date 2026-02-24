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
    // 1. Verify the JWT signature
    const isValidToken = await this.jwtProvider.verifyEmailVerificationToken(
      params.token,
    );

    if (!isValidToken) {
      throw new BadRequestError("Invalid or expired token");
    }

    // 2. Decode to get the userId
    const decoded = await this.jwtProvider.decodeToken(params.token);
    const userId = decoded.sub as string;

    // 3. Find the user
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.verifiedAt) {
      throw new BadRequestError("Email already verified");
    }

    // 4. Find the matching token in the database
    const tokens = await this.tokenRepository.findByUserId(userId);
    const emailVerificationTokens = tokens.filter(
      (t) => t.type === "EMAIL_VERIFICATION",
    );

    const token = emailVerificationTokens[0];
    if (!token) throw new BadRequestError("Token not found or invalid");

    const isMatch = await this.hashProvider.compare(
      params.token,
      token.tokenHash,
    );

    if (!isMatch) {
      throw new BadRequestError("Token not found or invalid");
    }

    // 5. Check if the token is expired
    if (token.isExpired()) {
      throw new BadRequestError("Token has expired");
    }

    // 7. Mark user as verified
    const verifiedUser = user.markAsVerified();
    await this.userRepository.update(verifiedUser);

    // 8. Delete the used token
    await this.tokenRepository.delete(token.id);

    return `${env.frontendUrl}/email-verified`;
  }
}
