import { inject, injectable } from "tsyringe";
import type {
  IGeminiProvider,
  IGenerateQuizQuestionInput,
} from "@/infra/providers/gemini.provider";
import type { IQuizQuestionGenerateInputDTO } from "../questions.schema";
import {
  GetQuizContextPrismaRepository,
  type IGetQuizQuestionContextOutput,
} from "@/infra/database/prisma/quiz/questions/get-quiz-context.prisma.repository";
import { QuizQuestionPrismaRepository } from "@/infra/database/prisma/quiz-question.prisma.repository";
import type { IBaseQueueProvider } from "@/infra/providers/queue/base.bullmq.provider";
import { CreateSessionWithQuizPrismaRepository } from "@/infra/database/prisma/quiz/session/create-session-with-quiz.prisma.repository";
import { Profile } from "@/entities/profile.entity";
import { UpdateProfileWithStacksPrismaRepository } from "@/infra/database/prisma/profile/update-profile-with-stacks.repository";
import { FeaturePrismaRepository } from "@/infra/database/prisma/feature.prisma.repository";
import { SessionQuizPrismaRepository } from "@/infra/database/prisma/session-quiz.prisma.repository";
import { SessionQuiz } from "@/entities/session-quiz.entity";
import type { Prisma } from "generated/prisma/client";

@injectable()
export class QuizQuestionGenerateUseCase {
  constructor(
    @inject(GetQuizContextPrismaRepository)
    private readonly getQuizContextRepository: GetQuizContextPrismaRepository,

    @inject("IGenerateQuizQuestionQueueProvider")
    private readonly generateQuizQuestionQueue: IBaseQueueProvider<IGenerateQuizQuestionInput>,

    @inject("IGeminiProvider")
    private readonly geminiProvider: IGeminiProvider,

    @inject(QuizQuestionPrismaRepository)
    private readonly quizQuestionRepository: QuizQuestionPrismaRepository,

    @inject(UpdateProfileWithStacksPrismaRepository)
    private readonly updateProfileWithStacksRepository: UpdateProfileWithStacksPrismaRepository,

    @inject(CreateSessionWithQuizPrismaRepository)
    private readonly createSessionWithQuizRepository: CreateSessionWithQuizPrismaRepository,

    @inject(FeaturePrismaRepository)
    private readonly featureRepository: FeaturePrismaRepository,

    @inject(SessionQuizPrismaRepository)
    private readonly sessionQuizRepository: SessionQuizPrismaRepository,
  ) {}

  async execute(
    data: IQuizQuestionGenerateInputDTO,
  ): Promise<{ sessionQuizId: string }> {
    if (data.saveInProfile) await this.saveInProfile(data);

    const { sessionQuiz } = await this.createSession(data);

    const quantityPerBatch = 1;
    const batchQuestions = Math.ceil(data.quantity / quantityPerBatch);

    const context = await this.getQuizContextRepository.execute(data);

    const geminiInput = this.mapContextToGeminiInput(
      context,
      quantityPerBatch,
      sessionQuiz,
    );

    const questionsGenerated =
      await this.geminiProvider.generateQuizQuestion(geminiInput);

    const questions: Prisma.QuizQuestionCreateManyInput[] =
      questionsGenerated.map((generated) => ({
        statement: generated.statement,
        alternatives: generated.alternatives,
        correctAlternativeIndex: generated.correctAlternativeIndex,
        code: generated.code,
        sessionQuizId: sessionQuiz.id,
        stackId: generated.stackId,
        subjectId: generated.subjectId,
        seniorityId: data.seniorityId,
        specialtyId: data.specialtyId,
        objectiveId: data.quizObjectiveId,
      }));

    for (let i = 1; i < batchQuestions; i++) {
      await this.generateQuizQuestionQueue.addJob(geminiInput);
    }

    const savedQuestions =
      await this.quizQuestionRepository.createMany(questions);

    if (savedQuestions.length >= data.quantity) {
      await this.sessionQuizRepository.updateStatus(
        sessionQuiz.id,
        "IN_PROGRESS",
      );
    }

    return { sessionQuizId: sessionQuiz.id };
  }

  private async saveInProfile(data: IQuizQuestionGenerateInputDTO) {
    const profileUpdated = Profile.create({
      userId: data.userId,
      seniorityId: data.seniorityId,
      specialtyId: data.specialtyId,
    });

    await this.updateProfileWithStacksRepository.execute({
      profile: profileUpdated,
      stacksId: data.stacksId,
    });
  }

  private async createSession(
    data: IQuizQuestionGenerateInputDTO,
  ): Promise<{ sessionQuiz: SessionQuiz }> {
    const feature = await this.featureRepository.findBySlug("quiz");
    if (!feature || !feature.id)
      throw new Error("Quiz feature not found in the database");

    const sessionId = crypto.randomUUID();

    const sessionQuiz = SessionQuiz.create({
      sessionId: sessionId,
      userId: data.userId,
      seniorityId: data.seniorityId,
      specialtyId: data.specialtyId,
      quizObjectiveId: data.quizObjectiveId,
      quantityQuestions: data.quantity,
    });

    const { sessionQuiz: sessionQuizCreated } =
      await this.createSessionWithQuizRepository.execute({
        session: {
          id: sessionId,
          userId: data.userId,
          featureId: feature.id,
        },
        sessionQuiz,
        stacksId: data.stacksId,
        ...(data.quizSubjectsId ? { quizSubjectsId: data.quizSubjectsId } : {}),
      });

    return { sessionQuiz: sessionQuizCreated };
  }

  private mapContextToGeminiInput(
    context: IGetQuizQuestionContextOutput,
    quantityPerBatch: number,
    sessionQuiz: SessionQuiz,
  ): IGenerateQuizQuestionInput {
    return {
      quizObjective: {
        id: context.quizObjective.id as number,
        name: context.quizObjective.name,
        description: context.quizObjective.description,
      },
      quizSubjects: context.quizSubjects.map((s) => ({
        id: s.id as number,
        name: s.name,
        description: s.description,
      })),
      seniority: {
        id: context.seniority.id as number,
        name: context.seniority.name,
      },
      specialty: {
        id: context.specialty.id as number,
        name: context.specialty.name,
      },
      stacks: context.stacks.map((s) => ({
        id: s.id as number,
        name: s.name,
      })),
      quantityPerBatch,
      sessionQuiz,
    };
  }
}
