import PageHeader from "@/components/PageHeader";
import ListItem from "./ListItem";
import { useFormContext, Controller } from "react-hook-form";
import type { ProfileSetupFormData } from "../schemas/profileSetupSchema";

export default function ProfileStep3() {
  const { control } = useFormContext<ProfileSetupFormData>();

  const objectives = [
    {
      id: 1,
      title: "Primeiro Emprego",
      description: "Busco minha primeira oportunidade no mercado de tecnologia",
    },
    {
      id: 2,
      title: "Transição de Carreira",
      description: "Estou mudando de área e quero ingressar no mundo tech",
    },
    {
      id: 3,
      title: "Evolução Profissional",
      description: "Já atuo na área e busco subir de nível ou novos desafios",
    },
    {
      id: 4,
      title: "Liderança",
      description: "Busco cargos de gestão, coordenação ou referência técnica",
    },
  ];

  return (
    <>
      <PageHeader
        title="Qual seu objetivo atual?"
        description="Isso nos ajuda a sugerir a melhor trilha para você"
        className="mb-8"
      />

      <div className="flex flex-col gap-4 w-full">
        <Controller
          name="careerObjectiveId"
          control={control}
          render={({ field }) => (
            <>
              {objectives.map((item) => (
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
