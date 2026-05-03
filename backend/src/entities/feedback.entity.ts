import { AppError, BadRequestError } from "@/shared/app.error";

interface ICreateFeedbackProps {
  id?: string;
  userId: string;
  featureId?: number | null | undefined;
  sessionId?: string | null | undefined;
  rate: number;
  reason: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null | undefined;
}

export class Feedback {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly featureId: number | null,
    public readonly sessionId: string | null,
    public readonly rate: number,
    public readonly reason: string,
    public readonly description: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {
    if (rate < 1 || rate > 5) {
      throw new BadRequestError("Rate must be between 1 and 5");
    }
  }

  static create(props: ICreateFeedbackProps): Feedback {
    return new Feedback(
      props.id ?? crypto.randomUUID(),
      props.userId,
      props.featureId ?? null,
      props.sessionId ?? null,
      props.rate,
      props.reason,
      props.description,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
      props.deletedAt ?? null,
    );
  }
}
