import "reflect-metadata";
import "@/infra/container/providers";

import app from "./infra/http/server";
import { env } from "./shared/env";
import {
  queueProvider,
  generateQuizQuestionQueueProvider,
} from "@/infra/container/providers";

queueProvider.start();
generateQuizQuestionQueueProvider.start();

app.listen(env.serverPort, () => {
  console.log(`🚀 Server running on ${env.serverUrl}`);
});
