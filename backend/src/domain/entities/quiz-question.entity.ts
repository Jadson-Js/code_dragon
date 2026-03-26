interface ICreateQuizQuestionProps {
  id?: number;
  quizObjectiveId: number;
  quizSubjectId?: number | null;
  seniorityId: number;
  specialtyId: number;
  statement: string;
  alternatives: string;
  correctAlternativeIndex: number;
  code?: string | null;
  reports?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class QuizQuestion {
  private constructor(
    public readonly id: number | undefined,
    public readonly quizObjectiveId: number,
    public readonly quizSubjectId: number | null,
    public readonly seniorityId: number,
    public readonly specialtyId: number,
    public readonly statement: string,
    public readonly alternatives: string,
    public readonly correctAlternativeIndex: number,
    public readonly code: string | null,
    public readonly reports: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: ICreateQuizQuestionProps): QuizQuestion {
    return new QuizQuestion(
      props.id,
      props.quizObjectiveId,
      props.quizSubjectId ?? null,
      props.seniorityId,
      props.specialtyId,
      props.statement,
      props.alternatives,
      props.correctAlternativeIndex,
      props.code ?? null,
      props.reports ?? 0,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }
}
