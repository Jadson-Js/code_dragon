import PageHeader from "@/components/PageHeader";
import ListItem from "./ListItem";
import { useFormContext, Controller } from "react-hook-form";
import type { ProfileSetupFormData } from "../schemas/profileSetupSchema";

interface ProfileStep3Props {
  careerObjectives?: { id: number; name: string; description: string }[];
}

export default function ProfileStep3({
  careerObjectives = [],
}: ProfileStep3Props) {
  const { control } = useFormContext<ProfileSetupFormData>();

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
              {careerObjectives.map((item) => (
                <div
                  key={item.id}
                  onClick={() => field.onChange(item.id)}
                  className="w-full"
                >
                  <ListItem
                    title={item.name}
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
