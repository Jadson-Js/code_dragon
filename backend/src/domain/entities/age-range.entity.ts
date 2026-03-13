interface ICreateAgeRangeProps {
  id?: number;
  name: string;
  startAge: number;
  endAge: number;
  slug: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class AgeRange {
  private constructor(
    public readonly id: number | undefined,
    public readonly name: string,
    public readonly startAge: number,
    public readonly endAge: number,
    public readonly slug: string,
    public readonly order: number | undefined,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: ICreateAgeRangeProps): AgeRange {
    return new AgeRange(
      props.id,
      props.name,
      props.startAge,
      props.endAge,
      props.slug,
      props.order,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }
}
