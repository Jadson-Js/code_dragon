export interface IQuizQuestionGenerateInputDTO {
  quizObjectiveId: number;
  quizSubjectId?: number[];
  seniorityId: number;
  specialtyId: number;
  stacksId: number[];
  quantity: number;
  saveInProfile: boolean;
}
