import { inject, injectable } from "tsyringe";
import type { SignupAuthDTO } from "../auth.dto";
import { User } from "@/domain/entities/user.entity";
import { Token } from "@/domain/entities/token.entity";
import type { IJWTProvider } from "@/domain/providers/jwt.provider";
import type { IHashProvider } from "@/domain/providers/hash.provider";
import type { IAuthTransactionRepository } from "@/domain/repositories/auth-transaction.repository";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import { env } from "@/shared/env";
import { formatMs } from "@/shared/utils";
import type { IEmailQueueProvider } from "@/domain/providers/email/queue.provider";

@injectable()
export class SignupAuthUseCase {
  private readonly GENERIC_RESPONSE = {
    message:
      "If this email is not registered, you will receive a verification email.",
  };

  constructor(
    @inject("IHashProvider")
    private readonly hashProvider: IHashProvider,

    @inject("AuthTransactionRepository")
    private readonly authTransactionRepository: IAuthTransactionRepository,

    @inject("UserRepository")
    private readonly userRepository: IUserRepository,

    @inject("IJWTProvider")
    private readonly jwtProvider: IJWTProvider,

    @inject("IEmailQueueProvider")
    private readonly emailQueueProvider: IEmailQueueProvider,
  ) {}

  async execute(params: SignupAuthDTO) {
    const existingUser = await this.userRepository.findByEmail(params.email);

    if (existingUser) {
      return this.GENERIC_RESPONSE;
    }

    const passwordHash = await this.hashProvider.hash(params.password);
    const user = User.create({ ...params, passwordHash });

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

    await this.authTransactionRepository.createUserWithEmailToken(user, token);

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

    return this.GENERIC_RESPONSE;
  }
}
