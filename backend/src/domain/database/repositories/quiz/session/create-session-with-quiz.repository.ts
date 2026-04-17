import type { Session } from "@/entities/session.entity";
import type { SessionQuiz } from "@/entities/session-quiz.entity";

export interface ICreateSessionWithQuizInput {
  session: Session;
  sessionQuiz: SessionQuiz;
  stacksId: number[];
  quizSubjectsId?: number[];
}

export interface ICreateSessionWithQuizOutput {
  sessionQuiz: SessionQuiz;
}

export interface ICreateSessionWithQuizRepository {
  execute(
    data: ICreateSessionWithQuizInput,
  ): Promise<ICreateSessionWithQuizOutput>;
}
