import { inject, injectable } from "tsyringe";
import { NotFoundError } from "@/shared/app.error";
import { GetMePrismaRepository } from "@/infra/database/prisma/auth/get-me.prisma.repository";

@injectable()
export class GetMeUseCase {
  constructor(
    @inject(GetMePrismaRepository)
    private readonly getMeRepository: GetMePrismaRepository,
  ) {}

  async execute(userId: string) {
    const data = await this.getMeRepository.execute(userId);
    if (!data) throw new NotFoundError("User not found");

    return data;
  }
}
