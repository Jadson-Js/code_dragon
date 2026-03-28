import { prisma } from "../../../../../../prisma/client";
import type {
  IGetQuizOptionsRepository,
  IGetQuizOptionsRepositoryOutput,
} from "@/domain/database/repositories/quiz/options/get-quiz-options.repository";
import { injectable } from "tsyringe";

@injectable()
export class QuizOptionsPrismaRepository implements IGetQuizOptionsRepository {
  async execute(): Promise<IGetQuizOptionsRepositoryOutput> {
    const [quizObjectives, quizSubjects, seniorities, specialties, stacks] =
      await prisma.$transaction([
        prisma.quizObjective.findMany({ orderBy: { name: "asc" } }),
        prisma.quizSubject.findMany({
          orderBy: { name: "asc" },
          include: {
            specialties: {
              include: { specialty: true },
              orderBy: { specialty: { order: "asc" } },
            },
          },
        }),
        prisma.seniority.findMany({ orderBy: { order: "asc" } }),
        prisma.specialty.findMany({ orderBy: { order: "asc" } }),
        prisma.stack.findMany({ orderBy: { name: "asc" } }),
      ]);

    return {
      quizObjectives: quizObjectives.map((o) => o.toDomain),
      quizSubjects: quizSubjects.map((s) =>
        Object.assign(s.toDomain, {
          specialties: (s.specialties ?? []).map(
            (sp: any) => sp.specialty.toDomain,
          ),
        }),
      ),
      seniorities: seniorities.map((s) => s.toDomain),
      specialties: specialties.map((s) => s.toDomain),
      stacks: stacks.map((s) => s.toDomain),
    };
  }
}
