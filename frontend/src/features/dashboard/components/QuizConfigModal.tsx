import { Activity, Sparkles } from "lucide-react";
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
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { SearchSelectField } from "@/components/ui/searchSelectField";
import { Badge } from "@/components/ui/badge";
import { Controller, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate } from "react-router";

import { useGetProfile } from "../hooks/useGetProfile";
import { useGetQuizOptions } from "../hooks/useGetQuizOptions";
import type { QuizQuestionsGenerateFormData } from "../schemas/useQuizQuestionsGenerate";
import { useQuizQuestionsGenerate } from "@/features/quiz/hooks/useQuizQuestionsGenerate";

// --- Constantes ---
const QUANTITY_MAP: Record<string, number> = {
  short: 10,
  medium: 20,
  long: 30,
};

// --- Componentes Auxiliares para Limpar o Boilerplate ---

const SectionDivider = ({ title }: { title: string }) => (
  <div className="flex items-center gap-4 mb-6">
    <div className="h-px flex-1 bg-white-1/10" />
    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white-1/40">
      {title}
    </span>
    <div className="h-px flex-1 bg-white-1/10" />
  </div>
);

// Wrapper genérico para Selects que lidam com IDs numéricos
const SelectNumberField = ({
  control,
  name,
  label,
  options,
  placeholder = "Selecione",
  error,
  onChangeExternal,
}: any) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <Field data-invalid={!!error}>
        <FieldLabel className="text-[11px] font-bold text-white-1/60 uppercase tracking-widest mb-2 leading-none">
          {label}
        </FieldLabel>
        <Select
          value={field.value ? String(field.value) : ""}
          onValueChange={(val) => {
            const numVal = Number(val);
            if (onChangeExternal) {
              onChangeExternal(numVal, field.onChange);
            } else {
              field.onChange(numVal);
            }
          }}
        >
          <SelectTrigger className="bg-bg-1/50 border-white-1/10 rounded-sm h-11 focus:ring-primary-1/20 transition-all">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options?.map((opt: any) => (
              <SelectItem key={opt.id} value={String(opt.id)}>
                {opt.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError errors={error ? [error] : undefined} />
      </Field>
    )}
  />
);

// Wrapper para Select que age como MultiSelect (para adicionar assuntos)
const SelectMultiNumberField = ({
  control,
  name,
  label,
  options,
  placeholder = "Selecione",
  error,
}: any) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <Field data-invalid={!!error}>
        <FieldLabel className="text-[11px] font-bold text-white-1/60 uppercase tracking-widest mb-2 leading-none">
          {label}
        </FieldLabel>
        <Select
          value=""
          onValueChange={(val) => {
            if (!val) return;
            const current = field.value ?? [];
            const numVal = Number(val);
            if (!current.includes(numVal)) {
              field.onChange([...current, numVal]);
            }
          }}
        >
          <SelectTrigger className="bg-bg-1/50 border-white-1/10 rounded-sm h-11 focus:ring-primary-1/20 transition-all">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options?.map((opt: any) => {
              if (field.value?.includes(opt.id)) return null;
              return (
                <SelectItem key={opt.id} value={String(opt.id)}>
                  {opt.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <FieldError errors={error ? [error] : undefined} />
      </Field>
    )}
  />
);

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuizConfigModal({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const { data: profile } = useGetProfile();
  const { data: quizOptions } = useGetQuizOptions();
  const { form } = useQuizQuestionsGenerate();

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = form;

  const watchedSpecialtyId = useWatch({
    control,
    name: "specialtyId",
  });

  const subjectsBySpecialty =
    quizOptions?.specialties.find(
      (specialty) => Number(specialty.id) === Number(watchedSpecialtyId),
    )?.subjects || [];

  useEffect(() => {
    if (!profile) return;

    let savedConfig: any = null;
    try {
      const saved = localStorage.getItem("@code_dragon:quiz_config");
      if (saved) {
        savedConfig = JSON.parse(saved);
      }
    } catch (e) {
      // Ignorar erro de parse
    }

    form.reset({
      seniorityId: profile.seniorityId,
      specialtyId: profile.specialtyId,
      stacksId: profile.stackIds ?? [],
      saveInProfile: !!savedConfig,
      quantity: savedConfig?.quantity ?? 10,
      quizObjectiveId: savedConfig?.quizObjectiveId ?? 0,
      quizSubjectsId: savedConfig?.quizSubjectsId ?? [],
    });
  }, [profile, quizOptions, form]);

  const handleSpecialtyChange = (
    newId: number,
    onChange: (val: number) => void,
  ) => {
    onChange(newId);

    const newSpecialty = quizOptions?.specialties.find(
      (spec) => spec.id === newId,
    );

    if (newSpecialty) {
      const validSubjectIds = newSpecialty.subjects.map((s) => s.id);
      const currentSubjects = getValues("quizSubjectsId") || [];
      const filteredSubjects = currentSubjects.filter((id: number) =>
        validSubjectIds.includes(id),
      );
      setValue("quizSubjectsId", filteredSubjects);
    }
  };

  const onSubmit = (data: QuizQuestionsGenerateFormData) => {
    onOpenChange(false);
    navigate("/quiz/session/generating", {
      state: { formData: data },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar p-0 border-white-1/10 bg-bg-2">
        <DialogHeader className="items-center p-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-primary-1/20 rounded-full blur-xl scale-150" />
            <div className="relative w-16 h-16 rounded-full bg-primary-1/10 border border-primary-1/20 flex items-center justify-center shadow-inner">
              <Activity className="text-primary-1" size={32} />
            </div>
          </div>

          <DialogTitle className="text-2xl font-bold tracking-tight">
            Configurar Quiz
          </DialogTitle>

          <DialogDescription className="text-center max-w-md">
            Personalize seu desafio técnico. Vou gerar perguntas sob medida para
            o que você quer testar agora.
          </DialogDescription>
        </DialogHeader>

        <div className="px-8 pb-8">
          {/* Section: Carreira */}
          <div className="mb-10">
            <SectionDivider title="Sua Carreira" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
              <SelectNumberField
                control={control}
                name="seniorityId"
                label="Sênioridade"
                options={quizOptions?.seniorities}
                error={errors.seniorityId}
              />

              <SelectNumberField
                control={control}
                name="specialtyId"
                label="Área de atuação"
                options={quizOptions?.specialties}
                error={errors.specialtyId}
                onChangeExternal={handleSpecialtyChange}
              />
            </div>

            <Controller
              control={control}
              name="stacksId"
              render={({ field }) => (
                <Field data-invalid={!!errors.stacksId}>
                  <FieldLabel className="text-[11px] font-bold text-white-1/60 uppercase tracking-widest mb-2">
                    Quais stacks serão avaliadas
                  </FieldLabel>
                  <SearchSelectField
                    items={quizOptions?.stacks ?? []}
                    value={field.value ?? []}
                    onChange={field.onChange}
                    searchPlaceholder="Ex: React, Java, AWS..."
                    popularLabel="Populares"
                    emptyMessage="Nenhuma encontrada"
                    className="bg-bg-1/50 border-white-1/10 rounded-sm focus:border-primary-1/50"
                    showPopular={false}
                  />
                  <FieldError
                    errors={errors.stacksId ? [errors.stacksId] : undefined}
                  />
                </Field>
              )}
            />
          </div>

          {/* Section: Configurações do Diagnóstico */}
          <div className="mb-10">
            <SectionDivider title="Definições do Quiz" />

            <div className="mb-6">
              <SelectNumberField
                control={control}
                name="quizObjectiveId"
                label="Objetivo do Quiz"
                options={quizOptions?.quizObjectives}
                placeholder="Selecione o objetivo"
                error={errors.quizObjectiveId}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
              <SelectMultiNumberField
                control={control}
                name="quizSubjectsId"
                label="Tópicos Específicos"
                options={subjectsBySpecialty}
                error={errors.quizSubjectsId}
              />

              {/* Tamanho do quiz */}
              <Controller
                control={control}
                name="quantity"
                render={({ field }) => (
                  <Field data-invalid={!!errors.quantity}>
                    <FieldLabel className="text-[11px] font-bold text-white-1/60 uppercase tracking-widest mb-2 leading-none">
                      Quantidade
                    </FieldLabel>
                    <Select
                      value={
                        Object.entries(QUANTITY_MAP).find(
                          ([, v]) => v === field.value,
                        )?.[0] ?? ""
                      }
                      onValueChange={(val) =>
                        field.onChange(QUANTITY_MAP[val] ?? 10)
                      }
                    >
                      <SelectTrigger className="bg-bg-1/50 border-white-1/10 rounded-sm h-11 focus:ring-primary-1/20 transition-all">
                        <SelectValue placeholder="Tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Curto (10)</SelectItem>
                        <SelectItem value="medium">Médio (20)</SelectItem>
                        <SelectItem value="long">Longo (30)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError
                      errors={errors.quantity ? [errors.quantity] : undefined}
                    />
                  </Field>
                )}
              />
            </div>

            {/* Badges de Assuntos Selecionados */}
            <div className="mb-8">
              <Controller
                control={control}
                name="quizSubjectsId"
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {field.value?.map((id: number) => {
                      const subject = subjectsBySpecialty?.find(
                        (s: any) => s.id === id,
                      );
                      if (!subject) return null;
                      return (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="bg-white-1/5 hover:bg-white-1/10 border-white-1/10 text-white-2 py-1 px-3"
                          hasIcon={true}
                          onClick={() => {
                            field.onChange(
                              field.value?.filter(
                                (sId: number) => sId !== id,
                              ) ?? [],
                            );
                          }}
                        >
                          {subject.name}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              />
            </div>

            {/* Salvar configuração */}
            <div className="mb-10">
              <Controller
                control={control}
                name="saveInProfile"
                render={({ field }) => (
                  <label className="group flex items-center gap-4 p-4 rounded-sm bg-white-1/5 border border-white-1/10 cursor-pointer hover:bg-white-2/10 transition-all">
                    <Checkbox
                      id="save-config"
                      className="cursor-pointer border-white-1/20 data-[state=checked]:bg-primary-1 data-[state=checked]:border-primary-1"
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                    <div className="flex-1">
                      <p className="text-white-1 font-bold text-sm">
                        Lembrar minhas preferências
                      </p>
                      <p className="text-white-2 text-xs opacity-60">
                        Sempre abrir este modal com estas escolhas
                        pré-definidas.
                      </p>
                    </div>
                  </label>
                )}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="flex-1 rounded-sm border-white-1/10 text-white-2 hover:bg-white-1/5"
              onClick={() => onOpenChange(false)}
            >
              CANCELAR
            </Button>
            <Button
              type="button"
              size="lg"
              className="flex-1 gap-2 text-base font-bold shadow-lg shadow-primary-1/20 rounded-sm"
              onClick={handleSubmit(onSubmit)}
            >
              <Sparkles size={18} />
              INICIAR QUIZ
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
