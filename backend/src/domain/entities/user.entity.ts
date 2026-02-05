interface CreateUserProps {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  birthDate?: Date;
  verifiedAt?: Date;
  imageId?: number;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class User {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _email: string,
    private readonly _passwordHash: string,
    private readonly _birthDate: Date | null,
    private readonly _verifiedAt: Date | null,
    private readonly _imageId: number | null,
    private readonly _linkedinUrl: string | null,
    private readonly _githubUrl: string | null,
    private readonly _portfolioUrl: string | null,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
    private readonly _deletedAt: Date | null,
  ) {}

  public static create(props: CreateUserProps): User {
    return new User(
      props.id ?? crypto.randomUUID(),
      props.name,
      props.email,
      props.passwordHash,
      props.birthDate ?? null,
      props.verifiedAt ?? null,
      props.imageId ?? null,
      props.linkedinUrl ?? null,
      props.githubUrl ?? null,
      props.portfolioUrl ?? null,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
      props.deletedAt ?? null,
    );
  }

  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get email(): string {
    return this._email;
  }
  get passwordHash(): string {
    return this._passwordHash;
  }
  get birthDate(): Date | null {
    return this._birthDate;
  }

  get verifiedAt(): Date | null {
    return this._verifiedAt;
  }

  get imageId(): number | null {
    return this._imageId;
  }

  get linkedinUrl(): string | null {
    return this._linkedinUrl;
  }

  get githubUrl(): string | null {
    return this._githubUrl;
  }

  get portfolioUrl(): string | null {
    return this._portfolioUrl;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }
}
