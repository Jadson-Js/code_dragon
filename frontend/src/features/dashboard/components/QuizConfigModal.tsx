import { Activity, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { useGetProfile } from "../hooks/useGetProfile";
import { useGetQuizOptions } from "../hooks/useGetQuizOptions";
import { useQuizQuestionsGenerate } from "../hooks/useQuizQuestionsGenerate";
import { Controller, useWatch } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { SearchSelectField } from "@/components/ui/searchSelectField";
import { useEffect } from "react";

const QUANTITY_MAP: Record<string, number> = {
  short: 10,
  medium: 20,
  long: 40,
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuizConfigModal({ open, onOpenChange }: Props) {
  const { data: profile } = useGetProfile();
  const { data: quizOptions } = useGetQuizOptions();
  const { form, mutation } = useQuizQuestionsGenerate();

  const { control, handleSubmit, getValues, setValue } = form;

  // Remove assuntos selecionados que não pertencem à nova especialidade
  function cleanSubjectsForSpecialty(newSpecialtyId: number) {
    const currentSubjectIds = getValues("quizSubjectIds") ?? [];
    const validSubjectIds = currentSubjectIds.filter((id: number) => {
      const subject = quizOptions?.quizSubjects.find((s) => s.id === id);
      return subject?.specialties.some((s) => s.id === newSpecialtyId);
    });
    if (validSubjectIds.length !== currentSubjectIds.length) {
      setValue("quizSubjectIds", validSubjectIds);
    }
  }

  useEffect(() => {
    if (!profile) return;
    form.reset({
      seniorityId: profile.seniorityId,
      specialtyId: profile.specialtyId,
      stacksId: profile.stackIds ?? [],
    });
  }, [profile]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
        <DialogHeader className="items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary-1/20 rounded-full blur-xl scale-150" />
            <div className="relative w-14 h-14 rounded-full bg-primary-1/10 border border-primary-1/20 flex items-center justify-center">
              <Activity className="text-primary-1" size={28} />
            </div>
          </div>

          <DialogTitle>Configurar Diagnóstico</DialogTitle>
          <DialogDescription>
            Defina os parâmetros do teste. As perguntas serão geradas pela IA
            com base nas suas escolhas.
          </DialogDescription>
        </DialogHeader>

        {/* Objetivo do Quiz */}
        <Controller
          control={control}
          name="quizObjectiveId"
          render={({ field }) => (
            <Field>
              <FieldLabel className="text-sm font-semibold text-white-1 opacity-80 uppercase tracking-wider">
                Objetivo do Quiz
              </FieldLabel>
              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o objetivo" />
                </SelectTrigger>
                <SelectContent>
                  {quizOptions?.quizObjectives.map((objective) => (
                    <SelectItem key={objective.id} value={String(objective.id)}>
                      {objective.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        {/* Sênioridade */}
        <Controller
          control={control}
          name="seniorityId"
          defaultValue={profile?.seniorityId}
          render={({ field }) => (
            <Field>
              <FieldLabel className="text-sm font-semibold text-white-1 opacity-80 uppercase tracking-wider">
                Sênioridade
              </FieldLabel>
              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a sênioridade" />
                </SelectTrigger>
                <SelectContent>
                  {quizOptions?.seniorities.map((seniority) => (
                    <SelectItem key={seniority.id} value={String(seniority.id)}>
                      {seniority.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        {/* Área de atuação */}
        <Controller
          control={control}
          name="specialtyId"
          defaultValue={profile?.specialtyId}
          render={({ field }) => (
            <Field>
              <FieldLabel className="text-sm font-semibold text-white-1 opacity-80 uppercase tracking-wider">
                Área de atuação
              </FieldLabel>
              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={(value) => {
                  const newId = Number(value);
                  cleanSubjectsForSpecialty(newId);
                  field.onChange(newId);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a área" />
                </SelectTrigger>
                <SelectContent>
                  {quizOptions?.specialties.map((specialty) => (
                    <SelectItem key={specialty.id} value={String(specialty.id)}>
                      {specialty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        {/* Assunto (multi-select) */}
        <Controller
          control={control}
          name="quizSubjectIds"
          render={({ field: subjectField }) => (
            <Controller
              control={control}
              name="specialtyId"
              render={({ field: specialtyField }) => (
                <Field>
                  <FieldLabel className="text-sm font-semibold text-white-1 opacity-80 uppercase tracking-wider">
                    Assunto
                  </FieldLabel>

                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (!value) return;
                      const current = subjectField.value ?? [];
                      subjectField.onChange([...current, Number(value)]);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o assunto" />
                    </SelectTrigger>
                    <SelectContent>
                      {quizOptions?.quizSubjects
                        .filter(
                          (subject) =>
                            !subjectField.value?.includes(subject.id) &&
                            subject.specialties.some(
                              (specialty) =>
                                specialty.id === specialtyField.value,
                            ),
                        )
                        .map((subject) => (
                          <SelectItem
                            key={subject.id}
                            value={String(subject.id)}
                          >
                            {subject.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {quizOptions?.quizSubjects
                      .filter(
                        (subject) =>
                          subjectField.value?.includes(subject.id) &&
                          subject.specialties.some(
                            (specialty) =>
                              specialty.id === specialtyField.value,
                          ),
                      )
                      .map((subject) => (
                        <Badge
                          key={subject.id}
                          hasIcon={true}
                          onClick={() => {
                            const current = subjectField.value ?? [];
                            subjectField.onChange(
                              current.filter((id: number) => id !== subject.id),
                            );
                          }}
                        >
                          {subject.name}
                        </Badge>
                      ))}
                  </div>
                </Field>
              )}
            />
          )}
        />

        {/* Stacks */}
        <Controller
          control={control}
          name="stacksId"
          render={({ field }) => (
            <Field>
              <FieldLabel className="text-sm font-semibold text-white-1 opacity-80 uppercase tracking-wider">
                Quais stacks serão avaliadas
              </FieldLabel>
              <SearchSelectField
                items={quizOptions?.stacks ?? []}
                value={field.value ?? []}
                onChange={field.onChange}
                searchPlaceholder="Buscar tecnologia (ex: React, Java)..."
                popularLabel="Tecnologias populares:"
                emptyMessage="Nenhuma tecnologia disponível encontrada"
                className="bg-bg-1 border-bg-3 focus:border-primary-1"
                showPopular={false}
              />
            </Field>
          )}
        />

        {/* Tamanho do quiz */}
        <Controller
          control={control}
          name="quantity"
          render={({ field }) => (
            <Field>
              <FieldLabel className="text-sm font-semibold text-white-1 opacity-80 uppercase tracking-wider">
                Tamanho do quiz
              </FieldLabel>
              <Select
                value={
                  Object.entries(QUANTITY_MAP).find(
                    ([, v]) => v === field.value,
                  )?.[0] ?? ""
                }
                onValueChange={(value) =>
                  field.onChange(QUANTITY_MAP[value] ?? 10)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tamanho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Curto (10 questões)</SelectItem>
                  <SelectItem value="medium">Médio (20 questões)</SelectItem>
                  <SelectItem value="long">Longo (40 questões)</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        {/* Salvar configuração */}
        <Controller
          control={control}
          name="saveInProfile"
          render={({ field }) => (
            <label className="flex items-start gap-2 p-4 rounded-sm bg-white-1/5 border border-white-1/5 cursor-pointer hover:bg-white-2/15 transition-colors">
              <Checkbox
                id="save-config"
                className="mt-1 cursor-pointer"
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
              />
              <div className="space-y-1">
                <p className="text-white-1 font-bold">
                  Salvar configuração no meu perfil
                </p>
                <p className="text-white-2 typ-caption">
                  Use estas configurações como padrão para próximos testes
                </p>
              </div>
            </label>
          )}
        />

        <div className="flex gap-4 mt-2">
          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            disabled={mutation.isPending}
            onClick={() => onOpenChange(false)}
          >
            CANCELAR
          </Button>
          <Button
            size="lg"
            className="flex-1 gap-2 text-base font-bold shadow-lg shadow-primary-1/20"
            disabled={mutation.isPending}
            onClick={handleSubmit((data) => mutation.mutate(data))}
          >
            {mutation.isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Sparkles size={18} />
            )}
            {mutation.isPending ? "GERANDO..." : "INICIAR"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
