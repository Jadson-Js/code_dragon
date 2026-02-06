import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

// All routes are registered in the auto-generated routes/index.ts
app.use(routes);

// Error handler deve ser o último middleware
app.use(errorHandler);

export default app;
