export interface ICreateProfileInputDTO {
  userId: string;
  ageRangeId: number;
  seniorityId: number;
  specialtyId: number;
  careerObjectiveId: number;
  stacksId: number[];
}

export interface ICreateProfileOutputDTO {
  id: string;
}

export interface IGetOnboardingOptionsOutputDTO {
  seniorities: { id: number; name: string; description: string }[];
  specialties: { id: number; name: string; description: string }[];
  careerObjectives: { id: number; name: string; description: string }[];
  ageRanges: { id: number; name: string }[];
  stacks: { id: number; name: string }[];
}

export interface IGetProfileByUserIdOutputDTO {
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
