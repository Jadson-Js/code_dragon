interface ICreateFeatureProps {
  id?: number;
  name: string;
  description: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Feature {
  private constructor(
    public readonly id: number | undefined,
    public readonly name: string,
    public readonly description: string,
    public readonly slug: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: ICreateFeatureProps): Feature {
    return new Feature(
      props.id,
      props.name,
      props.description,
      props.slug,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }
}
