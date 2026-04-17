import type { User } from "@/entities/user.entity";
import { prisma } from "../../../../../prisma/client";
import { injectable } from "tsyringe";
import { InternalServerError } from "@/shared/app.error";

export interface IResetPasswordRepository {
  execute(user: User, tokenId: string): Promise<void>;
}

@injectable()
export class ResetPasswordPrismaRepository implements IResetPasswordRepository {
  async execute(user: User, tokenId: string): Promise<void> {
    try {
      await prisma.$transaction(async (tx) => {
        // 1. Update the user password
        await tx.user.update({
          where: { id: user.id },
          data: {
            passwordHash: user.passwordHash,
            updatedAt: user.updatedAt,
          },
        });

        // 2. Delete the used token
        await tx.token.delete({
          where: { id: tokenId },
        });
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerError("Failed to reset password in database");
    }
  }
}
