import { inject, injectable } from "tsyringe";
import type { IRedisProvider } from "@/domain/providers/redis.provider";
import { generateHash } from "@/shared/utils";
import type { ILogoutInputDTO } from "../auth.dto";

@injectable()
export class LogoutUseCase {
  constructor(
    @inject("IRedisProvider")
    private readonly redisProvider: IRedisProvider,
  ) {}

  async execute({ userId, refreshToken }: ILogoutInputDTO): Promise<void> {
    const tokenId = generateHash(refreshToken);
    await this.redisProvider.delete(`session:${userId}:${tokenId}`);
  }
}
