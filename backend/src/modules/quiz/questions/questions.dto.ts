export interface IQuizGenerateQuestionsDTO {
  quizObjectiveId: number;
  quizSubjectId?: number[];
  seniorityId: number;
  specialtyId: number;
  stacksId: number[];
  quantity: number;
  saveInProfile: boolean;
}

export interface IQuizGenerateQuestionsResponseDTO {
  id: string;
}
