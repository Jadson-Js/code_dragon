import { prisma } from "../../../../../prisma/client";
import { injectable } from "tsyringe";
import type { IGetOnboardingOptionsOutputDTO } from "@/modules/profile/profile.dto";
import type { IGetOnboardingOptionsRepository } from "@/domain/repositories/profile/get-onboarding-options.repository";

@injectable()
export class GetOnboardingOptionsPrismaRepository implements IGetOnboardingOptionsRepository {
  async execute(): Promise<IGetOnboardingOptionsOutputDTO> {
    const [seniorities, specialties, careerObjectives, ageRanges, stacks] =
      await prisma.$transaction([
        prisma.seniority.findMany({ orderBy: { order: "asc" } }),
        prisma.specialty.findMany({ orderBy: { order: "asc" } }),
        prisma.careerObjective.findMany({ orderBy: { order: "asc" } }),
        prisma.ageRange.findMany({ orderBy: { order: "asc" } }),
        prisma.stack.findMany({ orderBy: { name: "asc" } }),
      ]);

    return {
      seniorities: seniorities.map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description,
      })),
      specialties: specialties.map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description,
      })),
      careerObjectives: careerObjectives.map((o: any) => ({
        id: o.id,
        name: o.name,
        description: o.description,
      })),
      ageRanges: ageRanges.map((a: any) => ({ id: a.id, name: a.name })),
      stacks: stacks.map((s: any) => ({ id: s.id, name: s.name })),
    };
  }
}
