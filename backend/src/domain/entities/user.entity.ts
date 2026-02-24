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
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly birthDate: Date | null;
  readonly verifiedAt: Date | null;
  readonly imageId: number | null;
  readonly linkedinUrl: string | null;
  readonly githubUrl: string | null;
  readonly portfolioUrl: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;

  private constructor(props: CreateUserProps) {
    this.id = props.id ?? crypto.randomUUID();
    this.name = props.name;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.birthDate = props.birthDate ?? null;
    this.verifiedAt = props.verifiedAt ?? null;
    this.imageId = props.imageId ?? null;
    this.linkedinUrl = props.linkedinUrl ?? null;
    this.githubUrl = props.githubUrl ?? null;
    this.portfolioUrl = props.portfolioUrl ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
  }

  static create(props: CreateUserProps): User {
    return new User(props);
  }

  markAsVerified(): User {
    return new User({ ...this, verifiedAt: new Date(), updatedAt: new Date() });
  }

  isVerified(): boolean {
    return this.verifiedAt !== null;
  }

  changePassword(passwordHash: string): User {
    return new User({ ...this, passwordHash, updatedAt: new Date() });
  }
}
