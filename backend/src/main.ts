import "reflect-metadata";
import "@/infra/container/providers";

import app from "./infra/http/server";
import { env } from "./shared/env";
import { container } from "tsyringe";
import type { IEmailQueueProvider } from "./domain/providers/email/queue.provider";

const queueProvider = container.resolve<IEmailQueueProvider>(
  "IEmailQueueProvider",
);
queueProvider.start();

app.listen(env.serverPort, () => {
  console.log(`🚀 Server running on ${env.serverUrl}`);
});
