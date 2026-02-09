import type { ITokenRepository } from "@/domain/repositories/token.repository";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindAllTokenUseCase {
  constructor(
    @inject("TokenRepository")
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute() {
    return await this.tokenRepository.findAll();
  }
}
