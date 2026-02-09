import type { ITokenRepository } from "@/domain/repositories/token.repository";
import { inject, injectable } from "tsyringe";

@injectable()
export class DeleteTokenUseCase {
  constructor(
    @inject("TokenRepository")
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(id: string) {
    return await this.tokenRepository.delete(id);
  }
}
