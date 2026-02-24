import { inject, injectable } from "tsyringe";
import type { ForgotPasswordDTO } from "../auth.dto";
import { Token } from "@/domain/entities/token.entity";
import type { IJWTProvider } from "@/domain/providers/jwt.provider";
import type { IHashProvider } from "@/domain/providers/hash.provider";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import type { ITokenRepository } from "@/domain/repositories/token.repository";
import type { IEmailQueueProvider } from "@/domain/providers/email/queue.provider";
import { env } from "@/shared/env";
import { formatMs } from "@/shared/utils";

@injectable()
export class ForgotPasswordUseCase {
  private readonly GENERIC_RESPONSE = {
    message:
      "If this email is registered and verified, you will receive a password reset email.",
  };

  constructor(
    @inject("IHashProvider")
    private readonly hashProvider: IHashProvider,

    @inject("UserRepository")
    private readonly userRepository: IUserRepository,

    @inject("TokenRepository")
    private readonly tokenRepository: ITokenRepository,

    @inject("IEmailQueueProvider")
    private readonly emailQueueProvider: IEmailQueueProvider,

    @inject("IJWTProvider")
    private readonly jwtProvider: IJWTProvider,
  ) {}

  async execute(params: ForgotPasswordDTO) {
    const user = await this.userRepository.findByEmail(params.email);

    // Only proceed if the user exists and is verified
    if (!user || !user.verifiedAt) {
      return this.GENERIC_RESPONSE;
    }

    const resetToken = await this.jwtProvider.generatePasswordResetToken(
      user.id,
    );
    const resetTokenHash = await this.hashProvider.hash(resetToken);

    const token = Token.create({
      userId: user.id,
      tokenHash: resetTokenHash,
      type: "PASSWORD_RESET",
      expiresAt: new Date(Date.now() + env.jwtResetPasswordExpiresInMs),
    });

    await this.tokenRepository.deleteAllByUserIdAndCreateToken(user.id, token);

    await this.emailQueueProvider.addJob({
      to: user.email,
      subject: "Redefinição de Senha",
      template: "RESET_PASSWORD",
      variables: {
        name: user.name,
        link: `${env.frontendUrl}/reset-password?token=${resetToken}`,
        token: resetToken,
        expiration: formatMs(env.jwtResetPasswordExpiresInMs),
      },
    });

    return this.GENERIC_RESPONSE;
  }
}
