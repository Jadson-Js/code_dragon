import { prisma } from "../../../../../prisma/client";
import { injectable } from "tsyringe";
import type { ICreateProfileWithStacksRepository } from "@/domain/database/repositories/profile/create-profile-with-stacks.repository";
import type { ICreateProfileInputDTO } from "@/modules/profile/profile.dto";
import type { Profile } from "@/domain/entities/profile.entity";
import { ConflictError, InternalServerError } from "@/shared/app.error";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

@injectable()
export class CreateProfileWithStacksPrismaRepository implements ICreateProfileWithStacksRepository {
  async execute(params: ICreateProfileInputDTO): Promise<Profile> {
    try {
      return await prisma.$transaction(async (tx: any) => {
        const { stacksId, ...profileData } = params;
        const profile = await tx.profile.create({
          data: profileData,
        });

        await tx.profileStack.createMany({
          data: params.stacksId.map((stackId) => ({
            profileId: profile.id,
            stackId: stackId,
          })),
        });

        await tx.stack.updateMany({
          where: {
            id: {
              in: params.stacksId,
            },
          },
          data: {
            usageCount: {
              increment: 1,
            },
          },
        });

        return profile;
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictError("Profile already exists for this user");
        }
      }
      throw new InternalServerError("Error creating profile");
    }
  }
}
