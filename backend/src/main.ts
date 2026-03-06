import "reflect-metadata";
import "@/infra/container/providers";

import app from "./infra/http/server";
import { env } from "./shared/env";
import { queueProvider } from "@/infra/container/providers";

queueProvider.start();

app.listen(env.serverPort, () => {
  console.log(`🚀 Server running on ${env.serverUrl}`);
});
