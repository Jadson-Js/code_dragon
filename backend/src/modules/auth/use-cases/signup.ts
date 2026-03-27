import { inject, injectable } from "tsyringe";
import type { ISignupInputDTO } from "../auth.dto";
import { User } from "@/domain/entities/user.entity";
import { Token } from "@/domain/entities/token.entity";
import type { IJWTProvider } from "@/domain/providers/jwt.provider";
import type { IHashProvider } from "@/domain/providers/hash.provider";
import type { ICreateUserWithEmailTokenRepository } from "@/domain/database/repositories/auth/auth-transaction.repository";
import type { IUserRepository } from "@/domain/database/repositories/user.repository";
import { env } from "@/shared/env";
import { formatMs } from "@/shared/utils";
import type { IEmailQueueProvider } from "@/domain/providers/email/email-queue.provider";

@injectable()
export class SignupUseCase {
  constructor(
    @inject("IHashProvider")
    private readonly hashProvider: IHashProvider,

    @inject("ICreateUserWithEmailTokenRepository")
    private readonly createUserWithEmailTokenRepository: ICreateUserWithEmailTokenRepository,

    @inject("IUserRepository")
    private readonly userRepository: IUserRepository,

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
