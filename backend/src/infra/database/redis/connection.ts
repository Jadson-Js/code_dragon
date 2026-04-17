import { env } from "@/shared/env";
import IORedis from "ioredis";

const isTest = process.env.NODE_ENV === "test";

export const redisConnection = new IORedis({
  host: env.redisHost,
  port: env.redisPort,
  maxRetriesPerRequest: isTest ? 0 : null,
  lazyConnect: isTest,
});

if (!isTest) {
  redisConnection.on("connect", () => console.log("Redis Client Connected"));
  redisConnection.on("error", (err) => console.log("Redis Client Error", err));
}
