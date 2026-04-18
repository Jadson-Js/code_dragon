import { inject, injectable } from "tsyringe";
import type { IRedisProvider } from "@/infra/providers/redis.provider";
import { generateHash } from "@/shared/utils";
// No import for ILogoutInputDTO as it's defined inline

@injectable()
export class LogoutUseCase {
  constructor(
    @inject("IRedisProvider")
    private readonly redisProvider: IRedisProvider,
  ) {}

  async execute({
    userId,
    refreshToken,
  }: {
    userId: string;
    refreshToken: string;
  }): Promise<void> {
    const tokenId = generateHash(refreshToken);
    await this.redisProvider.delete(`session:${userId}:${tokenId}`);
  }
}
