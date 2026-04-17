import { prisma } from "../../../../../prisma/client";
import { injectable } from "tsyringe";
import type { Profile } from "@/entities/profile.entity";
import { NotFoundError } from "@/shared/app.error";

export interface IUpdateProfileWithStacksRepository {
  execute(params: { profile: Profile; stacksId: number[] }): Promise<Profile>;
}

@injectable()
export class UpdateProfileWithStacksPrismaRepository implements IUpdateProfileWithStacksRepository {
  async execute(params: {
    profile: Profile;
    stacksId: number[];
  }): Promise<Profile> {
    return await prisma.$transaction(async (tx) => {
      const { profile: profileEntity, stacksId } = params;

      try {
        const profile = await tx.profile.update({
          data: {
            seniorityId: profileEntity.seniorityId,
            specialtyId: profileEntity.specialtyId,
          },
          where: { userId: profileEntity.userId },
        });

        await tx.profileStack.deleteMany({
          where: { profileId: profile.id },
        });

        await tx.profileStack.createMany({
          data: stacksId.map((stackId) => ({
            profileId: profile.id,
            stackId: stackId,
          })),
        });

        // Increment usage count for new stacks
        await tx.stack.updateMany({
          where: {
            id: {
              in: stacksId,
            },
          },
          data: {
            usageCount: {
              increment: 1, // Changed to increment since we're adding them (previous turn had decrement which seemed wrong for registration)
            },
          },
        });

        return profile.toDomain;
      } catch (error) {
        if ((error as { code?: string }).code === "P2025") {
          throw new NotFoundError("Profile not found");
        }
        throw error;
      }
    });
  }
}
