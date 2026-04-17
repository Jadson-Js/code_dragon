import { PrismaClient, Prisma } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { User } from "@/entities/user.entity";
import { Token } from "@/entities/token.entity";
import { Profile } from "@/entities/profile.entity";
import { QuizQuestion } from "@/entities/quiz-question.entity";
import { Seniority } from "@/entities/seniority.entity";
import { Specialty } from "@/entities/specialty.entity";
import { CareerObjective } from "@/entities/career-objective.entity";
import { AgeRange } from "@/entities/age-range.entity";
import { Stack } from "@/entities/stack.entity";
import { QuizObjective } from "@/entities/quiz-objective.entity";
import { QuizSubject } from "@/entities/quiz-subject.entity";
import { Feature } from "@/entities/feature.entity";
import { SessionQuiz } from "@/entities/session-quiz.entity";
import { Session } from "@/entities/session.entity";

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
    quizQuestion: toDomainExtension(
      QuizQuestion,
      Prisma.QuizQuestionScalarFieldEnum,
    ),
    seniority: toDomainExtension(Seniority, Prisma.SeniorityScalarFieldEnum),
    specialty: toDomainExtension(Specialty, Prisma.SpecialtyScalarFieldEnum),
    careerObjective: toDomainExtension(
      CareerObjective,
      Prisma.CareerObjectiveScalarFieldEnum,
    ),
    ageRange: toDomainExtension(AgeRange, Prisma.AgeRangeScalarFieldEnum),
    stack: toDomainExtension(Stack, Prisma.StackScalarFieldEnum),
    quizObjective: toDomainExtension(
      QuizObjective,
      Prisma.QuizObjectiveScalarFieldEnum,
    ),
    quizSubject: toDomainExtension(
      QuizSubject,
      Prisma.QuizSubjectScalarFieldEnum,
    ),
    feature: toDomainExtension(Feature, Prisma.FeatureScalarFieldEnum),
    session: toDomainExtension(Session, Prisma.SessionScalarFieldEnum),
    sessionQuiz: toDomainExtension(
      SessionQuiz,
      Prisma.SessionQuizScalarFieldEnum,
    ),
  },
});
