import type { IBaseQueueProvider } from "@/domain/providers/queue/base.provider";
import { Queue, Worker, Job, type ConnectionOptions } from "bullmq";

export abstract class BaseBullMQProvider<T> implements IBaseQueueProvider<T> {
  protected readonly queue: Queue;

  constructor(
    protected readonly queueName: string,
    protected readonly connection: ConnectionOptions,
  ) {
    this.queue = new Queue(this.queueName, { connection: this.connection });
  }

  abstract process(job: Job<T>): Promise<void>;

  public start(concurrency = 1): void {
    const worker = new Worker(this.queueName, (job) => this.process(job), {
      connection: this.connection,
      concurrency,
    });

    worker.on("failed", (job, err) => {
      console.error(
        `❌ Worker [${this.queueName}] job ${job?.id} failed:`,
        err,
      );
    });

    worker.on("error", (err) => {
      console.error(`❌ Worker [${this.queueName}] error:`, err);
    });

    console.log(`👷 Worker [${this.queueName}] started`);
  }

  public async addJob(data: T): Promise<void> {
    await this.queue.add(this.queueName, data, {
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
    });
  }
}
