import { injectable } from "tsyringe";
import { prisma } from "../../../../prisma/client";
import { Feedback } from "@/entities/feedback.entity";

@injectable()
export class FeedbackPrismaRepository {
  async create(data: {
    userId: string;
    featureId?: number | null;
    sessionId?: string | null;
    rate: number;
    reason: string;
    description: string;
  }): Promise<Feedback> {
    const response = await prisma.feedback.create({
      data: {
        userId: data.userId,
        featureId: data.featureId ?? null,
        sessionId: data.sessionId ?? null,
        rate: data.rate,
        reason: data.reason,
        description: data.description,
      },
    });

    return response.toDomain;
  }
}
