import { CreateProfileWithStacksPrismaRepository } from "@/infra/database/prisma/profile/create-profile-with-stacks.repository";
import type { ICreateProfileInputDTO } from "@/modules/profile/profile.dto";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateProfileUseCase {
  constructor(
    private readonly createProfileWithStacksRepository: CreateProfileWithStacksPrismaRepository,
  ) {}

  async execute(params: ICreateProfileInputDTO) {
    const response =
      await this.createProfileWithStacksRepository.execute(params);
    return response;
  }
}
