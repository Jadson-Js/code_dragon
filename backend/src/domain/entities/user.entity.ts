interface CreateUserProps {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  birthDate?: Date | null;
  verifiedAt?: Date | null;
  imageId?: number | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class User {
  private _id: string;
  private _name: string;
  private _email: string;
  private _passwordHash: string;
  private _birthDate: Date | null;
  private _verifiedAt: Date | null;
  private _imageId: number | null;
  private _linkedinUrl: string | null;
  private _githubUrl: string | null;
  private _portfolioUrl: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  private constructor(props: CreateUserProps) {
    this._id = props.id ?? crypto.randomUUID();
    this._name = props.name;
    this._email = props.email;
    this._passwordHash = props.passwordHash;
    this._birthDate = props.birthDate ?? null;
    this._verifiedAt = props.verifiedAt ?? null;
    this._imageId = props.imageId ?? null;
    this._linkedinUrl = props.linkedinUrl ?? null;
    this._githubUrl = props.githubUrl ?? null;
    this._portfolioUrl = props.portfolioUrl ?? null;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
    this._deletedAt = props.deletedAt ?? null;
  }

  static create(props: CreateUserProps): User {
    return new User(props);
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
