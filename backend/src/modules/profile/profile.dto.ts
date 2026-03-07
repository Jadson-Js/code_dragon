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
