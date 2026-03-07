interface CreateUserSetupProps {
  id?: string;
  userId: string;
  seniorityId: number;
  specialtyId: number;
  careerObjectiveId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserSetup {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly seniorityId: number,
    public readonly specialtyId: number,
    public readonly careerObjectiveId: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: CreateUserSetupProps): UserSetup {
    return new UserSetup(
      props.id ?? crypto.randomUUID(),
      props.userId,
      props.seniorityId,
      props.specialtyId,
      props.careerObjectiveId,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }
}
