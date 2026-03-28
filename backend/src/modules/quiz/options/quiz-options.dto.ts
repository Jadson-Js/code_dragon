export interface IGetQuizOptionsOutputDTO {
  quizObjectives: { id: number; name: string }[];
  quizSubjects: { id: number; name: string }[];
  seniorities: { id: number; name: string }[];
  specialties: { id: number; name: string }[];
  stacks: { id: number; name: string }[];
}
