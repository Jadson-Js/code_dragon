import "reflect-metadata";
import "@/infra/container/providers";

import app from "./infra/http/server";
import { env } from "./shared/env";

app.listen(env.apiPort, () => {
  console.log(`🚀 Server running on http://localhost:${env.apiPort}`);
});
