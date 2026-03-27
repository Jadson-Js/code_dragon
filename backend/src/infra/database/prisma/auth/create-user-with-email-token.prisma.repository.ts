import { User } from "@/domain/entities/user.entity";
import { Token } from "@/domain/entities/token.entity";
import { prisma } from "../../../../../prisma/client";
import { injectable } from "tsyringe";
import { ConflictError, InternalServerError } from "@/shared/app.error";
import type { ICreateUserWithEmailTokenRepository } from "@/domain/database/repositories/auth/auth-transaction.repository";

@injectable()
export class CreateUserWithEmailTokenPrismaRepository implements ICreateUserWithEmailTokenRepository {
  async execute(user: User, token: Token): Promise<User> {
    try {
      return await prisma.$transaction(async (tx) => {
        const createdUser = await tx.user.create({
          data: user,
        });
        await tx.token.create({
          data: token,
        });
        return createdUser.toDomain;
      });
    } catch (error: any) {
      if (
        error &&
        error.code === "P2002"
      ) {
        throw new ConflictError("User already exists.");
      }
      throw new InternalServerError();
    }
  }
}
