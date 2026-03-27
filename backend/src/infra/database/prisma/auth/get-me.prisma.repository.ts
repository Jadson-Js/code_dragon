import { User } from "@/domain/entities/user.entity";
import { prisma } from "../../../../../prisma/client";
import { injectable } from "tsyringe";
import type { IGetMeRepository } from "@/domain/database/repositories/auth/get-me.repository";
import type { Profile } from "@/domain/entities/profile.entity";

@injectable()
export class GetMePrismaRepository implements IGetMeRepository {
  async execute(userId: string): Promise<{
    user: User;
    profile: Profile | null;
  } | null> {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) return null;

      const profile = await tx.profile.findUnique({
        where: { userId },
      });

      return {
        user: user.toDomain,
        profile: profile ? profile.toDomain : null,
      };
    });

    return result;
  }
}
