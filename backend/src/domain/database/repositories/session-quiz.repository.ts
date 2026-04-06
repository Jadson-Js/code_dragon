import type { SessionQuiz } from "@/domain/entities/session-quiz.entity";
import type { SessionQuizStatus } from "generated/prisma/enums";

export interface ISessionQuizRepository {
  findById(id: string): Promise<SessionQuiz | null>;
  updateStatus(id: string, status: SessionQuizStatus): Promise<void>;
}
