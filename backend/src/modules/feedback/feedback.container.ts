import { container } from "tsyringe";
import { FeedbackController } from "@/modules/feedback/feedback.controller";
import { FeedbackPrismaRepository } from "@/infra/database/prisma/feedback.prisma.repository";

container.registerSingleton(FeedbackPrismaRepository);

export const feedbackController = container.resolve(FeedbackController);
