import z from "zod";

export const profileSetupSchema = z.object({
  ageRangeId: z.number("Selecione sua faixa etária").min(1).max(5),
  seniorityId: z.number("Selecione sua senioridade").min(1).max(5),
  specialtyId: z.number("Selecione sua especialidade").min(1).max(5),
  careerObjectiveId: z
    .number("Selecione seu objetivo de carreira")
    .min(1)
    .max(4),
  stacksId: z.array(z.number()).min(1, "Selecione pelo menos uma stack"),
});
export type ProfileSetupFormData = z.infer<typeof profileSetupSchema>;
