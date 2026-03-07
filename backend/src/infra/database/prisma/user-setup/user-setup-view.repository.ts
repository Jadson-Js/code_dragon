import type { UserSetupView } from "@/domain/entities/user-setup-view";
import type { IUserSetupViewRepository } from "@/domain/repositories/user-setup/user-setup-view.repository";
import { injectable } from "tsyringe";
import { userSetupViewPrismaToDomain } from "../mappers";
import { prisma } from "prisma/client";

@injectable()
export class UserSetupViewPrismaRepository implements IUserSetupViewRepository {
  async findByUserId(userId: string): Promise<UserSetupView | null> {
    const response = await prisma.userSetupView.findUnique({
      where: {
        userId,
      },
    });

    if (!response) return null;

    return userSetupViewPrismaToDomain(response);
  }
}
