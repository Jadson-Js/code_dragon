import { inject, injectable } from "tsyringe";
import type { IGetQuizOptionsRepository } from "@/domain/database/repositories/quiz/options/get-quiz-options.repository";
import type { IGetQuizOptionsOutputDTO } from "../quiz-options.dto";

@injectable()
export class GetQuizOptionsUseCase {
  constructor(
    @inject("IGetQuizOptionsRepository")
    private readonly getQuizOptionsRepository: IGetQuizOptionsRepository,
  ) {}

  async execute(): Promise<IGetQuizOptionsOutputDTO> {
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
      })),
      stacks: rawData.stacks.map((s) => ({
        id: s.id as number,
        name: s.name,
      })),
    };
  }
}
