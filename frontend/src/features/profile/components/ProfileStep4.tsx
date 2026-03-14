import PageHeader from "@/components/PageHeader";
import ListItem from "./ListItem";
import { useFormContext, Controller } from "react-hook-form";
import type { ProfileSetupFormData } from "../schemas/profileSetupSchema";

interface ProfileStep4Props {
  ageRanges?: { id: number; name: string }[];
}

export default function ProfileStep4({ ageRanges = [] }: ProfileStep4Props) {
  const { control } = useFormContext<ProfileSetupFormData>();



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
                    title={item.name}
                    description=""
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
