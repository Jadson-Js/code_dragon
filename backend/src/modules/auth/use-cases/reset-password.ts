import { inject, injectable } from "tsyringe";
import type { ResetPasswordDTO } from "../auth.dto";
import type { IJWTProvider } from "@/domain/providers/jwt.provider";
import type { IHashProvider } from "@/domain/providers/hash.provider";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import type { ITokenRepository } from "@/domain/repositories/token.repository";
import { NotFoundError, BadRequestError } from "@/shared/app.error";

@injectable()
export class ResetPasswordUseCase {
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

  async execute(params: ResetPasswordDTO): Promise<void> {
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

    // 5. Hash the new password and update the user
    const passwordHash = await this.hashProvider.hash(params.password);
    const updatedUser = user.changePassword(passwordHash);
    await this.userRepository.update(updatedUser);

    // 6. Delete the used token
    await this.tokenRepository.delete(token.id);
  }
}
