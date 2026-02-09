import type { IEmailProvider } from "@/domain/providers/email/email.provider";
import { inject, injectable } from "tsyringe";
import type { ResendEmailDTO } from "../auth.dto";
import { Token } from "@/domain/entities/token.entity";
import type { IJWTProvider } from "@/domain/providers/jwt.provider";
import type { IHashProvider } from "@/domain/providers/hash.provider";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import type { ITokenRepository } from "@/domain/repositories/token.repository";
import { env } from "@/shared/env";
import { NotFoundError, BadRequestError } from "@/shared/app.error";

@injectable()
export class ResendEmailUseCase {
  constructor(
    @inject("HashProvider")
    private readonly hashProvider: IHashProvider,

    @inject("UserRepository")
    private readonly userRepository: IUserRepository,

    @inject("TokenRepository")
    private readonly tokenRepository: ITokenRepository,

    @inject("EmailProvider")
    private readonly emailProvider: IEmailProvider,

    @inject("JWTProvider")
    private readonly jwtProvider: IJWTProvider,
  ) {}

  async execute(params: ResendEmailDTO) {
    const user = await this.userRepository.findByEmail(params.email);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.verifiedAt) {
      throw new BadRequestError("Email already verified");
    }

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

    await this.tokenRepository.create(token);

    await this.emailProvider.send({
      to: user.email,
      subject: "Email Verification",
      template: "VERIFY_EMAIL",
      variables: {
        name: user.name,
        link: `${env.appUrl}/verify-email?token=${emailToken}`,
        expiration: "24",
      },
    });

    return { message: "Verification email sent" };
  }
}
