import React from "react";
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
import { Field, FieldLabel } from "@/components/ui/field";
import { SearchSelectField } from "@/components/ui/searchSelectField";
import { useGetProfile } from "../hooks/useGetProfile";
import { useGetQuizOptions } from "../hooks/useGetQuizOptions";
import { useQuizQuestionsGenerate } from "../hooks/useQuizQuestionsGenerate";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuizConfigModal({ open, onOpenChange }: Props) {
  const { data: profile } = useGetProfile();
  const { data: quizOptions } = useGetQuizOptions();
  const { form, mutation } = useQuizQuestionsGenerate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

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

        <Field>
          <FieldLabel className="text-sm font-semibold text-white-1 opacity-80 uppercase tracking-wider">
            Objetivo do Quiz
          </FieldLabel>

          <Select>
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

        <Field>
          <FieldLabel className="text-sm font-semibold text-white-1 opacity-80 uppercase tracking-wider">
            Sênioridade
          </FieldLabel>
          <Select
            defaultValue={
              profile?.seniorityId ? String(profile.seniorityId) : undefined
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a sênioridade" />
            </SelectTrigger>
            <SelectContent>
              {quizOptions?.seniorities.map((seniority) => {
                return (
                  <SelectItem key={seniority.id} value={String(seniority.id)}>
                    {seniority.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel className="text-sm font-semibold text-white-1 opacity-80 uppercase tracking-wider">
            Área de atuação
          </FieldLabel>
          <Select
            defaultValue={
              selectedSpecialty ? String(selectedSpecialty) : undefined
            }
            onValueChange={(value) => setSelectedSpecialty(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a área" />
            </SelectTrigger>
            <SelectContent>
              {quizOptions?.specialties.map((specialty) => {
                return (
                  <SelectItem key={specialty.id} value={String(specialty.id)}>
                    {specialty.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel className="text-sm font-semibold text-white-1 opacity-80 uppercase tracking-wider">
            Assunto
          </FieldLabel>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o assunto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Estrutua de dados</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel className="text-sm font-semibold text-white-1 opacity-80 uppercase tracking-wider">
            Quais stacks serão avaliadas
          </FieldLabel>
          <SearchSelectField
            items={quizOptions?.stacks ?? []}
            value={selectedStackIds}
            onChange={setSelectedStackIds}
            searchPlaceholder="Buscar tecnologia (ex: React, Java)..."
            popularLabel="Tecnologias populares:"
            emptyMessage="Nenhuma tecnologia disponível encontrada"
            className="bg-bg-1 border-bg-3 focus:border-primary-1"
            showPopular={false}
          />
        </Field>

        <Field>
          <FieldLabel className="text-sm font-semibold text-white-1 opacity-80 uppercase tracking-wider">
            Tamanho do quiz
          </FieldLabel>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Longo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Curto (10 questões)</SelectItem>
              <SelectItem value="medium">Médio (20 questões)</SelectItem>
              <SelectItem value="long">Longo (40 questões)</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <label className="flex items-start gap-2 p-4 rounded-sm bg-white-1/5 border border-white-1/5 cursor-pointer hover:bg-white-2/15 transition-colors">
          <Checkbox id="save-config" className="mt-1 cursor-pointer" />
          <div className="space-y-1">
            <p className="text-white-1 font-bold">
              Salvar configuração no meu perfil
            </p>
            <p className="text-white-2 typ-caption">
              Use estas configurações como padrão para próximos testes
            </p>
          </div>
        </label>

        <div className="flex gap-4 mt-2">
          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            CANCELAR
          </Button>
          <Button
            size="lg"
            className="flex-1 gap-2 text-base font-bold shadow-lg shadow-primary-1/20"
          >
            <Sparkles size={18} />
            INICIAR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
