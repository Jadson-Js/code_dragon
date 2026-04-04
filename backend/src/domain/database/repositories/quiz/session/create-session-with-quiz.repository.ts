import type { Session } from "@/domain/entities/session.entity";
import type { SessionQuiz } from "@/domain/entities/session-quiz.entity";

export interface ICreateSessionWithQuizInput {
  session: Session;
  sessionQuiz: SessionQuiz;
  stacksId: number[];
  quizSubjectsId?: number[];
}

export interface ICreateSessionWithQuizOutput {
  sessionQuizId: string;
}

export interface ICreateSessionWithQuizRepository {
  execute(
    data: ICreateSessionWithQuizInput,
  ): Promise<ICreateSessionWithQuizOutput>;
}
