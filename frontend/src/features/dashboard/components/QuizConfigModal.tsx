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
import { useGetProfile } from "../hooks/useGetProfile";
import { useGetQuizOptions } from "../hooks/useGetQuizOptions";
import { useQuizQuestionsGenerate } from "../hooks/useQuizQuestionsGenerate";
import type { QuizQuestionsGenerateFormData } from "../schemas/useQuizQuestionsGenerate";
import { Controller } from "react-hook-form";
import { SearchSelectField } from "@/components/ui/searchSelectField";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useWatch } from "react-hook-form";
import { Badge } from "@/components/ui/badge";

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
      quizSubjectIds: savedConfig?.quizSubjectIds ?? [],
    });
  }, [profile, quizOptions]);

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
            Configurar Diagnóstico
          </DialogTitle>

          <DialogDescription className="text-center max-w-md">
            Personalize seu teste técnico. Nossa IA irá gerar um desafio sob
            medida baseado nos seus critérios.
          </DialogDescription>
        </DialogHeader>

        <div className="px-8 pb-8">
          {/* Section: Carreira */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-white-1/10" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white-1/40">
                Sua Carreira
              </span>
              <div className="h-px flex-1 bg-white-1/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
              {/* Sênioridade */}
              <Controller
                control={control}
                name="seniorityId"
                defaultValue={profile?.seniorityId}
                render={({ field }) => (
                  <Field data-invalid={!!errors.seniorityId}>
                    <FieldLabel className="text-[11px] font-bold text-white-1/60 uppercase tracking-widest mb-2">
                      Sênioridade
                    </FieldLabel>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger className="bg-bg-1/50 border-white-1/10 rounded-sm h-11 focus:ring-primary-1/20">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {quizOptions?.seniorities.map((seniority) => (
                          <SelectItem
                            key={seniority.id}
                            value={String(seniority.id)}
                          >
                            {seniority.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[errors.seniorityId]} />
                  </Field>
                )}
              />

              {/* Área de atuação */}
              <Controller
                control={control}
                name="specialtyId"
                defaultValue={profile?.specialtyId}
                render={({ field }) => (
                  <Field data-invalid={!!errors.specialtyId}>
                    <FieldLabel className="text-[11px] font-bold text-white-1/60 uppercase tracking-widest mb-2">
                      Área de atuação
                    </FieldLabel>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(value) => {
                        const newId = Number(value);
                        field.onChange(newId);
                      }}
                    >
                      <SelectTrigger className="bg-bg-1/50 border-white-1/10 rounded-sm h-11 focus:ring-primary-1/20">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {quizOptions?.specialties.map((specialty) => (
                          <SelectItem
                            key={specialty.id}
                            value={String(specialty.id)}
                          >
                            {specialty.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[errors.specialtyId]} />
                  </Field>
                )}
              />
            </div>

            {/* Stacks */}
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
                  <FieldError errors={[errors.stacksId]} />
                </Field>
              )}
            />
          </div>

          {/* Section: Configurações do Diagnóstico */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-white-1/10" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white-1/40">
                Definições do Quiz
              </span>
              <div className="h-px flex-1 bg-white-1/10" />
            </div>

            {/* Objetivo do Quiz */}
            <div className="mb-6">
              <Controller
                control={control}
                name="quizObjectiveId"
                render={({ field }) => (
                  <Field data-invalid={!!errors.quizObjectiveId}>
                    <FieldLabel className="text-[11px] font-bold text-white-1/60 uppercase tracking-widest mb-2">
                      Objetivo do Quiz
                    </FieldLabel>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger className="bg-bg-1/50 border-white-1/10 rounded-sm h-11 focus:ring-primary-1/20">
                        <SelectValue placeholder="Selecione o objetivo" />
                      </SelectTrigger>
                      <SelectContent>
                        {quizOptions?.quizObjectives.map((objective) => (
                          <SelectItem
                            key={objective.id}
                            value={String(objective.id)}
                          >
                            {objective.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[errors.quizObjectiveId]} />
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
              {/* Assunto */}
              <Controller
                control={control}
                name="quizSubjectIds"
                render={({ field: subjectField }) => (
                  <Field data-invalid={!!errors.quizSubjectIds}>
                    <FieldLabel className="text-[11px] font-bold text-white-1/60 uppercase tracking-widest mb-2 leading-none">
                      Tópicos Específicos
                    </FieldLabel>

                    <Select
                      value=""
                      onValueChange={(value) => {
                        if (!value) return;
                        const current = subjectField.value ?? [];
                        if (!current.includes(Number(value))) {
                          subjectField.onChange([...current, Number(value)]);
                        }
                      }}
                    >
                      <SelectTrigger className="bg-bg-1/50 border-white-1/10 rounded-sm h-11 focus:ring-primary-1/20">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjectsBySpecialty?.map((subject) => {
                          if (subjectField.value?.includes(subject.id))
                            return null;

                          return (
                            <SelectItem
                              key={subject.id}
                              value={String(subject.id)}
                            >
                              {subject.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[errors.quizSubjectIds]} />
                  </Field>
                )}
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
                      onValueChange={(value) =>
                        field.onChange(QUANTITY_MAP[value] ?? 10)
                      }
                    >
                      <SelectTrigger className="bg-bg-1/50 border-white-1/10 rounded-sm h-11 focus:ring-primary-1/20">
                        <SelectValue placeholder="Tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Curto (10)</SelectItem>
                        <SelectItem value="medium">Médio (20)</SelectItem>
                        <SelectItem value="long">Longo (40)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError errors={[errors.quantity]} />
                  </Field>
                )}
              />
            </div>
            {/* Badges de assuntos */}
            <div className="mb-8">
              <Controller
                control={control}
                name="quizSubjectIds"
                render={({ field: subjectField }) => (
                  <div className="flex flex-wrap gap-2">
                    {subjectField.value?.map((id) => {
                      const subject = subjectsBySpecialty?.find(
                        (s) => s.id === id,
                      );
                      if (!subject) return null;
                      return (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="bg-white-1/5 hover:bg-white-1/10 border-white-1/10 text-white-2 py-1 px-3"
                          hasIcon={true}
                          onClick={() => {
                            subjectField.onChange(
                              subjectField.value?.filter((sId) => sId !== id) ??
                                [],
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
              size="lg"
              variant="outline"
              className="flex-1 rounded-sm border-white-1/10 text-white-2 hover:bg-white-1/5"
              onClick={() => onOpenChange(false)}
            >
              CANCELAR
            </Button>
            <Button
              size="lg"
              className="flex-1 gap-2 text-base font-bold shadow-lg shadow-primary-1/20 rounded-sm"
              onClick={handleSubmit((data: QuizQuestionsGenerateFormData) => {
                onOpenChange(false);
                navigate("/quiz/generate", { state: { formData: data } });
              })}
            >
              <Sparkles size={18} />
              INICIAR DIAGNÓSTICO
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
