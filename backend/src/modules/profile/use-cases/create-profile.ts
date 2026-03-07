import type { ICreateProfileWithStacksRepository } from "@/domain/repositories/profile/create-profile-with-stacks.repository";
import type { CreateProfileDTO } from "@/modules/profile/profile.dto";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateProfileUseCase {
  constructor(
    @inject("CreateProfileWithStacksRepository")
    private readonly createProfileWithStacksRepository: ICreateProfileWithStacksRepository,
  ) {}

  async execute(params: CreateProfileDTO) {
    const response =
      await this.createProfileWithStacksRepository.execute(params);
    return response;
  }
}
