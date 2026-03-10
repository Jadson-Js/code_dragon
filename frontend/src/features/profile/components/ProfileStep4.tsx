import PageHeader from "@/components/PageHeader";
import ListItem from "./ListItem";
import { useFormContext, Controller } from "react-hook-form";
import type { ProfileSetupFormData } from "../schemas/profileSetupSchema";

export default function ProfileStep4() {
  const { control } = useFormContext<ProfileSetupFormData>();

  const ageRanges = [
    {
      id: 1,
      title: "Menos de 18 anos",
      description: "",
    },
    {
      id: 2,
      title: "18 a 24 anos",
      description: "",
    },
    {
      id: 3,
      title: "25 a 34 anos",
      description: "",
    },
    {
      id: 4,
      title: "35 a 44 anos",
      description: "",
    },
    {
      id: 5,
      title: "45 anos ou mais",
      description: "",
    },
  ];

  return (
    <>
      <PageHeader
        title="Qual sua faixa etária?"
        description="Queremos entender o seu momento para oferecer conteúdos adequados"
        className="mb-8"
      />

      <div className="flex flex-col gap-4 w-full">
        <Controller
          name="ageRangeId"
          control={control}
          render={({ field }) => (
            <>
              {ageRanges.map((item) => (
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
