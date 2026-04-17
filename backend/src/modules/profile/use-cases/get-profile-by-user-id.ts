import type { IGetProfileByUserIdRepository } from "@/infra/database/prisma/profile/get-profile-by-user-id.repository";
import { inject, injectable } from "tsyringe";
import { NotFoundError } from "@/shared/app.error";

@injectable()
export class GetProfileByUserIdUseCase {
  constructor(
    @inject("IGetProfileByUserIdRepository")
    private readonly getProfileByUserIdRepository: IGetProfileByUserIdRepository,
  ) {}

  async execute(userId: string) {
    const profile = await this.getProfileByUserIdRepository.execute(userId);

    if (!profile) {
      throw new NotFoundError("Profile not found for this user");
    }

    return profile;
  }
}
