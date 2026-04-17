import { inject, injectable } from "tsyringe";
import type { IJWTProvider } from "@/infra/providers/jwt.provider";
import type { IRedisProvider } from "@/infra/providers/redis.provider";
import { generateHash, msToSeconds } from "@/shared/utils";
import { env } from "@/shared/env";
import type { IRefreshTokenInputDTO } from "../auth.dto";

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject("IJWTProvider")
    private readonly jwtProvider: IJWTProvider,

    @inject("IRedisProvider")
    private readonly redisProvider: IRedisProvider,
  ) {}

  async execute(
    params: IRefreshTokenInputDTO,
  ): Promise<{ newRefreshToken: string; accessToken: string }> {
    // 1. Delete the old refresh token session from Redis
    const tokenId = generateHash(params.refreshToken);
    await this.redisProvider.delete(
      `session:${params.userId}:${tokenId}`,
    );

    // 2. Generate new tokens
    const accessToken = await this.jwtProvider.generateAccessToken(
      params.userId,
    );
    const newRefreshToken = await this.jwtProvider.generateRefreshToken(
      params.userId,
    );

    // 3. Save the new refresh token session in Redis
    const newTokenId = generateHash(newRefreshToken);
    const ttlSeconds = msToSeconds(env.jwtRefreshExpiresInMs);

    await this.redisProvider.set(
      `session:${params.userId}:${newTokenId}`,
      "true",
      ttlSeconds,
    );

    return { accessToken, newRefreshToken };
  }
}
