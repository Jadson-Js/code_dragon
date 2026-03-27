import type { IQuizQuestionGenerateInputDTO } from "@/modules/quiz/questions/questions.dto";
import type { QuizObjective } from "@/domain/entities/quiz-objective.entity";
import type { QuizSubject } from "@/domain/entities/quiz-subject.entity";
import type { Seniority } from "@/domain/entities/seniority.entity";
import type { Specialty } from "@/domain/entities/specialty.entity";
import type { Stack } from "@/domain/entities/stack.entity";

export interface IGetQuizQuestionContextOutputRepository {
  quizObjective: QuizObjective;
  quizSubject: QuizSubject[];
  seniority: Seniority;
  specialty: Specialty;
  stacks: Stack[];
}

export interface IGetQuizQuestionContextRepository {
  execute(
    data: IQuizQuestionGenerateInputDTO,
  ): Promise<IGetQuizQuestionContextOutputRepository>;
}
