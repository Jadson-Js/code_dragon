import { Token } from "@/domain/entities/token.entity";
import type { ITokenRepository } from "@/domain/database/repositories/token.repository";
import { prisma } from "../../../../prisma/client";
import { injectable } from "tsyringe";
import { tokenPrismaToDomain } from "./mappers";
import { InternalServerError } from "@/shared/app.error";

@injectable()
export class TokenPrismaRepository implements ITokenRepository {
  async create(data: Token): Promise<Token> {
    const response = await prisma.token.create({
      data: data,
    });

    return tokenPrismaToDomain(response);
  }

  async update(data: Token): Promise<Token> {
    const response = await prisma.token.update({
      where: {
        id: data.id,
      },
      data: data,
    });

    return tokenPrismaToDomain(response);
  }

  async delete(id: string): Promise<void> {
    await prisma.token.delete({
      where: {
        id,
      },
    });
  }

  async findById(id: string): Promise<Token | null> {
    const response = await prisma.token.findUnique({
      where: {
        id,
      },
    });

    return response ? tokenPrismaToDomain(response) : null;
  }

  async findByUserId(userId: string): Promise<Token[]> {
    const response = await prisma.token.findMany({
      where: {
        userId,
      },
    });

    return response.map(tokenPrismaToDomain);
  }

  async findAll(): Promise<Token[]> {
    const response = await prisma.token.findMany();

    return response.map(tokenPrismaToDomain);
  }

  async deleteByUserIdAndCreateNewToken(
    userId: string,
    token: Token,
  ): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await prisma.$transaction(async (tx: any) => {
        await tx.token.deleteMany({
          where: {
            userId,
          },
        });
        await tx.token.create({
          data: token,
        });
      });
    } catch (_error) {
      throw new InternalServerError();
    }
  }
}
