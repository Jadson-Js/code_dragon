import { PrismaClient, Prisma } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { User } from "@/entities/user.entity";
import { Token } from "@/entities/token.entity";
import { Profile } from "@/entities/profile.entity";
import { SessionQuiz } from "@/entities/session-quiz.entity";


const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prismaClient = new PrismaClient({ adapter });

/**
 * Helper to create a toDomain() extension for a Prisma model.
 * It automatically maps all scalar fields to the needs object.
 */
const toDomainExtension = <T>(
  Entity: { create: (data: any) => T },
  scalarEnum: Record<string, string>,
) => {
  return {
    toDomain: {
      needs: Object.fromEntries(
        Object.keys(scalarEnum).map((key) => [key, true]),
      ) as any,
      compute(data: any) {
        return Entity.create(data as Parameters<typeof Entity.create>[0]);
      },
    },
  };
};

export const prisma = prismaClient.$extends({
  result: {
    user: toDomainExtension(User, Prisma.UserScalarFieldEnum),
    token: toDomainExtension(Token, Prisma.TokenScalarFieldEnum),
    profile: toDomainExtension(Profile, Prisma.ProfileScalarFieldEnum),

    sessionQuiz: toDomainExtension(
      SessionQuiz,
      Prisma.SessionQuizScalarFieldEnum,
    ),
  },
});
