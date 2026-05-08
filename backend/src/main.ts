import "reflect-metadata";
import "@/infra/container/providers";

import app from "./infra/server";
import { env } from "./shared/environments";
import {
  emailQueueProvider,
  generateQuizQuestionQueueProvider,
} from "@/infra/container/providers";

emailQueueProvider.start();
generateQuizQuestionQueueProvider.start(1, {
  max: 15,
  duration: 60000,
});

app.listen(env.serverPort, () => {
  console.log(`🚀 Server running on ${env.serverUrl}`);
});
