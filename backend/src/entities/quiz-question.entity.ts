interface ICreateQuizQuestionProps {
  id?: number;
  statement: string;
  alternatives: string[];
  correctAlternativeIndex: number;
  code?: string | null;
  reports?: number;
  sessionQuizId: string;
  stackId?: number | null;
  subjectId?: number | null;
  seniorityId: number;
  specialtyId: number;
  objectiveId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class QuizQuestion {
  private constructor(
    public readonly id: number | undefined,
    public readonly statement: string,
    public readonly alternatives: string[],
    public readonly correctAlternativeIndex: number,
    public readonly code: string | null,
    public readonly reports: number,
    public readonly sessionQuizId: string,
    public readonly stackId: number | null,
    public readonly subjectId: number | null,
    public readonly seniorityId: number,
    public readonly specialtyId: number,
    public readonly objectiveId: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: ICreateQuizQuestionProps): QuizQuestion {
    return new QuizQuestion(
      props.id,
      props.statement,
      props.alternatives,
      props.correctAlternativeIndex,
      props.code ?? null,
      props.reports ?? 0,
      props.sessionQuizId,
      props.stackId ?? null,
      props.subjectId ?? null,
      props.seniorityId,
      props.specialtyId,
      props.objectiveId,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }
}
