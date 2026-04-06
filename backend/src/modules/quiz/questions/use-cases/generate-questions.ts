import { inject, injectable } from "tsyringe";
import type {
  IGeminiProvider,
  IGenerateQuizQuestionByGeminiInputProvider,
} from "@/domain/providers/gemini.provider";
import type { IQuizQuestionGenerateInputDTO } from "../questions.dto";
import type { IGetQuizQuestionContextRepository } from "@/domain/database/repositories/quiz/question/get-quiz-question-context.repository";
import type { IQuizQuestionRepository } from "@/domain/database/repositories/quiz-question.repository";
import type { IBaseQueueProvider } from "@/domain/providers/queue/base.provider";
import type { ICreateSessionWithQuizRepository } from "@/domain/database/repositories/quiz/session/create-session-with-quiz.repository";
import { QuizQuestion } from "@/domain/entities/quiz-question.entity";
import { mapContextToGeminiInput } from "../questions.mapper";
import { Profile } from "@/domain/entities/profile.entity";
import type { IUpdateProfileWithStacksRepository } from "@/domain/database/repositories/profile/update-profile-with-stacks.repository";
import type { IFeatureRepository } from "@/domain/database/repositories/feature.repository";
import type { ISessionQuizRepository } from "@/domain/database/repositories/session-quiz.repository";
import { Session } from "@/domain/entities/session.entity";
import { SessionQuiz } from "@/domain/entities/session-quiz.entity";

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

  async execute(data: IQuizQuestionGenerateInputDTO): Promise<QuizQuestion[]> {
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

    return savedQuestions;
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
