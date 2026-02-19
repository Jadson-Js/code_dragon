import { Queue } from "bullmq";
import { env } from "@/shared/env";

export const emailQueue = new Queue("email", {
  connection: {
    host: env.redisHost,
    port: env.redisPort,
    maxRetriesPerRequest: null,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});
