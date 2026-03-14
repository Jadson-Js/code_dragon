import z from "zod";

export const profileSetupSchema = z.object({
  ageRangeId: z.number("Invalido").min(1, "Selecione sua faixa etária"),
  seniorityId: z.number("Invalido").min(1, "Selecione sua senioridade"),
  specialtyId: z.number("Invalido").min(1, "Selecione sua especialidade"),
  careerObjectiveId: z
    .number("Invalido")
    .min(1, "Selecione seu objetivo de carreira"),
  stacksId: z.array(z.number()).min(1, "Selecione pelo menos uma stack"),
});
export type ProfileSetupFormData = z.infer<typeof profileSetupSchema>;
