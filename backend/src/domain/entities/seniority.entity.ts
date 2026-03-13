interface ICreateSeniorityProps {
  id?: number;
  name: string;
  description: string;
  slug: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Seniority {
  private constructor(
    public readonly id: number | undefined,
    public readonly name: string,
    public readonly description: string,
    public readonly slug: string,
    public readonly order: number | undefined,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: ICreateSeniorityProps): Seniority {
    return new Seniority(
      props.id,
      props.name,
      props.description,
      props.slug,
      props.order,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }
}
