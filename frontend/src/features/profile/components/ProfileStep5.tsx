import PageHeader from "@/components/PageHeader";
import { useFormContext, Controller } from "react-hook-form";
import type { ProfileSetupFormData } from "../schemas/profileSetupSchema";
import { SearchInput } from "@/components/ui/searchInput";
import { Badge } from "@/components/ui/badge";
import React from "react";

const ALL_TECHNOLOGIES = [
  { id: 1, title: "React" },
  { id: 2, title: "TypeScript" },
  { id: 3, title: "Node.js" },
  { id: 4, title: "Next.js" },
  { id: 5, title: "Tailwind CSS" },
  { id: 6, title: "Prisma" },
  { id: 7, title: "PostgreSQL" },
  { id: 8, title: "Docker" },
  { id: 9, title: "Go" },
  { id: 10, title: "Python" },
];

const POPULAR_TECHNOLOGIES = [
  { id: 2, title: "TypeScript" },
  { id: 9, title: "Go" },
  { id: 10, title: "Python" },
  { id: 1, title: "React" },
  { id: 3, title: "Node.js" },
  { id: 4, title: "Next.js" },
  { id: 7, title: "PostgreSQL" },
  { id: 6, title: "Prisma" },
  { id: 8, title: "Docker" },
];

export default function ProfileStep5() {
  const { control } = useFormContext<ProfileSetupFormData>();
  const [searchTerm, setSearchTerm] = React.useState("");

  return (
    <>
      <PageHeader
        title="Quais tecnologias você domina ou estuda?"
        description="Selecione todas que se aplicam (mínimo 1)"
        className="mb-8"
      />

      <div className="flex flex-col gap-6 w-full">
        <Controller
          name="stacksId"
          control={control}
          render={({ field }) => {
            const selectedIds = field.value || [];

            const toggleSelection = (id: number) => {
              const newValue = selectedIds.includes(id)
                ? selectedIds.filter((item: number) => item !== id)
                : [...selectedIds, id];
              field.onChange(newValue);
              setSearchTerm("");
            };

            const selectedStacks = ALL_TECHNOLOGIES.filter((tech) =>
              selectedIds.includes(tech.id),
            );

            const filteredSearch = ALL_TECHNOLOGIES.filter(
              (tech) =>
                tech.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !selectedIds.includes(tech.id),
            ).slice(0, 8);

            const availablePopular = POPULAR_TECHNOLOGIES.filter(
              (tech) => !selectedIds.includes(tech.id),
            );

            return (
              <div className="flex flex-col gap-8">
                {/* Search Input and Dropdown */}
                <div className="relative">
                  <SearchInput
                    placeholder="Buscar tecnologia (ex: React, Java)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-bg-2 border-bg-3 focus:border-primary-1"
                  />
                  {searchTerm && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-bg-2 border border-bg-3 rounded-lg z-20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      {filteredSearch.length > 0 ? (
                        filteredSearch.map((tech) => (
                          <button
                            key={tech.id}
                            type="button"
                            className="w-full text-left px-4 py-3 hover:bg-bg-3 transition-colors text-white-1 text-sm border-b border-bg-3 last:border-b-0 cursor-pointer"
                            onClick={() => toggleSelection(tech.id)}
                          >
                            {tech.title}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-4 text-white-2 text-sm text-center">
                          Nenhuma tecnologia disponível encontrada
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Stacks Chips - Always below Search Input */}
                <div className="flex flex-wrap gap-3">
                  {selectedStacks.map((tech) => (
                    <Badge
                      key={tech.id}
                      variant="default"
                      onClick={() => toggleSelection(tech.id)}
                    >
                      {tech.title}
                    </Badge>
                  ))}
                </div>

                {/* Popular Technologies Section */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-white-2 text-sm font-medium">
                    Tecnologias populares:
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {availablePopular.map((tech) => (
                      <Badge
                        key={tech.id}
                        variant="outline"
                        onClick={() => toggleSelection(tech.id)}
                      >
                        {tech.title}
                      </Badge>
                    ))}
                    {availablePopular.length === 0 && (
                      <p className="text-white-2 text-xs italic">
                        Todas as tecnologias populares selecionadas.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          }}
        />
      </div>
    </>
  );
}
