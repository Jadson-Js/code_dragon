import { injectable } from "tsyringe";
import type { IRedisProfileSetupRepository } from "@/domain/repositories/redis-profile-setup.repository";
import { redisConnection } from "./connection";
import type { IGetSetupDTO } from "@/modules/profile/profile.dto";

@injectable()
export class RedisProfileSetupRepository implements IRedisProfileSetupRepository {
  async get(): Promise<IGetSetupDTO | null> {
    const value = await redisConnection.get("profile-setup");
    return value ? JSON.parse(value) : null;
  }

  async set(value: IGetSetupDTO): Promise<void> {
    await redisConnection.set("profile-setup", JSON.stringify(value));
  }

  async exists(): Promise<boolean> {
    const result = await redisConnection.exists("profile-setup");
    return result === 1;
  }
}
