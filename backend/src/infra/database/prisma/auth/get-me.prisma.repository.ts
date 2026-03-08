import { User } from "@/domain/entities/user.entity";
import { prisma } from "../../../../../prisma/client";
import { injectable } from "tsyringe";
import type { IGetMeRepository } from "@/domain/repositories/auth/get-me.repository";
import { profilePrismaToDomain, userPrismaToDomain } from "../mappers";
import type { Profile } from "@/domain/entities/profile.entity";

@injectable()
export class GetMePrismaRepository implements IGetMeRepository {
  async execute(userId: string): Promise<{
    user: User;
    profile: Profile | null;
  } | null> {
    return await prisma.$transaction(async (tx: any) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      const profile = await tx.profile.findUnique({
        where: { userId },
      });

      return {
        user: userPrismaToDomain(user),
        profile: profile ? profilePrismaToDomain(profile) : null,
      };
    });
  }
}
