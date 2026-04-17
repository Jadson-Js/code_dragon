interface ICreateSessionProps {
  id?: string;
  userId: string;
  featureId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Session {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly featureId: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: ICreateSessionProps): Session {
    return new Session(
      props.id ?? crypto.randomUUID(),
      props.userId,
      props.featureId,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }
}
