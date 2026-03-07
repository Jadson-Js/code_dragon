interface CreateUserSetupViewProps {
  userId: string;
  userSetupId: string;
  seniorityName: string;
  specialityName: string;
  careerObjectiveName: string;
  stackNames: string[];
}

export class UserSetupView {
  private constructor(
    public readonly userId: string,
    public readonly userSetupId: string,
    public readonly seniorityName: string,
    public readonly specialityName: string,
    public readonly careerObjectiveName: string,
    public readonly stackNames: string[],
  ) {}

  static create(props: CreateUserSetupViewProps): UserSetupView {
    return new UserSetupView(
      props.userId,
      props.userSetupId,
      props.seniorityName,
      props.specialityName,
      props.careerObjectiveName,
      props.stackNames,
    );
  }
}
