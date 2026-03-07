interface CreateUserSetupViewProps {
  userId: string;
  userName: string;
  userSetupId: string | null;
  seniorityName: string | null;
  specialityName: string | null;
  careerObjectiveName: string | null;
  stackNames: string[];
}

export class UserSetupView {
  private constructor(
    public readonly userId: string,
    public readonly userName: string,
    public readonly userSetupId: string | null,
    public readonly seniorityName: string | null,
    public readonly specialityName: string | null,
    public readonly careerObjectiveName: string | null,
    public readonly stackNames: string[],
  ) {}

  static create(props: CreateUserSetupViewProps): UserSetupView {
    return new UserSetupView(
      props.userId,
      props.userName,
      props.userSetupId,
      props.seniorityName,
      props.specialityName,
      props.careerObjectiveName,
      props.stackNames,
    );
  }
}
