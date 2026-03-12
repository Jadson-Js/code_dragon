import type { IGetSetupRepository } from "@/domain/repositories/profile/get-setup.repository";
import type { IRedisProfileSetupRepository } from "@/domain/repositories/redis-profile-setup.repository";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetSetupUseCase {
  constructor(
    @inject("getSetupRepository")
    private readonly getSetupRepository: IGetSetupRepository,

    @inject("redisProfileSetupRepository")
    private readonly redisProfileSetupRepository: IRedisProfileSetupRepository,
  ) {}

  async execute() {
    const exists = await this.redisProfileSetupRepository.exists();

    if (exists) {
      const response = await this.redisProfileSetupRepository.get();
      return response;
    }

    const response = await this.getSetupRepository.execute();
    await this.redisProfileSetupRepository.set(response);

    return response;
  }
}
