interface ICreateSessionQuizProps {
  id?: string;
  sessionId: string;
  userId: string;
  seniorityId: number;
  specialtyId: number;
  quizObjectiveId: number;
  quantityQuestions: number;
  score?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SessionQuiz {
  private constructor(
    public readonly id: string,
    public readonly sessionId: string,
    public readonly userId: string,
    public readonly seniorityId: number,
    public readonly specialtyId: number,
    public readonly quizObjectiveId: number,
    public readonly quantityQuestions: number,
    public readonly score: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: ICreateSessionQuizProps): SessionQuiz {
    return new SessionQuiz(
      props.id ?? crypto.randomUUID(),
      props.sessionId,
      props.userId,
      props.seniorityId,
      props.specialtyId,
      props.quizObjectiveId,
      props.quantityQuestions,
      props.score ?? 0,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }
}
