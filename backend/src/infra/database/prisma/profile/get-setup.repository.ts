import { prisma } from "../../../../../prisma/client";
import { injectable } from "tsyringe";
import type { IGetSetupDTO } from "@/modules/profile/profile.dto";
import type { IGetSetupRepository } from "@/domain/repositories/profile/get-setup.repository";

@injectable()
export class GetSetupPrismaRepository implements IGetSetupRepository {
  async execute(): Promise<IGetSetupDTO> {
    const [seniority, specialties, careerObjectives, ageRanges, stacks] =
      await prisma.$transaction([
        prisma.seniority.findMany({ orderBy: { order: "asc" } }),
        prisma.specialty.findMany({ orderBy: { order: "asc" } }),
        prisma.careerObjective.findMany({ orderBy: { order: "asc" } }),
        prisma.ageRange.findMany({ orderBy: { order: "asc" } }),
        prisma.stack.findMany({ orderBy: { name: "asc" } }),
      ]);

    return {
      seniority: seniority.map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description || "",
      })),
      specialties: specialties.map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description || "",
      })),
      careerObjectives: careerObjectives.map((o: any) => ({
        id: o.id,
        name: o.name,
        description: o.description || "",
      })),
      ageRanges: ageRanges.map((a: any) => ({ id: a.id, name: a.name })),
      stacks: stacks.map((s: any) => ({ id: s.id, name: s.name })),
    };
  }
}
