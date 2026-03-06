import { inject, injectable } from "tsyringe";
import type { IRedisTokenRepository } from "@/domain/repositories/redis-token.repository";
import { generateHash } from "@/shared/utils";
import type { LogoutDTO } from "../auth.dto";

@injectable()
export class LogoutUseCase {
  constructor(
    @inject("IRedisTokenRepository")
    private readonly redisTokenRepository: IRedisTokenRepository,
  ) {}

  async execute({ userId, refreshToken }: LogoutDTO): Promise<void> {
    const tokenId = generateHash(refreshToken);
    await this.redisTokenRepository.delete(`session:${userId}:${tokenId}`);
  }
}
