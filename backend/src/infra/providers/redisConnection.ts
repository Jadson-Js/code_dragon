import { env } from "@/shared/env";
import IORedis from "ioredis";

export const redisConnection = new IORedis({
  host: env.redisHost,
  port: env.redisPort,
  maxRetriesPerRequest: null,
});

redisConnection.on("connect", () => console.log("Redis Client Connected"));

redisConnection.on("error", (err) => console.log("Redis Client Error", err));
