import { Worker, Job } from "bullmq";
import { redisConnection } from "./redisConnection";
import { EmailProvider } from "../email/email.provider";
import type { SendEmailProps } from "@/domain/providers/email/email.provider";
import { inject, injectable } from "tsyringe";

@injectable()
export class EmailWorker {
  constructor(
    @inject("EmailProvider")
    private readonly emailProvider: EmailProvider,
  ) {}

  start() {
    this.worker().on("completed", (job) => {
      console.log(`✅ Job #${job.id} successfully processed`);

      this.worker().on("failed", (job, error) => {
        console.error(`❌ Job #${job?.id} failed: ${error.message}`);
      });

      this.worker().on("stalled", (jobId) => {
        console.warn(`⚠️  Job #${jobId} stalled, will be reprocessed`);
      });

      console.log("👷 Worker de emails started");
      return this.worker;
    });
  }

  worker() {
    return new Worker(
      "email",
      async (job: Job<SendEmailProps>) => {
        console.log(
          `⚙️  Processando job #${job.id} - tipo: ${job.data.subject}`,
        );

        await this.emailProvider.send(job.data);
      },
      {
        connection: redisConnection as any,
        concurrency: 5,
      },
    );
  }
}
