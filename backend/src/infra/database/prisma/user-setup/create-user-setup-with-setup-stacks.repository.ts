import { prisma } from "../../../../../prisma/client";
import { injectable } from "tsyringe";
import { userSetupPrismaToDomain } from "../mappers";
import type { ICreateUserSetupWithSetupStacksRepository } from "@/domain/repositories/user-setup/create-user-setup-with-setup-stacks.repository";
import type { CreateUserSetupDTO } from "@/modules/user-setup/user-setup.dto";
import type { UserSetup } from "@/domain/entities/user-setup.entity";
import { ConflictError, InternalServerError } from "@/shared/app.error";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

@injectable()
export class CreateUserSetupWithSetupStacksPrismaRepository implements ICreateUserSetupWithSetupStacksRepository {
  async execute(params: CreateUserSetupDTO): Promise<UserSetup> {
    try {
      return await prisma.$transaction(async (tx) => {
        const userSetup = await tx.userSetup.create({
          data: {
            userId: params.userId,
            seniorityId: params.seniorityId,
            specialtyId: params.specialtyId,
            careerObjectiveId: params.careerObjectiveId,
          },
        });

        await tx.userSetupStack.createMany({
          data: params.stacksId.map((stackId) => ({
            userSetupId: userSetup.id,
            stackId: stackId,
          })),
        });

        return userSetupPrismaToDomain(userSetup);
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictError("User Setup already exists");
        }
      }
      throw new InternalServerError("Error creating user");
    }
  }
}
