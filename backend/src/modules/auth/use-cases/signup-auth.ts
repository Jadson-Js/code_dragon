import type { IEmailProvider } from "@/domain/providers/email/email.provider";
import { inject, injectable } from "tsyringe";
import type { SignupAuthDTO } from "../auth.dto";
import { User } from "@/domain/entities/user.entity";
import { Token } from "@/domain/entities/token.entity";
import type { IJWTProvider } from "@/domain/providers/jwt.provider";
import type { IHashProvider } from "@/domain/providers/hash.provider";
import type { IAuthTransactionRepository } from "@/domain/repositories/auth-transaction.repository";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import { env } from "@/shared/env";

@injectable()
export class SignupAuthUseCase {
  private readonly GENERIC_RESPONSE = {
    message:
      "Se este email não estiver cadastrado, você receberá um email de verificação.",
  };

  constructor(
    @inject("HashProvider")
    private readonly hashProvider: IHashProvider,

    @inject("AuthTransactionRepository")
    private readonly authTransactionRepository: IAuthTransactionRepository,

    @inject("UserRepository")
    private readonly userRepository: IUserRepository,

    @inject("EmailProvider")
    private readonly emailProvider: IEmailProvider,

    @inject("JWTProvider")
    private readonly jwtProvider: IJWTProvider,
  ) {}

  async execute(params: SignupAuthDTO) {
    // Check if user already exists (silently)
    const existingUser = await this.userRepository.findByEmail(params.email);

    if (existingUser) {
      // Return same generic message to prevent email enumeration
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
      expiresAt: new Date(Date.now() + env.emailVerificationTokenExpiration),
    });

    await this.authTransactionRepository.createUserWithEmailToken(user, token);

    await this.emailProvider.send({
      to: user.email,
      subject: "Email Verification",
      template: "VERIFY_EMAIL",
      variables: {
        name: user.name,
        link: `${env.appUrl}/api/auth/verify-email`,
        token: emailToken,
        expiration: "24",
      },
    });

    return this.GENERIC_RESPONSE;
  }
}
