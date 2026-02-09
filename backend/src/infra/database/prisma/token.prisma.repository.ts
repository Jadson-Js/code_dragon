import { Token } from "@/domain/entities/token.entity";
import type { ITokenRepository } from "@/domain/repositories/token.repository";
import { prisma } from "../../../../prisma/client";
import { injectable } from "tsyringe";
import { tokenPrismaToDomain } from "./mappers";

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
}
