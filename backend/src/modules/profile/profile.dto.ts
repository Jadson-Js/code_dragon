export interface CreateProfileDTO {
  userId: string;
  ageRangeId: number;
  seniorityId: number;
  specialtyId: number;
  careerObjectiveId: number;
  stacksId: number[];
}

export interface ProfileResponseDTO {
  id: string;
}

export interface IGetSetupDTO {
  seniority: { id: number; name: string; description: string }[];
  specialties: { id: number; name: string; description: string }[];
  careerObjectives: { id: number; name: string; description: string }[];
  ageRanges: { id: number; name: string }[];
  stacks: { id: number; name: string }[];
}
