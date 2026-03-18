export interface IProfileByUserId {
  id: string;
  userId: string;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  ageRangeId: number | null;
  seniorityId: number | null;
  specialtyId: number | null;
  careerObjectiveId: number | null;
  stackIds: number[];
}

export interface IGetProfileByUserIdRepository {
  execute(userId: string): Promise<IProfileByUserId | null>;
}
