import { inject, injectable } from "tsyringe";
import type { IResendVerificationInputDTO } from "../auth.schema";
import { Token } from "@/entities/token.entity";
import type { IJWTProvider } from "@/infra/providers/jwt.provider";
import type { IHashProvider } from "@/infra/providers/hash.provider";
import { UserPrismaRepository } from "@/infra/database/prisma/user.prisma.repository";
import { TokenPrismaRepository } from "@/infra/database/prisma/token.prisma.repository";
import type { IEmailQueueProvider } from "@/infra/providers/queue/email.bullmq.provider";
import { env } from "@/shared/env";
import { formatMs } from "@/shared/utils";

@injectable()
export class ResendVerificationUseCase {
  constructor(
    @inject("IHashProvider")
    private readonly hashProvider: IHashProvider,

    private readonly userRepository: UserPrismaRepository,

    private readonly tokenRepository: TokenPrismaRepository,

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
