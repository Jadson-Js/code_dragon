import type { IQuizQuestionGenerateInputDTO } from "@/modules/quiz/questions/questions.dto";
import type { QuizObjective } from "@/entities/quiz-objective.entity";
import type { QuizSubject } from "@/entities/quiz-subject.entity";
import type { Seniority } from "@/entities/seniority.entity";
import type { Specialty } from "@/entities/specialty.entity";
import type { Stack } from "@/entities/stack.entity";

export interface IGetQuizQuestionContextInputRepository {
  quizObjectiveId: number;
  quizSubjectsId?: number[];
  seniorityId: number;
  specialtyId: number;
  stacksId: number[];
}

export interface IGetQuizQuestionContextOutputRepository {
  quizObjective: QuizObjective;
  quizSubjects: QuizSubject[];
  seniority: Seniority;
  specialty: Specialty;
  stacks: Stack[];
}

export interface IGetQuizQuestionContextRepository {
  execute(
    data: IGetQuizQuestionContextInputRepository,
  ): Promise<IGetQuizQuestionContextOutputRepository>;
}
