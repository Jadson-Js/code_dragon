import type { IUserSetupRepository } from "@/domain/repositories/user-setup.repository";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindByIdUserSetupUseCase {
  constructor(
    @inject("UserSetupRepository")
    private readonly userSetupRepository: IUserSetupRepository,
  ) {}

  async execute(id: string) {
    return await this.userSetupRepository.findById(id);
  }
}
