import type { IJWTProvider } from "@/domain/providers/jwt.provider";
import { UnauthorizedError } from "@/shared/app.error";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

export interface IEnsureAuthenticated {
  authRefresh(req: Request, res: Response, next: NextFunction): Promise<void>;
  authAccess(req: Request, res: Response, next: NextFunction): Promise<void>;
}

@injectable()
export class EnsureAuthenticated implements IEnsureAuthenticated {
  constructor(
    @inject("IJWTProvider")
    private readonly jwtProvider: IJWTProvider,
  ) {}

  async authRefresh(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const token = req.cookies.refreshToken;
    if (!token) throw new UnauthorizedError("Missing refresh token in cookies");

    const isValid = await this.jwtProvider.verifyRefreshToken(token);
    if (!isValid) throw new UnauthorizedError("Invalid refresh token");

    const decoded = await this.jwtProvider.decodeToken(token);
    req.authSession = { id: decoded.sub as string };
    next();
  }

  async authAccess(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const token = req.cookies.accessToken;
    if (!token) throw new UnauthorizedError("Missing access token in cookies");

    const isValid = await this.jwtProvider.verifyAccessToken(token);
    if (!isValid) throw new UnauthorizedError("Invalid access token");

    const decoded = await this.jwtProvider.decodeToken(token);
    req.user = { id: decoded.sub as string };
    next();
  }
}
