import { prisma } from "../../../../../prisma/client";
import { injectable } from "tsyringe";
import type {
  IOnboardingOptions,
  IGetOnboardingOptionsRepository,
} from "@/domain/repositories/profile/get-onboarding-options.repository";
import { Seniority } from "@/domain/entities/seniority.entity";
import { Specialty } from "@/domain/entities/specialty.entity";
import { CareerObjective } from "@/domain/entities/career-objective.entity";
import { AgeRange } from "@/domain/entities/age-range.entity";
import { Stack } from "@/domain/entities/stack.entity";

@injectable()
export class GetOnboardingOptionsPrismaRepository implements IGetOnboardingOptionsRepository {
  async execute(): Promise<IOnboardingOptions> {
    const [seniorities, specialties, careerObjectives, ageRanges, stacks] =
      await prisma.$transaction([
        prisma.seniority.findMany({ orderBy: { order: "asc" } }),
        prisma.specialty.findMany({ orderBy: { order: "asc" } }),
        prisma.careerObjective.findMany({ orderBy: { order: "asc" } }),
        prisma.ageRange.findMany({ orderBy: { order: "asc" } }),
        prisma.stack.findMany({ orderBy: { name: "asc" } }),
      ]);

    return {
      seniorities: seniorities.map((s) => Seniority.create({ ...s })),
      specialties: specialties.map((s) => Specialty.create({ ...s })),
      careerObjectives: careerObjectives.map((o) =>
        CareerObjective.create({ ...o }),
      ),
      ageRanges: ageRanges.map((a) => AgeRange.create({ ...a })),
      stacks: stacks.map((s) => Stack.create({ ...s })),
    };
  }
}
