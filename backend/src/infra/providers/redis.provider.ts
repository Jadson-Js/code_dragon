import { injectable } from "tsyringe";
import { redisConnection } from "../database/redis/connection";

export interface IRedisProvider {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  incr(key: string): Promise<number>;
  expire(key: string, ttlSeconds: number): Promise<void>;
}

@injectable()
export class RedisProvider implements IRedisProvider {
  async get(key: string): Promise<string | null> {
    return await redisConnection.get(key);
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    await redisConnection.setex(key, ttlSeconds, value);
  }

  async delete(key: string): Promise<void> {
    await redisConnection.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await redisConnection.exists(key);
    return result === 1;
  }

  async incr(key: string): Promise<number> {
    return await redisConnection.incr(key);
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    await redisConnection.expire(key, ttlSeconds);
  }
}
