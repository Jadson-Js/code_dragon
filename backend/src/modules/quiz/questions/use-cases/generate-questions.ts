import { inject, injectable } from "tsyringe";
import type {
  IGeminiProvider,
  IGenerateQuizQuestionByGeminiInputProvider,
} from "@/domain/providers/gemini.provider";
import type { IQuizQuestionGenerateInputDTO } from "../questions.dto";
import type {
  IGetQuizQuestionContextOutputRepository,
  IGetQuizQuestionContextRepository,
} from "@/domain/database/repositories/quiz/question/get-quiz-question-context.repository";
import type { IQuizQuestionRepository } from "@/domain/database/repositories/quiz-question.repository";
import type { IBaseQueueProvider } from "@/domain/providers/queue/base.provider";
import { QuizQuestion } from "@/domain/entities/quiz-question.entity";

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
  ) {}

  async execute(data: IQuizQuestionGenerateInputDTO): Promise<void> {
    const context = await this.getQuizContextRepository.execute(data);

    await this.generateQuestion(context);

    for (let i = 1; i < data.quantity; i++) {
      await this.generateQuizQuestionQueue.addJob({
        quizObjective: {
          id: context.quizObjective.id as number,
          name: context.quizObjective.name,
          description: context.quizObjective.description,
        },
        quizSubject: context.quizSubject.map((s) => ({
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
      });
    }
  }

  private async generateQuestion(
    context: IGetQuizQuestionContextOutputRepository,
  ) {
    const generateds = await this.geminiProvider.generateQuizQuestion({
      quizObjective: {
        id: context.quizObjective.id as number,
        name: context.quizObjective.name,
        description: context.quizObjective.description,
      },
      quizSubject: context.quizSubject.map((s) => ({
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
    });

    const questions = generateds.map((generated) => {
      return QuizQuestion.create({
        quizObjectiveId: context.quizObjective.id as number,
        seniorityId: context.seniority.id as number,
        specialtyId: context.specialty.id as number,
        statement: generated.statement,
        alternatives: generated.alternatives,
        correctAlternativeIndex: generated.correctAlternativeIndex,
        code: generated.code,
      });
    });

    await this.quizQuestionRepository.createMany(questions);
  }
}
