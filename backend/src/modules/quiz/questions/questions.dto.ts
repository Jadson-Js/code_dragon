export interface IQuizQuestionGenerateInputDTO {
  userId: string;
  quizObjectiveId: number;
  quizSubjectsId?: number[];
  seniorityId: number;
  specialtyId: number;
  stacksId: number[];
  quantity: number;
  saveInProfile: boolean;
}
