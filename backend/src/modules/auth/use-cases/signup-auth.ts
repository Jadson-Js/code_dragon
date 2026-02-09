import type { IEmailProvider } from "@/domain/providers/email/email.provider";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import { inject, injectable } from "tsyringe";
import type { SignupAuthDTO } from "../auth.dto";
import { User } from "@/domain/entities/user.entity";
import type { ITokenRepository } from "@/domain/repositories/token.repository";
import { Token } from "@/domain/entities/token.entity";
import type { IJWTProvider } from "@/domain/providers/jwt.provider";
import type { IHashProvider } from "@/domain/providers/hash.provider";
import { ConflictError } from "@/shared/app.error";
import { env } from "@/shared/env";

@injectable()
export class SignupAuthUseCase {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,

    @inject("HashProvider")
    private readonly hashProvider: IHashProvider,

    @inject("TokenRepository")
    private readonly tokenRepository: ITokenRepository,

    @inject("EmailProvider")
    private readonly emailProvider: IEmailProvider,

    @inject("JWTProvider")
    private readonly jwtProvider: IJWTProvider,
  ) {}

  async execute(params: SignupAuthDTO) {
    const userExists = await this.userRepository.findByEmail(params.email);

    if (userExists) {
      throw new ConflictError("Email already registered");
    }

    const passwordHash = await this.hashProvider.hash(params.password);
    const user = User.create({ ...params, passwordHash });

    const emailVerificationToken =
      await this.jwtProvider.generateEmailVerificationToken(user.id);
    const emailVerificationTokenHash = await this.hashProvider.hash(
      emailVerificationToken,
    );

    const token = Token.create({
      userId: user.id,
      tokenHash: emailVerificationTokenHash,
      type: "EMAIL_VERIFICATION",
      expiresAt: new Date(Date.now() + env.emailVerificationTokenExpiration),
    });

    const response = await this.userRepository.create(user);
    await this.tokenRepository.create(token);
    await this.emailProvider.send({
      to: user.email,
      subject: "Email Verification",
      template: "VERIFY_EMAIL",
      variables: {
        name: user.name,
        link: `${env.appUrl}/verify-email?token=${emailVerificationToken}`,
        expiration: "24",
      },
    });

    return response;
  }
}
