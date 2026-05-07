import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware";
import { env } from "@/shared/environments";
import authRoutes from "@/modules/auth/auth.routes";
import profileRoutes from "@/modules/profile/profile.routes";
import quizQuestionsRoutes from "@/modules/quiz/questions/questions.routes";
import quizOptionsRoutes from "@/modules/quiz/options/quiz-options.routes";
import quizReportRoutes from "@/modules/quiz/report/report.routes";
import feedbackRoutes from "@/modules/feedback/feedback.routes";

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

app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/quiz/questions", quizQuestionsRoutes);
app.use("/api/quiz/options", quizOptionsRoutes);
app.use("/api/quiz/report", quizReportRoutes);
app.use("/api/feedbacks", feedbackRoutes);

app.use(errorHandler);

export default app;
