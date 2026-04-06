import { prisma } from "@/../prisma/client";
import { injectable } from "tsyringe";
import type { ISessionQuizRepository } from "@/domain/database/repositories/session-quiz.repository";
import { SessionQuiz } from "@/domain/entities/session-quiz.entity";
import type { SessionQuizStatus } from "generated/prisma/enums";

@injectable()
export class SessionQuizPrismaRepository implements ISessionQuizRepository {
  async findById(id: string): Promise<SessionQuiz | null> {
    const sessionQuiz = await prisma.sessionQuiz.findUnique({
      where: { id },
    });

    if (!sessionQuiz) return null;

    return (sessionQuiz as any).toDomain;
  }

  async updateStatus(id: string, status: SessionQuizStatus): Promise<void> {
    await prisma.sessionQuiz.update({
      where: { id },
      data: { status: status as SessionQuizStatus },
    });
  }
}
