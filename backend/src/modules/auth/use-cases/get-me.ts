import { inject, injectable } from "tsyringe";
import { NotFoundError } from "@/shared/app.error";
import type { IGetMeRepository } from "@/domain/repositories/auth/get-me.repository";

@injectable()
export class GetMeUseCase {
  constructor(
    @inject("GetMeRepository")
    private readonly getMeRepository: IGetMeRepository,
  ) {}

  async execute(userId: string) {
    const data = await this.getMeRepository.execute(userId);
    if (!data) throw new NotFoundError("User not found");

    return data;
  }
}
