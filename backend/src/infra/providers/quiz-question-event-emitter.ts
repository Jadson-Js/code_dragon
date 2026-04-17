import { EventEmitter } from "node:events";
import { injectable } from "tsyringe";
import type { QuizQuestion } from "@/entities/quiz-question.entity";

export interface IQuizQuestionEvent {
  sessionQuizId: string;
  questions: QuizQuestion[];
}

export interface IFinishedEvent {
  sessionQuizId: string;
}

@injectable()
export class QuizQuestionEventEmitter extends EventEmitter {
  emitNewQuestions(data: IQuizQuestionEvent): void {
    this.emit(`new-questions:${data.sessionQuizId}`, data.questions);
  }

  emitFinished(data: IFinishedEvent): void {
    this.emit(`finished:${data.sessionQuizId}`, data);
  }

  onNewQuestions(
    sessionQuizId: string,
    callback: (questions: QuizQuestion[]) => void,
  ): void {
    this.on(`new-questions:${sessionQuizId}`, callback);
  }

  onFinished(
    sessionQuizId: string,
    callback: (data: IFinishedEvent) => void,
  ): void {
    this.on(`finished:${sessionQuizId}`, callback);
  }

  /**
   * Overriding default removeListener/off to allow easier management if needed.
   */
  offNewQuestions(
    sessionQuizId: string,
    callback: (questions: QuizQuestion[]) => void,
  ): void {
    this.off(`new-questions:${sessionQuizId}`, callback);
  }

  offFinished(
    sessionQuizId: string,
    callback: (data: IFinishedEvent) => void,
  ): void {
    this.off(`finished:${sessionQuizId}`, callback);
  }
}
