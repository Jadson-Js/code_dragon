import { GetProfileByUserIdPrismaRepository } from "@/infra/database/prisma/profile/get-profile-by-user-id.repository";
import { inject, injectable } from "tsyringe";
import { NotFoundError } from "@/shared/app.error";

@injectable()
export class GetProfileByUserIdUseCase {
  constructor(
    @inject(GetProfileByUserIdPrismaRepository)
    private readonly getProfileByUserIdRepository: GetProfileByUserIdPrismaRepository,
  ) {}

  async execute(userId: string) {
    const profile = await this.getProfileByUserIdRepository.execute(userId);

    if (!profile) {
      throw new NotFoundError("Profile not found for this user");
    }

    return profile;
  }
}
