import { inject, injectable } from "tsyringe";
import type { IQuizReportSubmitInputDTO } from "../report.schema";
import type { QuizQuestion, QuizSubject, Stack } from "generated/prisma/client";
import {
  SessionQuizStatus,
  type SessionQuizRoadmapPriority,
} from "generated/prisma/enums";
import { QuizQuestionPrismaRepository } from "@/infra/database/prisma/quiz-question.prisma.repository";
import { SessionQuizResultPrismaRepository } from "@/infra/database/prisma/session-quiz-result.prisma.repository";
import { SessionQuizPrismaRepository } from "@/infra/database/prisma/session-quiz.prisma.repository";
import { SessionQuizSubjectPrismaRepository } from "@/infra/database/prisma/session-quiz-subject.prisma.repository";
import { SessionQuizStackPrismaRepository } from "@/infra/database/prisma/session-quiz-stack.prisma.repository";
import type { IGeminiProvider } from "@/infra/providers/gemini.provider";
import type { SessionQuiz } from "@/entities/session-quiz.entity";
import * as utils from "@/shared/utils";
import { QuizReportSaveSubmitPrismaRepository } from "@/infra/database/prisma/quiz/report/quiz-report-save-submit.prisma.repository";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "@/shared/app.error";

type QuizQuestionWithRelations = QuizQuestion & {
  stack: Stack;
  subject: QuizSubject;
};

type EnrichedAnswer = {
  question: QuizQuestionWithRelations;
  isCorrect: boolean;
};

type ScoreEntry = {
  id: number;
  name: string;
  score: { user: number; community: number };
};

type PerformanceStats = {
  name: string;
  correct: number;
  total: number;
};

export interface IQuizReportSubmitResponse {
  sessionQuizId: string;
  sessionId: string;
  score: {
    user: number;
    community: number;
  };
  percentile: number;
  ranking: number;
  correctAnswers: number;
  wrongAnswers: number;
  ignoredAnswers: number;
  subjects: ScoreEntry[];
  stacks: ScoreEntry[];
  insights: {
    title: string;
    description: string;
    strongPoints: string[];
    weakPoints: string[];
  };
  roadmap: {
    title: string;
    description: string;
    priority: SessionQuizRoadmapPriority;
  }[];
}

@injectable()
export class QuizReportSubmitUseCase {
  constructor(
    @inject(QuizQuestionPrismaRepository)
    private readonly quizQuestionRepository: QuizQuestionPrismaRepository,

    @inject(SessionQuizResultPrismaRepository)
    private readonly sessionQuizResultRepository: SessionQuizResultPrismaRepository,

    @inject(SessionQuizPrismaRepository)
    private readonly sessionQuizRepository: SessionQuizPrismaRepository,

    @inject(SessionQuizSubjectPrismaRepository)
    private readonly sessionQuizSubjectRepository: SessionQuizSubjectPrismaRepository,

    @inject(SessionQuizStackPrismaRepository)
    private readonly sessionQuizStackRepository: SessionQuizStackPrismaRepository,

    @inject(QuizReportSaveSubmitPrismaRepository)
    private readonly quizReportSaveSubmitPrismaRepository: QuizReportSaveSubmitPrismaRepository,

    @inject("IGeminiProvider")
    private readonly geminiProvider: IGeminiProvider,
  ) {}

  async execute(
    data: IQuizReportSubmitInputDTO,
  ): Promise<IQuizReportSubmitResponse> {
    const [questions, session] = await this.loadContext(data);

    const enrichedAnswers = await this.enrichAnswer(data.answers, questions);

    const likedQuestionIds = data.answers
      .filter((a) => a.isLiked)
      .map((a) => a.quizQuestionId);

    const dislikedQuestionIds = data.answers
      .filter((a) => a.isDisliked)
      .map((a) => a.quizQuestionId);

    const answersForFeedback = enrichedAnswers.filter(
      (a) => !dislikedQuestionIds.includes(a.question.id),
    );

    const [evaluation, subjects, stacks] = await Promise.all([
      this.evaluateOverall(answersForFeedback, session),
      this.evaluateSubjects(answersForFeedback, session.seniorityId),
      this.evaluateStacks(answersForFeedback, session.seniorityId),
    ]);

    const { insights, roadmap } = await this.generateInsights(
      answersForFeedback,
      evaluation.score.user,
    );

    const response = {
      sessionQuizId: session.id,
      sessionId: session.sessionId,
      ...evaluation,
      subjects,
      stacks,
      insights,
      roadmap,
    };

    await this.quizReportSaveSubmitPrismaRepository.execute(
      response,
      likedQuestionIds,
      dislikedQuestionIds,
    );

    return response;
  }

  private async loadContext(
    dto: IQuizReportSubmitInputDTO,
  ): Promise<[QuizQuestionWithRelations[], SessionQuiz]> {
    const [questions, session] = await Promise.all([
      this.quizQuestionRepository.findManyByIds(
        dto.answers.map((a) => a.quizQuestionId),
      ),
      this.sessionQuizRepository.findById(dto.sessionQuizId),
    ]);

    if (!session) throw new NotFoundError("Session quiz not found");
    if (session.userId !== dto.userId) {
      throw new ForbiddenError("Session quiz does not belong to this user");
    }
    if (session.status === SessionQuizStatus.COMPLETED) {
      throw new ConflictError("Quiz report already submitted");
    }
    return [questions, session];
  }

  private async enrichAnswer(
    data: { quizQuestionId: string; selectedCorrectOption: boolean }[],
    questions: QuizQuestionWithRelations[],
  ): Promise<EnrichedAnswer[]> {
    const enrichedAnswers = data.map((answer) => {
      const question = questions.find((q) => q.id === answer.quizQuestionId);

      if (!question) throw new NotFoundError("Question not found");

      return {
        question,
        isCorrect: answer.selectedCorrectOption,
      };
    });

    return enrichedAnswers;
  }

  private async evaluateOverall(
    answers: EnrichedAnswer[],
    session: SessionQuiz,
  ) {
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const totalAnswers = answers.length;
    const userScore = utils.calculatePercentage(correctAnswers, totalAnswers);

    const communityScores =
      await this.sessionQuizResultRepository.findManyScoreBySeniority(
        session.seniorityId,
      );
    const communitySum = communityScores.reduce((acc, score) => acc + score, 0);
    const avgCommunityScore =
      communityScores.length > 0
        ? Math.round(communitySum / communityScores.length)
        : userScore;

    // Calcula Ranking e Percentil (incluindo a pontuação atual do usuário)
    const allScores = [...communityScores, userScore].sort((a, b) => b - a);
    const ranking = allScores.indexOf(userScore) + 1;
    const percentile = utils.calculatePercentage(
      allScores.length - (ranking - 1),
      allScores.length,
    );

    return {
      score: { user: userScore, community: avgCommunityScore },
      percentile,
      ranking,
      correctAnswers,
      wrongAnswers: totalAnswers - correctAnswers,
      ignoredAnswers: Math.max(
        0,
        (session.quantityQuestions ?? totalAnswers) - totalAnswers,
      ),
    };
  }

  private async evaluateSubjects(
    answers: EnrichedAnswer[],
    seniorityId: number,
  ): Promise<ScoreEntry[]> {
    const groups = this.groupAnswersBy(
      answers,
      (q) => q.subjectId,
      (q) => q.subject.name,
    );
    const communityStats =
      await this.sessionQuizSubjectRepository.findAverageScoreByContext(
        Array.from(groups.keys()),
        seniorityId,
      );

    return Array.from(groups.entries()).map(([id, stats]) => ({
      id: id,
      name: stats.name,
      score: {
        user: utils.calculatePercentage(stats.correct, stats.total),
        community:
          communityStats.find((s) => s.subjectId === id)?.averageScore ?? 0,
      },
    }));
  }

  private async evaluateStacks(
    answers: EnrichedAnswer[],
    seniorityId: number,
  ): Promise<ScoreEntry[]> {
    const groups = this.groupAnswersBy(
      answers,
      (q) => q.stackId,
      (q) => q.stack.name,
    );
    const communityStats =
      await this.sessionQuizStackRepository.findAverageScoreByContext(
        Array.from(groups.keys()),
        seniorityId,
      );

    return Array.from(groups.entries()).map(([id, stats]) => ({
      id: id,
      name: stats.name,
      score: {
        user: utils.calculatePercentage(stats.correct, stats.total),
        community:
          communityStats.find((s) => s.stackId === id)?.averageScore ?? 0,
      },
    }));
  }

  private groupAnswersBy<K>(
    answers: EnrichedAnswer[],
    getKey: (q: QuizQuestionWithRelations) => K | null | undefined,
    getName: (q: QuizQuestionWithRelations) => string,
  ): Map<K, PerformanceStats> {
    const map = new Map<K, PerformanceStats>();

    for (const { question, isCorrect } of answers) {
      const key = getKey(question);
      if (key == null) continue;

      const stats = map.get(key) ?? {
        name: getName(question),
        correct: 0,
        total: 0,
      };
      stats.total++;
      if (isCorrect) stats.correct++;
      map.set(key, stats);
    }

    return map;
  }

  private async generateInsights(answers: EnrichedAnswer[], userScore: number) {
    const wrongQuestions = answers
      .filter((a) => !a.isCorrect)
      .map((a) => a.question.statement);

    const toScoreEntries = (groups: Map<unknown, PerformanceStats>) =>
      Array.from(groups.values()).map((s) => ({
        name: s.name,
        correctAnswers: s.correct,
        wrongAnswers: s.total - s.correct,
        totalAnswers: s.total,
        score: utils.calculatePercentage(s.correct, s.total),
      }));

    const subjectGroups = this.groupAnswersBy(
      answers,
      (q) => q.subjectId,
      (q) => q.subject.name,
    );
    const stackGroups = this.groupAnswersBy(
      answers,
      (q) => q.stackId,
      (q) => q.stack.name,
    );

    const insightsInput = {
      score: userScore,
      subjects: toScoreEntries(subjectGroups),
      stacks: toScoreEntries(stackGroups),
      wrongQuestions,
    };

    const response =
      await this.geminiProvider.generateQuizInsights(insightsInput);

    return response;
  }
}
