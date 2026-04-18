import { prisma } from "../../../../../prisma/client";
import { injectable } from "tsyringe";
import type {
  Seniority,
  Specialty,
  CareerObjective,
  AgeRange,
  Stack,
} from "generated/prisma/client";

export interface IOnboardingOptions {
  seniorities: Seniority[];
  specialties: Specialty[];
  careerObjectives: CareerObjective[];
  ageRanges: AgeRange[];
  stacks: Stack[];
}

@injectable()
export class GetOnboardingOptionsPrismaRepository {
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
      seniorities,
      specialties,
      careerObjectives,
      ageRanges,
      stacks,
    };
  }
}
