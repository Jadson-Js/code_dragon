import type { ICreateUserSetupWithSetupStacksRepository } from "@/domain/repositories/user-setup/create-user-setup-with-setup-stacks.repository";
import type { CreateUserSetupDTO } from "@/modules/user-setup/user-setup.dto";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateUserSetupUseCase {
  constructor(
    @inject("CreateUserSetupWithSetupStacksRepository")
    private readonly createUserSetupWithSetupStacksRepository: ICreateUserSetupWithSetupStacksRepository,
  ) {}

  async execute(params: CreateUserSetupDTO) {
    const response =
      await this.createUserSetupWithSetupStacksRepository.execute(params);
    return response;
  }
}
