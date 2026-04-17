import { prisma } from "../../../../../../prisma/client";
import { injectable } from "tsyringe";
import type { QuizObjective } from "@/entities/quiz-objective.entity";
import type { QuizSubject } from "@/entities/quiz-subject.entity";
import type { Seniority } from "@/entities/seniority.entity";
import type { Specialty } from "@/entities/specialty.entity";
import type { Stack } from "@/entities/stack.entity";

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

@injectable()
export class QuizOptionsPrismaRepository implements IGetQuizOptionsRepository {
  async execute(): Promise<IGetQuizOptionsRepositoryOutput> {
    const [quizObjectives, quizSubjects, seniorities, specialties, stacks] =
      await prisma.$transaction([
        prisma.quizObjective.findMany({ orderBy: { name: "asc" } }),
        prisma.quizSubject.findMany({ orderBy: { name: "asc" } }),
        prisma.seniority.findMany({ orderBy: { order: "asc" } }),
        prisma.specialty.findMany({
          orderBy: { order: "asc" },
          include: {
            quizSubjects: {
              include: { quizSubject: true },
              orderBy: { quizSubject: { name: "asc" } },
            },
          },
        }),
        prisma.stack.findMany({ orderBy: { name: "asc" } }),
      ]);

    return {
      quizObjectives: quizObjectives.map((o) => o.toDomain),
      quizSubjects: quizSubjects.map((s) => s.toDomain),
      seniorities: seniorities.map((s) => s.toDomain),
      specialties: specialties.map((s) =>
        Object.assign(s.toDomain, {
          subjects: (s.quizSubjects ?? []).map(
            (qs: any) => qs.quizSubject.toDomain,
          ),
        }),
      ),
      stacks: stacks.map((s) => s.toDomain),
    };
  }
}
