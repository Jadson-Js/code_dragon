import PageHeader from "@/components/PageHeader";
import GridItem from "./GridItem";
import { useFormContext, Controller } from "react-hook-form";
import type { ProfileSetupFormData } from "../schemas/profileSetupSchema";
import { Monitor, Server, Layers, Smartphone } from "lucide-react";

export default function ProfileStep2() {
  const { control } = useFormContext<ProfileSetupFormData>();

  const objectives = [
    {
      id: 1,
      title: "Frontend",
      description: "Interfaces, UX/UI, React, Vue, Angular",
      Icon: Monitor,
    },
    {
      id: 2,
      title: "Backend",
      description: "APIs, Bancos de dados, Node.js, Java, Python",
      Icon: Server,
    },
    {
      id: 3,
      title: "Fullstack",
      description: "Interfaces, APIs, DBs, Node.js, React, Mobile",
      Icon: Layers,
    },
    {
      id: 4,
      title: "Mobile",
      description: "Aplicativos iOS/Android, React Native, Flutter, Swift",
      Icon: Smartphone,
    },
  ];

  return (
    <>
      <PageHeader
        title="Qual seu foco principal?"
        description="Escolha a área que mais combina com seus objetivos"
        className="mb-8"
      />

      <div className="grid grid-cols-2 gap-4 w-full ">
        <Controller
          name="careerObjectiveId"
          control={control}
          render={({ field }) => (
            <>
              {objectives.map((item) => (
                <div
                  key={item.id}
                  onClick={() => field.onChange(item.id)}
                  className="w-full flex"
                >
                  <GridItem
                    title={item.title}
                    description={item.description}
                    Icon={item.Icon}
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
