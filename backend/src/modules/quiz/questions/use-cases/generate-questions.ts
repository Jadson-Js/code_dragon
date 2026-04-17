import { inject, injectable } from "tsyringe";
import type {
  IGeminiProvider,
  IGenerateQuizQuestionByGeminiInputProvider,
} from "@/infra/providers/gemini.provider";
import type { IQuizQuestionGenerateInputDTO } from "../questions.dto";
import type { IGetQuizQuestionContextRepository } from "@/infra/database/prisma/quiz/questions/get-quiz-context.prisma.repository";
import type { IQuizQuestionRepository } from "@/infra/database/prisma/quiz-question.prisma.repository";
import type { IBaseQueueProvider } from "@/infra/providers/queue/base.bullmq.provider";
import type { ICreateSessionWithQuizRepository } from "@/infra/database/prisma/quiz/session/create-session-with-quiz.prisma.repository";
import { QuizQuestion } from "@/entities/quiz-question.entity";
import { mapContextToGeminiInput } from "../questions.mapper";
import { Profile } from "@/entities/profile.entity";
import type { IUpdateProfileWithStacksRepository } from "@/infra/database/prisma/profile/update-profile-with-stacks.repository";
import type { IFeatureRepository } from "@/infra/database/prisma/feature.prisma.repository";
import type { ISessionQuizRepository } from "@/infra/database/prisma/session-quiz.prisma.repository";
import { Session } from "@/entities/session.entity";
import { SessionQuiz } from "@/entities/session-quiz.entity";

@injectable()
export class QuizQuestionGenerateUseCase {
  constructor(
    @inject("IGetQuizQuestionContextRepository")
    private readonly getQuizContextRepository: IGetQuizQuestionContextRepository,

    @inject("IGenerateQuizQuestionQueueProvider")
    private readonly generateQuizQuestionQueue: IBaseQueueProvider<IGenerateQuizQuestionByGeminiInputProvider>,

    @inject("IGeminiProvider")
    private readonly geminiProvider: IGeminiProvider,

    @inject("IQuizQuestionRepository")
    private readonly quizQuestionRepository: IQuizQuestionRepository,

    @inject("IUpdateProfileWithStacksRepository")
    private readonly updateProfileWithStacksRepository: IUpdateProfileWithStacksRepository,

    @inject("ICreateSessionWithQuizRepository")
    private readonly createSessionWithQuizRepository: ICreateSessionWithQuizRepository,

    @inject("IFeatureRepository")
    private readonly featureRepository: IFeatureRepository,

    @inject("ISessionQuizRepository")
    private readonly sessionQuizRepository: ISessionQuizRepository,
  ) {}

  async execute(
    data: IQuizQuestionGenerateInputDTO,
  ): Promise<{ sessionQuizId: string }> {
    if (data.saveInProfile) await this.saveInProfile(data);

    const { sessionQuiz } = await this.createSession(data);

    const quantityPerBatch = 1;
    const batchQuestions = Math.ceil(data.quantity / quantityPerBatch);

    const context = await this.getQuizContextRepository.execute(data);
    const geminiInput = mapContextToGeminiInput(
      context,
      quantityPerBatch,
      sessionQuiz,
    );

    const questionsGenerated =
      await this.geminiProvider.generateQuizQuestion(geminiInput);

    const questions = questionsGenerated.map((generated) =>
      QuizQuestion.create({
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
      }),
    );

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

    const session = Session.create({
      userId: data.userId,
      featureId: feature.id,
    });

    const sessionQuiz = SessionQuiz.create({
      sessionId: session.id as string,
      userId: data.userId,
      seniorityId: data.seniorityId,
      specialtyId: data.specialtyId,
      quizObjectiveId: data.quizObjectiveId,
      quantityQuestions: data.quantity,
    });

    const { sessionQuiz: sessionQuizCreated } =
      await this.createSessionWithQuizRepository.execute({
        session,
        sessionQuiz,
        stacksId: data.stacksId,
        ...(data.quizSubjectsId ? { quizSubjectsId: data.quizSubjectsId } : {}),
      });

    return { sessionQuiz: sessionQuizCreated };
  }
}
