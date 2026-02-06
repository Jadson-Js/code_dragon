import { User } from "@/domain/entities/user.entity";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import { prisma } from "../../../../prisma/client";
import { injectable } from "tsyringe";

function userPrismaToDomain(raw: any): User {
  return User.create({
    id: raw.id,
    name: raw.name,
    email: raw.email,
    passwordHash: raw.passwordHash,
    birthDate: raw.birthDate,
    verifiedAt: raw.verifiedAt,
    imageId: raw.imageId,
    linkedinUrl: raw.linkedinUrl,
    githubUrl: raw.githubUrl,
    portfolioUrl: raw.portfolioUrl,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    deletedAt: raw.deletedAt,
  });
}

function userDomainToPrisma(domain: User): any {
  return {
    id: domain.id,
    name: domain.name,
    email: domain.email,
    passwordHash: domain.passwordHash,
    birthDate: domain.birthDate,
    verifiedAt: domain.verifiedAt,
    imageId: domain.imageId,
    linkedinUrl: domain.linkedinUrl,
    githubUrl: domain.githubUrl,
    portfolioUrl: domain.portfolioUrl,
    createdAt: domain.createdAt,
    updatedAt: domain.updatedAt,
    deletedAt: domain.deletedAt,
  };
}

@injectable()
export class UserPrismaRepository implements IUserRepository {
  async create(data: User): Promise<User> {
    const raw = userDomainToPrisma(data);
    const response = await prisma.user.create({
      data: raw,
    });

    return userPrismaToDomain(response);
  }

  async update(data: User): Promise<User> {
    const raw = userDomainToPrisma(data);
    const response = await prisma.user.update({
      where: {
        id: raw.id,
      },
      data: raw,
    });

    return userPrismaToDomain(response);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    const response = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return response ? userPrismaToDomain(response) : null;
  }

  async findAll(): Promise<User[]> {
    const response = await prisma.user.findMany();

    return response.map(userPrismaToDomain);
  }
}
