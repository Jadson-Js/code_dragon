import { User } from "@/domain/entities/user.entity";
import type { IUserRepository } from "@/domain/database/repositories/user.repository";
import { prisma } from "../../../../prisma/client";
import { injectable } from "tsyringe";
import { ConflictError } from "@/shared/app.error";
import { userPrismaToDomain } from "./mappers";

@injectable()
export class UserPrismaRepository implements IUserRepository {
  async create(data: User): Promise<User> {
    try {
      const response = await prisma.user.create({
        data: data,
      });

      return userPrismaToDomain(response);
    } catch (error) {
      if ((error as { code?: string }).code === "P2002") {
        throw new ConflictError("Email already in use");
      }
      throw error;
    }
  }

  async update(data: User): Promise<User> {
    const response = await prisma.user.update({
      where: {
        id: data.id,
      },
      data: data,
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

  async findByEmail(email: string): Promise<User | null> {
    const response = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return response ? userPrismaToDomain(response) : null;
  }
}
