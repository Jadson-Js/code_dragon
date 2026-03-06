import { UserSetup } from "@/domain/entities/user-setup.entity";
import type { IUserSetupRepository } from "@/domain/repositories/user-setup.repository";
import type { CreateUserSetupDTO } from "@/modules/user-setup/user-setup.dto";
import { inject, injectable } from "tsyringe";

@injectable()
export class UpdateUserSetupUseCase {
  constructor(
    @inject("UserSetupRepository")
    private readonly userSetupRepository: IUserSetupRepository,
  ) {}

  async execute(params: CreateUserSetupDTO & { id: string }) {
    const userSetup = UserSetup.create(params);
    const response = await this.userSetupRepository.update(userSetup);
    return response;
  }
}
