import { inject, injectable } from "tsyringe";
import type { IForgotPasswordInputDTO } from "../auth.dto";
import { Token } from "@/entities/token.entity";
import type { IJWTProvider } from "@/domain/providers/jwt.provider";
import type { IHashProvider } from "@/domain/providers/hash.provider";
import type { IUserRepository } from "@/domain/database/repositories/user.repository";
import type { ITokenRepository } from "@/domain/database/repositories/token.repository";
import type { IEmailQueueProvider } from "@/domain/providers/email/email-queue.provider";
import { env } from "@/shared/env";
import { formatMs } from "@/shared/utils";

@injectable()
export class ForgotPasswordUseCase {
  constructor(
    @inject("IHashProvider")
    private readonly hashProvider: IHashProvider,

    @inject("IUserRepository")
    private readonly userRepository: IUserRepository,

    @inject("ITokenRepository")
    private readonly tokenRepository: ITokenRepository,

    @inject("IEmailQueueProvider")
    private readonly emailQueueProvider: IEmailQueueProvider,

    @inject("IJWTProvider")
    private readonly jwtProvider: IJWTProvider,
  ) {}

  async execute(params: IForgotPasswordInputDTO): Promise<void> {
    const user = await this.userRepository.findByEmail(params.email);

    // Only proceed if the user exists and is verified
    if (!user || !user.isVerified()) return;

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

    await this.tokenRepository.deleteByUserIdAndCreateNewToken(user.id, token);

    await this.emailQueueProvider.addJob({
      to: user.email,
      subject: "Redefinição de Senha",
      template: "RESET_PASSWORD",
      variables: {
        name: user.name,
        link: `${env.clientUrl}/auth/reset-password/${resetToken}`,
        token: resetToken,
        expiration: formatMs(env.jwtResetPasswordExpiresInMs),
      },
    });
  }
}
