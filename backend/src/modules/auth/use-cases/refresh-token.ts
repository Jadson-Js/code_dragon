import { inject, injectable } from "tsyringe";
import type { IJWTProvider } from "@/domain/providers/jwt.provider";
import type { IRedisTokenRepository } from "@/domain/database/redis/token.repository";
import { generateHash, msToSeconds } from "@/shared/utils";
import { env } from "@/shared/env";
import type { IRefreshTokenInputDTO } from "../auth.dto";

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject("IJWTProvider")
    private readonly jwtProvider: IJWTProvider,

    @inject("IRedisTokenRepository")
    private readonly redisTokenRepository: IRedisTokenRepository,
  ) {}

  async execute(
    params: IRefreshTokenInputDTO,
  ): Promise<{ newRefreshToken: string; accessToken: string }> {
    // 1. Delete the old refresh token session from Redis
    const tokenId = generateHash(params.refreshToken);
    await this.redisTokenRepository.delete(
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

    await this.redisTokenRepository.set(
      `session:${params.userId}:${newTokenId}`,
      "true",
      ttlSeconds,
    );

    return { accessToken, newRefreshToken };
  }
}
