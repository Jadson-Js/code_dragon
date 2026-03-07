export interface CreateUserSetupDTO {
  userId: string;
  seniorityId: number;
  specialtyId: number;
  careerObjectiveId: number;
  stacksId: number[];
}

export interface UserSetupResponseDTO {
  id: string;
}
