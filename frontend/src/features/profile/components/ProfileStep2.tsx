import PageHeader from "@/components/PageHeader";
import GridItem from "../../../components/ui/GridItem";
import { useFormContext, Controller } from "react-hook-form";
import type { ProfileSetupFormData } from "../schemas/profileSetupSchema";
import {
  Monitor,
  Server,
  Layers,
  Smartphone,
  Code,
  Cloud,
  Shield,
} from "lucide-react";

interface ProfileStep2Props {
  specialties?: { id: number; name: string; description: string }[];
}

export default function ProfileStep2({ specialties = [] }: ProfileStep2Props) {
  const { control } = useFormContext<ProfileSetupFormData>();

  // Mapeia ícones baseados no name/categoria retornado da API
  const getIconForSpecialty = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("front")) return Monitor;
    if (lowerName.includes("back")) return Server;
    if (lowerName.includes("full")) return Layers;
    if (lowerName.includes("mobile")) return Smartphone;
    if (lowerName.includes("devops")) return Cloud;
    if (lowerName.includes("security")) return Shield;
    return Code;
  };

  return (
    <>
      <PageHeader
        title="Qual seu foco principal?"
        description="Escolha a área que mais combina com seus objetivos"
        className="mb-8"
      />

      <div className="grid grid-cols-3 gap-4 w-full">
        <Controller
          name="specialtyId"
          control={control}
          render={({ field }) => (
            <>
              {specialties.map((item) => (
                <div
                  key={item.id}
                  onClick={() => field.onChange(item.id)}
                  className="w-full flex"
                >
                  <GridItem
                    title={item.name}
                    description={item.description}
                    Icon={getIconForSpecialty(item.name)}
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
