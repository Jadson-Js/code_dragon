import { Worker, Queue, type Job } from "bullmq";
import { redisConnection } from "../../database/redis/connection";
import { EmailProvider } from "./email.provider";
import type { SendEmailProps } from "@/domain/providers/email/email.provider";
import { inject, injectable } from "tsyringe";
import type { IEmailQueueProvider } from "@/domain/providers/email/queue.provider";

const QUEUE_NAME = "email";

@injectable()
export class EmailQueueProvider implements IEmailQueueProvider {
  private readonly queue: Queue<SendEmailProps>;

  constructor(
    @inject("IEmailProvider")
    private readonly emailProvider: EmailProvider,
  ) {
    this.queue = new Queue(QUEUE_NAME, {
      connection: redisConnection as any,
    });
  }

  start(): void {
    const worker = new Worker(
      QUEUE_NAME,
      async (job: Job<SendEmailProps>) => {
        await this.emailProvider.send(job.data);
      },
      {
        connection: redisConnection as any,
        concurrency: 1,
        limiter: {
          max: 10,
          duration: 60000,
        },
      },
    );

    worker.on("completed", (job) => {
      console.log(`✅ Job #${job.id} successfully processed`);
    });

    worker.on("failed", (job, error) => {
      console.error(`❌ Job #${job?.id} failed: ${error.message}`);
    });

    worker.on("stalled", (jobId) => {
      console.warn(`⚠️  Job #${jobId} stalled, will be reprocessed`);
    });

    console.log("👷 Worker de emails started");
  }

  async addJob(data: SendEmailProps): Promise<void> {
    await this.queue.add("email", data);
  }
}
