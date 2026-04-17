import { prisma } from "../../../../../prisma/client";
import { injectable } from "tsyringe";
import type { Seniority } from "@/entities/seniority.entity";
import type { Specialty } from "@/entities/specialty.entity";
import type { CareerObjective } from "@/entities/career-objective.entity";
import type { AgeRange } from "@/entities/age-range.entity";
import type { Stack } from "@/entities/stack.entity";

export interface IOnboardingOptions {
  seniorities: Seniority[];
  specialties: Specialty[];
  careerObjectives: CareerObjective[];
  ageRanges: AgeRange[];
  stacks: Stack[];
}

export interface IGetOnboardingOptionsRepository {
  execute(): Promise<IOnboardingOptions>;
}

@injectable()
export class GetOnboardingOptionsPrismaRepository implements IGetOnboardingOptionsRepository {
  async execute(): Promise<IOnboardingOptions> {
    const [seniorities, specialties, careerObjectives, ageRanges, stacks] =
      await prisma.$transaction([
        prisma.seniority.findMany({ orderBy: { order: "asc" } }),
        prisma.specialty.findMany({ orderBy: { order: "asc" } }),
        prisma.careerObjective.findMany({ orderBy: { order: "asc" } }),
        prisma.ageRange.findMany({ orderBy: { order: "asc" } }),
        prisma.stack.findMany({ orderBy: { usageCount: "desc" } }),
      ]);

    return {
      seniorities: seniorities.map((s) => s.toDomain),
      specialties: specialties.map((s) => s.toDomain),
      careerObjectives: careerObjectives.map((o) => o.toDomain),
      ageRanges: ageRanges.map((a) => a.toDomain),
      stacks: stacks.map((s) => s.toDomain),
    };
  }
}
