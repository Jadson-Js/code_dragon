import { inject, injectable } from "tsyringe";
import { NotFoundError } from "@/shared/app.error";
import type { User } from "@/domain/entities/user.entity";
import type { IUserRepository } from "@/domain/repositories/user.repository";

@injectable()
export class GetMeUseCase {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    return user;
  }
}
