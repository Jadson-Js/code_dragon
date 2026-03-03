import type { UserPrismaRepository } from "@/infra/database/prisma/user.prisma.repository";
import { inject, injectable } from "tsyringe";
import type { LoginDTO } from "../auth.dto";
import { NotFoundError, UnauthorizedError } from "@/shared/app.error";
import type { User } from "@/domain/entities/user.entity";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import type { IHashProvider } from "@/domain/providers/hash.provider";
import type { IJWTProvider } from "@/domain/providers/jwt.provider";

@injectable()
export class LoginUseCase {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,

    @inject("IHashProvider")
    private readonly hashProvider: IHashProvider,

    @inject("IJWTProvider")
    private readonly jwtProvider: IJWTProvider,
  ) {}

  async execute(
    data: LoginDTO,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) throw new NotFoundError("User not found");

    const passwordIsValid = await this.hashProvider.compare(
      data.password,
      user.passwordHash,
    );
    if (!passwordIsValid) throw new NotFoundError("User not found");

    if (!user.isVerified) throw new UnauthorizedError("User not verified");

    const accessToken = await this.jwtProvider.generateAccessToken(user.id);
    const refreshToken = await this.jwtProvider.generateRefreshToken(user.id);

    return { user, accessToken, refreshToken };
  }
}
