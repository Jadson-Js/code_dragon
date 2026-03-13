interface ICreateStackProps {
  id?: number;
  name: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Stack {
  private constructor(
    public readonly id: number | undefined,
    public readonly name: string,
    public readonly slug: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: ICreateStackProps): Stack {
    return new Stack(
      props.id,
      props.name,
      props.slug,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }
}
