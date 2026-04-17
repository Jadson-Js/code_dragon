import { User } from "@/entities/user.entity";
import { prisma } from "../../../../../prisma/client";
import { injectable } from "tsyringe";
import type { Profile } from "@/entities/profile.entity";



@injectable()
export class GetMePrismaRepository {
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
