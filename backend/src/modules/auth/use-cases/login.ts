import { inject, injectable } from "tsyringe";
import type { ILoginInputDTO } from "../auth.dto";
import { NotFoundError, UnauthorizedError } from "@/shared/app.error";
import type { User } from "@/domain/entities/user.entity";
import type { IUserRepository } from "@/domain/database/repositories/user.repository";
import type { IHashProvider } from "@/domain/providers/hash.provider";
import type { IJWTProvider } from "@/domain/providers/jwt.provider";
import type { IRedisProvider } from "@/domain/providers/redis.provider";
import { env } from "@/shared/env";
import { msToSeconds, generateHash } from "@/shared/utils";

@injectable()
export class LoginUseCase {
  constructor(
    @inject("IUserRepository")
    private readonly userRepository: IUserRepository,

    @inject("IHashProvider")
    private readonly hashProvider: IHashProvider,

    @inject("IJWTProvider")
    private readonly jwtProvider: IJWTProvider,

    @inject("IRedisProvider")
    private readonly redisProvider: IRedisProvider,
  ) {}

  async execute(
    data: ILoginInputDTO,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) throw new NotFoundError("User not found");

    const passwordIsValid = await this.hashProvider.compare(
      data.password,
      user.passwordHash,
    );
    if (!passwordIsValid) throw new NotFoundError("User not found");

    if (!user.isVerified()) throw new UnauthorizedError("User not verified");

    const accessToken = await this.jwtProvider.generateAccessToken(user.id);
    const refreshToken = await this.jwtProvider.generateRefreshToken(user.id);

    // Multi-session support: session:userId:sha256(token)
    const tokenId = generateHash(refreshToken);
    const ttlSeconds = msToSeconds(env.jwtRefreshExpiresInMs);

    await this.redisProvider.set(
      `session:${user.id}:${tokenId}`,
      "true",
      ttlSeconds,
    );

    return { user, accessToken, refreshToken };
  }
}
