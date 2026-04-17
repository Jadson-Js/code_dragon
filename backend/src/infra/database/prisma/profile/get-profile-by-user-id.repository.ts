import { prisma } from "../../../../../prisma/client";
import { injectable } from "tsyringe";

export interface IProfileByUserId {
  id: string;
  userId: string;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  ageRangeId: number | null;
  seniorityId: number | null;
  specialtyId: number | null;
  careerObjectiveId: number | null;
  stackIds: number[];
}

export interface IGetProfileByUserIdRepository {
  execute(userId: string): Promise<IProfileByUserId | null>;
}

@injectable()
export class GetProfileByUserIdPrismaRepository implements IGetProfileByUserIdRepository {
  async execute(userId: string): Promise<IProfileByUserId | null> {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        linkedinUrl: true,
        githubUrl: true,
        portfolioUrl: true,
        ageRangeId: true,
        seniorityId: true,
        specialtyId: true,
        careerObjectiveId: true,
        stacks: {
          select: {
            stackId: true,
          },
        },
      },
    });

    if (!profile) {
      return null;
    }

    const { stacks, ...profileData } = profile;

    return {
      ...profileData,
      stackIds: stacks.map((s: { stackId: number }) => s.stackId),
    };
  }
}
