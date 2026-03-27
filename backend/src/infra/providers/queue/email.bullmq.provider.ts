import type {
  IEmailProvider,
  ISendEmailProps,
} from "@/domain/providers/email/email.provider";
import { BaseBullMQProvider } from "./base.bullmq.provider";
import { redisConnection } from "@/infra/database/redis/connection";
import type { Job } from "bullmq";
import { inject, injectable } from "tsyringe";

@injectable()
export class EmailBullMQProvider extends BaseBullMQProvider<ISendEmailProps> {
  constructor(
    @inject("IEmailProvider")
    private readonly emailProvider: IEmailProvider,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super("email", redisConnection as any);
  }

  async process(job: Job<ISendEmailProps>): Promise<void> {
    await this.emailProvider.send(job.data);
  }
}
