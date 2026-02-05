import express from "express";
import cors from "cors";
import { errorHandler } from "@/shared/errors/app.error";
import userRoutes from "@/modules/user/user.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);

// Error handler deve ser o último middleware
app.use(errorHandler);

export default app;
