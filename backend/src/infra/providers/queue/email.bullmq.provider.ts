import { inject, injectable } from "tsyringe";
import type { Job } from "bullmq";
import type {
  IEmailProvider,
  ISendEmailProps,
} from "@/infra/providers/email/email.provider";
import {
  BaseBullMQProvider,
  type IBaseQueueProvider,
} from "./base.bullmq.provider";
import { redisConnection } from "@/infra/database/redis/connection";

export type IEmailQueueProvider = IBaseQueueProvider<ISendEmailProps>;

@injectable()
export class EmailBullMQProvider extends BaseBullMQProvider<ISendEmailProps> {
  constructor(
    @inject("IEmailProvider")
    private readonly emailProvider: IEmailProvider,
  ) {
    super("email", redisConnection as any);
  }

  async process(job: Job<ISendEmailProps>): Promise<void> {
    await this.emailProvider.send(job.data);
  }
}
