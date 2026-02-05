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

@injectable()
export class UserPrismaRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const response = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        birthDate: user.birthDate,
        verifiedAt: user.verifiedAt,
        imageId: user.imageId,
        linkedinUrl: user.linkedinUrl,
        githubUrl: user.githubUrl,
        portfolioUrl: user.portfolioUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      },
    });

    return userPrismaToDomain(response);
  }

  async update(user: User): Promise<User> {
    const response = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        birthDate: user.birthDate,
        verifiedAt: user.verifiedAt,
        imageId: user.imageId,
        linkedinUrl: user.linkedinUrl,
        githubUrl: user.githubUrl,
        portfolioUrl: user.portfolioUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      },
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

  async findByEmail(email: string): Promise<User | null> {
    const response = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return response ? userPrismaToDomain(response) : null;
  }

  async findAll(): Promise<User[]> {
    const response = await prisma.user.findMany();

    return response.map(userPrismaToDomain);
  }
}
