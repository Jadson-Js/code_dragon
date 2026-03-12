import { prisma } from "../../../../../prisma/client";
import { injectable } from "tsyringe";
import { profilePrismaToDomain } from "../mappers";
import type { ICreateProfileWithStacksRepository } from "@/domain/repositories/profile/create-profile-with-stacks.repository";
import type { CreateProfileDTO } from "@/modules/profile/profile.dto";
import type { Profile } from "@/domain/entities/profile.entity";
import { ConflictError, InternalServerError } from "@/shared/app.error";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

@injectable()
export class CreateProfileWithStacksPrismaRepository implements ICreateProfileWithStacksRepository {
  async execute(params: CreateProfileDTO): Promise<Profile> {
    try {
      return await prisma.$transaction(async (tx: any) => {
        const profile = await tx.profile.create({
          data: {
            userId: params.userId,
            ageRangeId: params.ageRangeId,
            seniorityId: params.seniorityId,
            specialtyId: params.specialtyId,
            careerObjectiveId: params.careerObjectiveId,
          },
        });

        if (params.stacksId && params.stacksId.length > 0) {
          await tx.profileStack.createMany({
            data: params.stacksId.map((stackId) => ({
              profileId: profile.id,
              stackId: stackId,
            })),
          });
        }

        return profilePrismaToDomain(profile);
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
