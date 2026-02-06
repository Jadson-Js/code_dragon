import { Post } from "@/domain/entities/post.entity";
import type { IPostRepository } from "@/domain/repositories/post.repository";
import { prisma } from "../../../../prisma/client";
import { injectable } from "tsyringe";

function postPrismaToDomain(raw: any): Post {
  return Post.create({
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

function postDomainToPrisma(domain: Post): any {
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
export class PostPrismaRepository implements IPostRepository {
  async create(data: Post): Promise<Post> {
    const raw = postDomainToPrisma(data);
    const response = await prisma.post.create({
      data: raw,
    });

    return postPrismaToDomain(response);
  }

  async update(data: Post): Promise<Post> {
    const raw = postDomainToPrisma(data);
    const response = await prisma.post.update({
      where: {
        id: raw.id,
      },
      data: raw,
    });

    return postPrismaToDomain(response);
  }

  async delete(id: string): Promise<void> {
    await prisma.post.delete({
      where: {
        id,
      },
    });
  }

  async findById(id: string): Promise<Post | null> {
    const response = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    return response ? postPrismaToDomain(response) : null;
  }

  async findAll(): Promise<Post[]> {
    const response = await prisma.post.findMany();

    return response.map(postPrismaToDomain);
  }
}
