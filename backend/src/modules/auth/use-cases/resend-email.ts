import { inject, injectable } from "tsyringe";
import type { ResendEmailDTO } from "../auth.dto";
import { Token } from "@/domain/entities/token.entity";
import type { IJWTProvider } from "@/domain/providers/jwt.provider";
import type { IHashProvider } from "@/domain/providers/hash.provider";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import type { ITokenRepository } from "@/domain/repositories/token.repository";
import type { IEmailQueueProvider } from "@/domain/providers/email/queue.provider";
import { env } from "@/shared/env";
import { formatMs } from "@/shared/utils";

@injectable()
export class ResendEmailUseCase {
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

  async execute(params: ResendEmailDTO): Promise<void> {
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

    await this.tokenRepository.deleteAllByUserIdAndCreateToken(user.id, token);

    await this.emailQueueProvider.addJob({
      to: user.email,
      subject: "Email Verification",
      template: "VERIFY_EMAIL",
      variables: {
        name: user.name,
        link: `${env.frontendUrl}/verify-email?token=${emailToken}`,
        token: emailToken,
        expiration: formatMs(env.jwtEmailVerificationExpiresInMs),
      },
    });
  }
}
