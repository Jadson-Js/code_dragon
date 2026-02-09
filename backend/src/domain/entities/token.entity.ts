import type { TokenType } from "generated/prisma/enums";

interface CreateTokenProps {
  id?: string;
  userId: string;
  tokenHash: string;
  type: TokenType;
  usedAt?: Date | null;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Token {
  readonly id: string;
  readonly userId: string;
  readonly tokenHash: string;
  readonly type: TokenType;
  readonly usedAt: Date | null;
  readonly expiresAt: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: CreateTokenProps) {
    this.id = props.id ?? crypto.randomUUID();
    this.userId = props.userId;
    this.tokenHash = props.tokenHash;
    this.type = props.type;
    this.usedAt = props.usedAt ?? null;
    this.expiresAt = props.expiresAt;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  static create(props: CreateTokenProps): Token {
    return new Token(props);
  }

  isExpired(): boolean {
    return this.expiresAt < new Date();
  }
}
