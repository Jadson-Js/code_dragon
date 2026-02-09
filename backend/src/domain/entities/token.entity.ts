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
  private _id: string;
  private _userId: string;
  private _tokenHash: string;
  private _type: TokenType;
  private _usedAt: Date | null;
  private _expiresAt: Date;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: CreateTokenProps) {
    this._id = props.id ?? crypto.randomUUID();
    this._userId = props.userId;
    this._tokenHash = props.tokenHash;
    this._type = props.type;
    this._usedAt = props.usedAt ?? null;
    this._expiresAt = props.expiresAt;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  static create(props: CreateTokenProps): Token {
    return new Token(props);
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get tokenHash(): string {
    return this._tokenHash;
  }

  get type(): TokenType {
    return this._type;
  }

  get usedAt(): Date | null {
    return this._usedAt;
  }

  get expiresAt(): Date {
    return this._expiresAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
