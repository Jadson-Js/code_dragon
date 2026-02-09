import type { ITokenRepository } from "@/domain/repositories/token.repository";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindByIdTokenUseCase {
  constructor(
    @inject("TokenRepository")
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(id: string) {
    return await this.tokenRepository.findById(id);
  }
}
