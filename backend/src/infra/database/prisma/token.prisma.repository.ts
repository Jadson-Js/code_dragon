import { Token } from "@/domain/entities/token.entity";
import type { ITokenRepository } from "@/domain/repositories/token.repository";
import { prisma } from "../../../../prisma/client";
import { injectable } from "tsyringe";

function tokenPrismaToDomain(raw: any): Token {
  return Token.create({
    id: raw.id,
    userId: raw.userId,
    tokenHash: raw.tokenHash,
    type: raw.type,
    usedAt: raw.usedAt,
    expiresAt: raw.expiresAt,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  });
}

function tokenDomainToPrisma(domain: Token): any {
  return {
    id: domain.id,
    userId: domain.userId,
    tokenHash: domain.tokenHash,
    type: domain.type,
    usedAt: domain.usedAt,
    expiresAt: domain.expiresAt,
    createdAt: domain.createdAt,
    updatedAt: domain.updatedAt,
  };
}

@injectable()
export class TokenPrismaRepository implements ITokenRepository {
  async create(data: Token): Promise<Token> {
    const raw = tokenDomainToPrisma(data);
    const response = await prisma.token.create({
      data: raw,
    });

    return tokenPrismaToDomain(response);
  }

  async update(data: Token): Promise<Token> {
    const raw = tokenDomainToPrisma(data);
    const response = await prisma.token.update({
      where: {
        id: raw.id,
      },
      data: raw,
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

  async findAll(): Promise<Token[]> {
    const response = await prisma.token.findMany();

    return response.map(tokenPrismaToDomain);
  }
}
