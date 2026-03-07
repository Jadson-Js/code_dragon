interface CreateProfileProps {
  id?: string;
  userId: string;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  ageRangeId?: number | null;
  seniorityId?: number | null;
  specialtyId?: number | null;
  careerObjectiveId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Profile {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly linkedinUrl: string | null,
    public readonly githubUrl: string | null,
    public readonly portfolioUrl: string | null,
    public readonly ageRangeId: number | null,
    public readonly seniorityId: number | null,
    public readonly specialtyId: number | null,
    public readonly careerObjectiveId: number | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: CreateProfileProps): Profile {
    return new Profile(
      props.id ?? crypto.randomUUID(),
      props.userId,
      props.linkedinUrl ?? null,
      props.githubUrl ?? null,
      props.portfolioUrl ?? null,
      props.ageRangeId ?? null,
      props.seniorityId ?? null,
      props.specialtyId ?? null,
      props.careerObjectiveId ?? null,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }
}
