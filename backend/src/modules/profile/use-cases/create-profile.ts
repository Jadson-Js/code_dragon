import type { ICreateProfileWithStacksRepository } from "@/domain/database/repositories/profile/create-profile-with-stacks.repository";
import type { ICreateProfileInputDTO } from "@/modules/profile/profile.dto";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateProfileUseCase {
  constructor(
    @inject("ICreateProfileWithStacksRepository")
    private readonly createProfileWithStacksRepository: ICreateProfileWithStacksRepository,
  ) {}

  async execute(params: ICreateProfileInputDTO) {
    const response =
      await this.createProfileWithStacksRepository.execute(params);
    return response;
  }
}
