import { inject, injectable } from "tsyringe";
import type {
  IGeminiProvider,
  IGenerateQuizQuestionByGeminiInputProvider,
} from "@/domain/providers/gemini.provider";
import type { IQuizQuestionGenerateInputDTO } from "../questions.dto";
import type { IGetQuizQuestionContextRepository } from "@/domain/database/repositories/quiz/question/get-quiz-question-context.repository";
import type { IQuizQuestionRepository } from "@/domain/database/repositories/quiz-question.repository";
import type { IBaseQueueProvider } from "@/domain/providers/queue/base.provider";
import { QuizQuestion } from "@/domain/entities/quiz-question.entity";
import { mapContextToGeminiInput } from "../questions.mapper";
import { Profile } from "@/domain/entities/profile.entity";
import type { IUpdateProfileWithStacksRepository } from "@/domain/database/repositories/profile/update-profile-with-stacks.repository";

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
  ) {}

  async execute(data: IQuizQuestionGenerateInputDTO): Promise<QuizQuestion[]> {
    if (data.saveInProfile) await this.saveInProfile(data);
    const quantityPerBatch = 1;
    const batchQuestions = Math.ceil(data.quantity / quantityPerBatch);

    const context = await this.getQuizContextRepository.execute(data);
    const geminiInput = mapContextToGeminiInput(context, quantityPerBatch);

    const generateds =
      await this.geminiProvider.generateQuizQuestion(geminiInput);

    const questions = generateds.map((generated) =>
      QuizQuestion.create({
        quizObjectiveId: geminiInput.quizObjective.id,
        seniorityId: geminiInput.seniority.id,
        specialtyId: geminiInput.specialty.id,
        statement: generated.statement,
        alternatives: generated.alternatives,
        correctAlternativeIndex: generated.correctAlternativeIndex,
        code: generated.code,
      }),
    );

    const savedQuestions =
      await this.quizQuestionRepository.createMany(questions);

    for (let i = 1; i < batchQuestions; i++) {
      await this.generateQuizQuestionQueue.addJob(geminiInput);
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
}
