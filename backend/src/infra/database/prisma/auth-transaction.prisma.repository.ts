import { User } from "@/domain/entities/user.entity";
import { Token } from "@/domain/entities/token.entity";
import { prisma } from "../../../../prisma/client";
import { injectable } from "tsyringe";
import { ConflictError } from "@/shared/app.error";
import type { IAuthTransactionRepository } from "@/domain/repositories/auth-transaction.repository";
import { userPrismaToDomain } from "./mappers";

@injectable()
export class AuthTransactionPrismaRepository implements IAuthTransactionRepository {
  async createUserWithEmailToken(user: User, token: Token): Promise<User> {
    try {
      return await prisma.$transaction(async (tx) => {
        const createdUser = await tx.user.create({
          data: user,
        });
        await tx.token.create({
          data: token,
        });
        return userPrismaToDomain(createdUser);
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictError("Email already in use");
      }
      throw error;
    }
  }
}
