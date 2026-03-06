import type { IUserSetupRepository } from "@/domain/repositories/user-setup.repository";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindAllUserSetupUseCase {
  constructor(
    @inject("UserSetupRepository")
    private readonly userSetupRepository: IUserSetupRepository,
  ) {}

  async execute() {
    return await this.userSetupRepository.findAll();
  }
}
