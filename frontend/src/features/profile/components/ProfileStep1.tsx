import PageHeader from "@/components/PageHeader";
import ListItem from "./ListItem";
import { useFormContext, Controller } from "react-hook-form";
import type { ProfileSetupFormData } from "../schemas/profileSetupSchema";

interface IProps {
  seniorities?: { id: number; name: string; description: string }[];
}

export default function ProfileStep1({ seniorities }: IProps) {
  const { control } = useFormContext<ProfileSetupFormData>();

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
              {seniorities?.map((item) => (
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
