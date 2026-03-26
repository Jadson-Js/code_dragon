import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import { env } from "@/shared/env";

const app = express();
app.set("trust proxy", 1);

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use(routes);

app.use(errorHandler);

export default app;
