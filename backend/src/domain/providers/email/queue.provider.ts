import type { SendEmailProps } from "./email.provider";

export interface IEmailQueueProvider {
  /** Starts the worker that processes queued email jobs */
  start(): void;
  /** Adds an email job to the queue */
  addJob(data: SendEmailProps): Promise<void>;
}
