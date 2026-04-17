import { Token } from "@/entities/token.entity";
import { prisma } from "../../../../prisma/client";
import { injectable } from "tsyringe";
import { InternalServerError } from "@/shared/app.error";

export interface ITokenRepository {
  create(data: Token): Promise<Token>;
  update(data: Token): Promise<Token>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Token | null>;
  findByUserId(userId: string): Promise<Token[]>;
  findAll(): Promise<Token[]>;
  deleteByUserIdAndCreateNewToken(userId: string, token: Token): Promise<void>;
}

@injectable()
export class TokenPrismaRepository implements ITokenRepository {
  async create(data: Token): Promise<Token> {
    const response = await prisma.token.create({
      data: data,
    });

    return response.toDomain;
  }

  async update(data: Token): Promise<Token> {
    const response = await prisma.token.update({
      where: {
        id: data.id,
      },
      data: data,
    });

    return response.toDomain;
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

    return response ? response.toDomain : null;
  }

  async findByUserId(userId: string): Promise<Token[]> {
    const response = await prisma.token.findMany({
      where: {
        userId,
      },
    });

    return response.map((token) => token.toDomain);
  }

  async findAll(): Promise<Token[]> {
    const response = await prisma.token.findMany();

    return response.map((token) => token.toDomain);
  }

  async deleteByUserIdAndCreateNewToken(
    userId: string,
    token: Token,
  ): Promise<void> {
    try {
      return await prisma.$transaction(async (tx) => {
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
