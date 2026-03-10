import PageHeader from "@/components/PageHeader";
import ListItem from "./ListItem";
import { useFormContext, Controller } from "react-hook-form";
import type { ProfileSetupFormData } from "../schemas/profileSetupSchema";

export default function ProfileStep1() {
  const { control } = useFormContext<ProfileSetupFormData>();

  const seniorities = [
    {
      id: 1,
      title: "Sem Experiência",
      description:
        "Estudando ou com menos de 1 ano de experiência profissional",
    },
    {
      id: 2,
      title: "Estagiário / Trainee",
      description: "Atuando como estagiário ou em programas de trainee",
    },
    {
      id: 3,
      title: "Júnior",
      description:
        "Profissional em início de carreira (geralmente 1-2 anos exp.)",
    },
    {
      id: 4,
      title: "Pleno",
      description:
        "Profissional com experiência intermediária (geralmente 3-5 anos exp.)",
    },
    {
      id: 5,
      title: "Sênior",
      description:
        "Profissional experiente, referência técnica (geralmente 5+ anos exp.)",
    },
  ];

  return (
    <>
      <PageHeader
        title="Qual seu nível atual de experiência?"
        description="Isso nos ajuda a personalizar seus diagnósticos e desafios"
        className="mb-8"
      />

      <div className="flex flex-col gap-4 w-full">
        <Controller
          name="seniorityId"
          control={control}
          render={({ field }) => (
            <>
              {seniorities.map((item) => (
                <div
                  key={item.id}
                  onClick={() => field.onChange(item.id)}
                  className="w-full"
                >
                  <ListItem
                    title={item.title}
                    description={item.description}
                    isSelected={field.value === item.id}
                  />
                </div>
              ))}
            </>
          )}
        />
      </div>
    </>
  );
}
