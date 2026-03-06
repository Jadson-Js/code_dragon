export interface CreateUserSetupDTO {
  userId: string;
  seniorityId: number;
  specialityId: number;
  careerObjectiveId: number;
  stacksId: number[];
}

export interface UserSetupResponseDTO {
  id: string;
}
