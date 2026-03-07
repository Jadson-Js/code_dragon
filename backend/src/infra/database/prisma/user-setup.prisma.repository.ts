import { UserSetup } from "@/domain/entities/user-setup.entity";
import type { IUserSetupRepository } from "@/domain/repositories/user-setup.repository";
import { prisma } from "../../../../prisma/client";
import { injectable } from "tsyringe";

function userSetupPrismaToDomain(raw: any): UserSetup {
  return UserSetup.create({
    id: raw.id,
    userId: raw.userId,
    seniorityId: raw.seniorityId,
    specialtyId: raw.specialtyId,
    careerObjectiveId: raw.careerObjectiveId,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  });
}

@injectable()
export class UserSetupPrismaRepository implements IUserSetupRepository {
  async delete(id: string): Promise<void> {
    await prisma.userSetup.delete({
      where: {
        id,
      },
    });
  }

  async findById(id: string): Promise<UserSetup | null> {
    const response = await prisma.userSetup.findUnique({
      where: {
        id,
      },
    });

    return response ? userSetupPrismaToDomain(response) : null;
  }

  async findAll(): Promise<UserSetup[]> {
    const response = await prisma.userSetup.findMany();

    return response.map(userSetupPrismaToDomain);
  }
}
