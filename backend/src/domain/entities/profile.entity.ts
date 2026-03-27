interface ICreateProfileProps {
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

interface IUpdateProfileProps {
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  seniorityId?: number | null;
  specialtyId?: number | null;
  careerObjectiveId?: number | null;
}

export class Profile {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public linkedinUrl: string | null,
    public githubUrl: string | null,
    public portfolioUrl: string | null,
    public readonly ageRangeId: number | null,
    public seniorityId: number | null,
    public specialtyId: number | null,
    public careerObjectiveId: number | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(props: ICreateProfileProps): Profile {
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

  update(props: IUpdateProfileProps): void {
    this.linkedinUrl = props.linkedinUrl ?? this.linkedinUrl;
    this.githubUrl = props.githubUrl ?? this.githubUrl;
    this.portfolioUrl = props.portfolioUrl ?? this.portfolioUrl;
    this.seniorityId = props.seniorityId ?? this.seniorityId;
    this.specialtyId = props.specialtyId ?? this.specialtyId;
    this.careerObjectiveId = props.careerObjectiveId ?? this.careerObjectiveId;
    this.updatedAt = new Date();
  }
}
