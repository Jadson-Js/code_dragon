import { PrismaClient } from "../generated/prisma/client";
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

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prismaClient = new PrismaClient({ adapter });

export const prisma = prismaClient.$extends({
  result: {
    user: {
      toDomain: {
        needs: {
          id: true,
          name: true,
          email: true,
          passwordHash: true,
          verifiedAt: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
        compute(user) {
          return User.create(user as Parameters<typeof User.create>[0]);
        },
      },
    },
    token: {
      toDomain: {
        needs: {
          id: true,
          userId: true,
          tokenHash: true,
          type: true,
          expiresAt: true,
          createdAt: true,
          updatedAt: true,
        },
        compute(token) {
          return Token.create(token as Parameters<typeof Token.create>[0]);
        },
      },
    },
    profile: {
      toDomain: {
        needs: {
          id: true,
          userId: true,
          linkedinUrl: true,
          githubUrl: true,
          portfolioUrl: true,
          ageRangeId: true,
          seniorityId: true,
          specialtyId: true,
          careerObjectiveId: true,
          createdAt: true,
          updatedAt: true,
        },
        compute(profile) {
          return Profile.create(
            profile as Parameters<typeof Profile.create>[0],
          );
        },
      },
    },
    quizQuestion: {
      toDomain: {
        needs: {
          id: true,
          statement: true,
          alternatives: true,
          correctAlternativeIndex: true,
          code: true,
          reports: true,
          sessionQuizId: true,
          stackId: true,
          subjectId: true,
          seniorityId: true,
          specialtyId: true,
          objectiveId: true,
          createdAt: true,
          updatedAt: true,
        },
        compute(quizQuestion) {
          return QuizQuestion.create(
            quizQuestion as Parameters<typeof QuizQuestion.create>[0],
          );
        },
      },
    },
    seniority: {
      toDomain: {
        needs: {
          id: true,
          name: true,
          description: true,
          slug: true,
          order: true,
          createdAt: true,
          updatedAt: true,
        },
        compute(seniority) {
          return Seniority.create(
            seniority as Parameters<typeof Seniority.create>[0],
          );
        },
      },
    },
    specialty: {
      toDomain: {
        needs: {
          id: true,
          name: true,
          description: true,
          slug: true,
          order: true,
          createdAt: true,
          updatedAt: true,
        },
        compute(specialty) {
          return Specialty.create(
            specialty as Parameters<typeof Specialty.create>[0],
          );
        },
      },
    },
    careerObjective: {
      toDomain: {
        needs: {
          id: true,
          name: true,
          description: true,
          slug: true,
          order: true,
          createdAt: true,
          updatedAt: true,
        },
        compute(careerObjective) {
          return CareerObjective.create(
            careerObjective as Parameters<typeof CareerObjective.create>[0],
          );
        },
      },
    },
    ageRange: {
      toDomain: {
        needs: {
          id: true,
          name: true,
          startAge: true,
          endAge: true,
          slug: true,
          order: true,
          createdAt: true,
          updatedAt: true,
        },
        compute(ageRange) {
          return AgeRange.create(
            ageRange as Parameters<typeof AgeRange.create>[0],
          );
        },
      },
    },
    stack: {
      toDomain: {
        needs: {
          id: true,
          name: true,
          slug: true,
          usageCount: true,
          createdAt: true,
          updatedAt: true,
        },
        compute(stack) {
          return Stack.create(stack as Parameters<typeof Stack.create>[0]);
        },
      },
    },
    quizObjective: {
      toDomain: {
        needs: {
          id: true,
          name: true,
          description: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
        },
        compute(quizObjective) {
          return QuizObjective.create(
            quizObjective as Parameters<typeof QuizObjective.create>[0],
          );
        },
      },
    },
    quizSubject: {
      toDomain: {
        needs: {
          id: true,
          name: true,
          description: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
        },
        compute(quizSubject) {
          return QuizSubject.create(
            quizSubject as Parameters<typeof QuizSubject.create>[0],
          );
        },
      },
    },
    feature: {
      toDomain: {
        needs: {
          id: true,
          name: true,
          description: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
        },
        compute(feature) {
          return Feature.create(feature as Parameters<typeof Feature.create>[0]);
        },
      },
    },
    sessionQuiz: {
      toDomain: {
        needs: {
          id: true,
          sessionId: true,
          userId: true,
          seniorityId: true,
          specialtyId: true,
          quizObjectiveId: true,
          quantityQuestions: true,
          score: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
        compute(sessionQuiz) {
          return SessionQuiz.create(
            sessionQuiz as Parameters<typeof SessionQuiz.create>[0],
          );
        },
      },
    },
  },
});
