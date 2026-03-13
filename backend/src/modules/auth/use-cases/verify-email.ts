import { inject, injectable } from "tsyringe";
import type { IVerifyEmailInputDTO } from "../auth.dto";
import type { IJWTProvider } from "@/domain/providers/jwt.provider";
import type { IUserRepository } from "@/domain/database/repositories/user.repository";
import type { ITokenRepository } from "@/domain/database/repositories/token.repository";
import type { IHashProvider } from "@/domain/providers/hash.provider";
import { NotFoundError, BadRequestError } from "@/shared/app.error";

@injectable()
export class VerifyEmailUseCase {
  constructor(
    @inject("IJWTProvider")
    private readonly jwtProvider: IJWTProvider,

    @inject("IHashProvider")
    private readonly hashProvider: IHashProvider,

    @inject("IUserRepository")
    private readonly userRepository: IUserRepository,

    @inject("ITokenRepository")
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(params: IVerifyEmailInputDTO): Promise<void> {
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

    if (user.isVerified()) {
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

    // 6. Mark user as verified
    const verifiedUser = user.markAsVerified();
    await this.userRepository.update(verifiedUser);

    // 7. Delete the used token
    await this.tokenRepository.delete(token.id);
  }
}
