import PageHeader from "@/components/PageHeader";
import { useFormContext, Controller } from "react-hook-form";
import type { ProfileSetupFormData } from "../schemas/profileSetupSchema";
import { SearchInput } from "@/components/ui/searchInput";
import { Badge } from "@/components/ui/badge";
import React from "react";

interface ProfileStep5Props {
  stacks?: { id: number; name: string }[];
}

export default function ProfileStep5({ stacks }: ProfileStep5Props) {
  const { control } = useFormContext<ProfileSetupFormData>();
  const [searchTerm, setSearchTerm] = React.useState("");

  return (
    <>
      <PageHeader
        title="Quais tecnologias você domina ou estuda?"
        description="Selecione todas que se aplicam (mínimo 1)"
        className="mb-8"
      />

      <div className="flex flex-col w-full">
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

            const safeStacks = stacks || [];

            const selectedStacks = safeStacks.filter((tech) =>
              selectedIds.includes(tech.id),
            );

            const filteredSearch = safeStacks
              .filter(
                (tech) =>
                  tech.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                  !selectedIds.includes(tech.id),
              )
              .slice(0, 8);

            const availablePopular = safeStacks
              .filter((tech) => !selectedIds.includes(tech.id))
              .slice(0, 20); // Pega as 10 primeiras (que vêm ordenadas do DB)

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
                            {tech.name}
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
                <div className="flex flex-wrap gap-2">
                  {selectedStacks.map((tech) => (
                    <Badge
                      key={tech.id}
                      variant="default"
                      onClick={() => toggleSelection(tech.id)}
                    >
                      {tech.name}
                    </Badge>
                  ))}
                </div>

                {/* Popular Technologies Section */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-white-2 text-sm font-medium">
                    Tecnologias populares:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {availablePopular.map((tech) => (
                      <Badge
                        key={tech.id}
                        variant="outline"
                        onClick={() => toggleSelection(tech.id)}
                      >
                        {tech.name}
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
