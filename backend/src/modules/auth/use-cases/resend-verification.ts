import { inject, injectable } from "tsyringe";
import type { IResendVerificationInputDTO } from "../auth.dto";
import { Token } from "@/entities/token.entity";
import type { IJWTProvider } from "@/domain/providers/jwt.provider";
import type { IHashProvider } from "@/domain/providers/hash.provider";
import type { IUserRepository } from "@/domain/database/repositories/user.repository";
import type { ITokenRepository } from "@/domain/database/repositories/token.repository";
import type { IEmailQueueProvider } from "@/domain/providers/email/email-queue.provider";
import { env } from "@/shared/env";
import { formatMs } from "@/shared/utils";

@injectable()
export class ResendVerificationUseCase {
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

  async execute(params: IResendVerificationInputDTO): Promise<void> {
    const user = await this.userRepository.findByEmail(params.email);

    if (!user || user.isVerified()) return;

    const emailToken = await this.jwtProvider.generateEmailVerificationToken(
      user.id,
    );
    const emailTokenHash = await this.hashProvider.hash(emailToken);
    const token = Token.create({
      userId: user.id,
      tokenHash: emailTokenHash,
      type: "EMAIL_VERIFICATION",
      expiresAt: new Date(Date.now() + env.jwtEmailVerificationExpiresInMs),
    });

    await this.tokenRepository.deleteByUserIdAndCreateNewToken(user.id, token);

    await this.emailQueueProvider.addJob({
      to: user.email,
      subject: "Email Verification",
      template: "VERIFY_EMAIL",
      variables: {
        name: user.name,
        link: `${env.clientUrl}/auth/verify-email/${emailToken}`,
        token: emailToken,
        expiration: formatMs(env.jwtEmailVerificationExpiresInMs),
      },
    });
  }
}
