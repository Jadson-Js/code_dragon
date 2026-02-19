import "reflect-metadata";
import "@/infra/container/providers";
import { EmailWorker } from "./infra/providers/queue/worker.provider";

import app from "./infra/http/server";
import { env } from "./shared/env";
import { container } from "tsyringe";

const emailWorker = container.resolve(EmailWorker);
emailWorker.start();

app.listen(env.apiPort, () => {
  console.log(`🚀 Server running on ${env.apiUrl}`);
});
