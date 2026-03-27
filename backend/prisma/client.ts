import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { User } from "@/domain/entities/user.entity";
import { Token } from "@/domain/entities/token.entity";
import { Profile } from "@/domain/entities/profile.entity";
import { QuizQuestion } from "@/domain/entities/quiz-question.entity";
import { Seniority } from "@/domain/entities/seniority.entity";
import { Specialty } from "@/domain/entities/specialty.entity";
import { CareerObjective } from "@/domain/entities/career-objective.entity";
import { AgeRange } from "@/domain/entities/age-range.entity";
import { Stack } from "@/domain/entities/stack.entity";
import { QuizObjective } from "@/domain/entities/quiz-objective.entity";
import { QuizSubject } from "@/domain/entities/quiz-subject.entity";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prismaClient = new PrismaClient({ adapter });

export const prisma = prismaClient.$extends({
  result: {
    user: {
      toDomain: {
        needs: { id: true, name: true, email: true, passwordHash: true, verifiedAt: true, createdAt: true, updatedAt: true, deletedAt: true },
        compute(user) { return User.create(user as any); },
      },
    },
    token: {
      toDomain: {
        needs: { id: true, userId: true, tokenHash: true, type: true, expiresAt: true, createdAt: true, updatedAt: true },
        compute(token) { return Token.create(token as any); },
      },
    },
    profile: {
      toDomain: {
        needs: { id: true, userId: true, linkedinUrl: true, githubUrl: true, portfolioUrl: true, ageRangeId: true, seniorityId: true, specialtyId: true, careerObjectiveId: true, createdAt: true, updatedAt: true },
        compute(profile) { return Profile.create(profile as any); },
      },
    },
    quizQuestion: {
      toDomain: {
        needs: { id: true, quizObjectiveId: true, seniorityId: true, specialtyId: true, statement: true, alternatives: true, correctAlternativeIndex: true, code: true, reports: true, createdAt: true, updatedAt: true },
        compute(quizQuestion) { return QuizQuestion.create(quizQuestion as any); },
      },
    },
    seniority: {
      toDomain: {
        needs: { id: true, name: true, description: true, slug: true, order: true, createdAt: true, updatedAt: true },
        compute(seniority) { return Seniority.create(seniority as any); },
      },
    },
    specialty: {
      toDomain: {
        needs: { id: true, name: true, description: true, slug: true, order: true, createdAt: true, updatedAt: true },
        compute(specialty) { return Specialty.create(specialty as any); },
      },
    },
    careerObjective: {
      toDomain: {
        needs: { id: true, name: true, description: true, slug: true, order: true, createdAt: true, updatedAt: true },
        compute(careerObjective) { return CareerObjective.create(careerObjective as any); },
      },
    },
    ageRange: {
      toDomain: {
        needs: { id: true, name: true, startAge: true, endAge: true, slug: true, order: true, createdAt: true, updatedAt: true },
        compute(ageRange) { return AgeRange.create(ageRange as any); },
      },
    },
    stack: {
      toDomain: {
        needs: { id: true, name: true, slug: true, usageCount: true, createdAt: true, updatedAt: true },
        compute(stack) { return Stack.create(stack as any); },
      },
    },
    quizObjective: {
      toDomain: {
        needs: { id: true, name: true, description: true, slug: true, createdAt: true, updatedAt: true },
        compute(quizObjective) { return QuizObjective.create(quizObjective as any); },
      },
    },
    quizSubject: {
      toDomain: {
        needs: { id: true, name: true, description: true, slug: true, createdAt: true, updatedAt: true },
        compute(quizSubject) { return QuizSubject.create(quizSubject as any); },
      },
    },
  },
});
