import type { QuizObjective } from "../../../../../entities/quiz-objective.entity";
import type { QuizSubject } from "../../../../../entities/quiz-subject.entity";
import type { Seniority } from "../../../../../entities/seniority.entity";
import type { Specialty } from "../../../../../entities/specialty.entity";
import type { Stack } from "../../../../../entities/stack.entity";

export interface IGetQuizOptionsRepositoryOutput {
  quizObjectives: QuizObjective[];
  quizSubjects: QuizSubject[];
  seniorities: Seniority[];
  specialties: (Specialty & { subjects: QuizSubject[] })[];
  stacks: Stack[];
}

export interface IGetQuizOptionsRepository {
  execute(): Promise<IGetQuizOptionsRepositoryOutput>;
}
