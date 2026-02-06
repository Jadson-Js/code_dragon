import express from "express";
import cors from "cors";
import userRoutes from "@/modules/user/user.routes";
import postRoutes from "@/modules/post/post.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// Error handler deve ser o último middleware
app.use(errorHandler);

export default app;
