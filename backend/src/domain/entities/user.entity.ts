interface CreateUserProps {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  verifiedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class User {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly verifiedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}

  static create(props: CreateUserProps): User {
    return new User(
      props.id ?? crypto.randomUUID(),
      props.name,
      props.email,
      props.passwordHash,
      props.verifiedAt ?? null,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
      props.deletedAt ?? null,
    );
  }

  markAsVerified(): User {
    return User.create({
      ...this,
      verifiedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  isVerified(): boolean {
    return this.verifiedAt !== null;
  }

  changePassword(passwordHash: string): User {
    return User.create({ ...this, passwordHash, updatedAt: new Date() });
  }
}
