import { inject, injectable } from "tsyringe";
import type { ICreateFeedbackInputDTO } from "../feedback.schema";
import { FeedbackPrismaRepository } from "@/infra/database/prisma/feedback.prisma.repository";
import { Feedback } from "@/entities/feedback.entity";

@injectable()
export class CreateFeedbackUseCase {
  constructor(
    @inject(FeedbackPrismaRepository)
    private readonly feedbackRepository: FeedbackPrismaRepository,
  ) {}

  async execute(data: ICreateFeedbackInputDTO) {
    const feedback = Feedback.create(data);

    await this.feedbackRepository.create(feedback);
  }
}
