import { prisma } from "../../../../../prisma/client";
import { injectable } from "tsyringe";
import type {
  IGetProfileByUserIdRepository,
  IProfileByUserId,
} from "@/domain/database/repositories/profile/get-profile-by-user-id.repository";

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
