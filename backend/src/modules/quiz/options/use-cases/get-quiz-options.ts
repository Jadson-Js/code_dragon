import { inject, injectable } from "tsyringe";
import { QuizOptionsPrismaRepository } from "@/infra/database/prisma/quiz/options/quiz-options.prisma.repository";

@injectable()
export class GetQuizOptionsUseCase {
  constructor(
    private readonly getQuizOptionsRepository: QuizOptionsPrismaRepository,
  ) {}

  async execute() {
    const rawData = await this.getQuizOptionsRepository.execute();

    // Mapping raw domain entities to DTO (only id and name as requested)
    return {
      quizObjectives: rawData.quizObjectives.map((o) => ({
        id: o.id as number,
        name: o.name,
      })),
      quizSubjects: rawData.quizSubjects.map((s) => ({
        id: s.id as number,
        name: s.name,
      })),
      seniorities: rawData.seniorities.map((s) => ({
        id: s.id as number,
        name: s.name,
      })),
      specialties: rawData.specialties.map((s) => ({
        id: s.id as number,
        name: s.name,
        subjects: (s.subjects ?? []).map((sb) => ({
          id: sb.id as number,
          name: sb.name,
        })),
      })),
      stacks: rawData.stacks.map((s) => ({
        id: s.id as number,
        name: s.name,
      })),
    };
  }
}
