import { inject, injectable } from "tsyringe";
import { NotFoundError } from "@/shared/app.error";
import type { User } from "@/domain/entities/user.entity";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import type { IUserSetupViewRepository } from "@/domain/repositories/user-setup/user-setup-view.repository";
import type { UserSetupView } from "@/domain/entities/user-setup-view";

@injectable()
export class GetMeUseCase {
  constructor(
    @inject("IUserSetupViewRepository")
    private readonly userSetupViewRepository: IUserSetupViewRepository,
  ) {}

  async execute(userId: string): Promise<UserSetupView> {
    const user = await this.userSetupViewRepository.findByUserId(userId);
    if (!user) throw new NotFoundError("User not found");

    return user;
  }
}
