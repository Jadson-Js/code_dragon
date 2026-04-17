import { inject, injectable } from "tsyringe";
import type { ISignupInputDTO } from "../auth.dto";
import { User } from "@/entities/user.entity";
import { Token } from "@/entities/token.entity";
import type { IJWTProvider } from "@/infra/providers/jwt.provider";
import type { IHashProvider } from "@/infra/providers/hash.provider";
import { CreateUserWithEmailTokenPrismaRepository } from "@/infra/database/prisma/auth/create-user-with-email-token.prisma.repository";
import { UserPrismaRepository } from "@/infra/database/prisma/user.prisma.repository";
import { env } from "@/shared/env";
import { formatMs } from "@/shared/utils";
import type { IEmailQueueProvider } from "@/infra/providers/queue/email.bullmq.provider";

@injectable()
export class SignupUseCase {
  constructor(
    @inject("IHashProvider")
    private readonly hashProvider: IHashProvider,

    private readonly createUserWithEmailTokenRepository: CreateUserWithEmailTokenPrismaRepository,

    private readonly userRepository: UserPrismaRepository,

    @inject("IJWTProvider")
    private readonly jwtProvider: IJWTProvider,

    @inject("IEmailQueueProvider")
    private readonly emailQueueProvider: IEmailQueueProvider,
  ) {}

  async execute(params: ISignupInputDTO): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(params.email);

    if (existingUser) return;

    const passwordHash = await this.hashProvider.hash(params.password);
    const user = User.create({
      ...params,
      passwordHash,
    });

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

    await this.createUserWithEmailTokenRepository.execute(user, token);

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
