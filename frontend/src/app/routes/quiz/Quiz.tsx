import { Button } from "@/components/ui/button";
import DashboardLayout from "@/features/dashboard/layout/DashboardLayout";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import type { QuizQuestionsGenerateFormData } from "@/features/dashboard/schemas/useQuizQuestionsGenerate";
import { QuizLoader } from "@/features/quiz/components/QuizLoader";
import { useQuizQuestionsStream } from "@/features/quiz/hooks/useQuizQuestionsStream";
import { useQuizQuestionsGenerate } from "@/features/quiz/hooks/useQuizQuestionsGenerate";
import { useGetQuizOptions } from "@/features/dashboard/hooks/useGetQuizOptions";
import QuizQuestionsHeader from "@/features/quiz/components/QuizQuestionsHeader";
import QuizQuestion from "@/features/quiz/components/QuizQuestion";
import { useQuizSession } from "@/features/quiz/hooks/useQuizSession";
import QuizExitModal from "@/features/quiz/components/QuizExitModal";

type QuizFallbackProps = {
  message: string;
  details?: string;
  actionLabel: string;
  actionVariant?: "default" | "ghost";
  onAction: () => void;
};

function QuizFallback({
  message,
  details,
  actionLabel,
  actionVariant = "default",
  onAction,
}: QuizFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4 py-10 px-6 bg-bg-2/50 rounded-2xl border border-bg-3/50">
        <span className="text-white-1 text-lg font-medium text-center">
          {message}
        </span>
        {details ? (
          <span className="text-white-2 text-sm text-center">{details}</span>
        ) : null}
        <Button
          onClick={onAction}
          variant={actionVariant}
          className={actionVariant === "ghost" ? "border border-bg-3" : undefined}
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}

export default function Quiz() {
  const { quiz_session_id } = useParams();
  const { state } = useLocation();
  const { mutation } = useQuizQuestionsGenerate();
  const navigate = useNavigate();
  const hasCalled = useRef(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAlternatives, setSelectedAlternatives] = useState<
    Record<number, number>
  >({});
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const { questions, isLoading, isFinished, error } =
    useQuizQuestionsStream(quiz_session_id);
  const { data: quizOptions } = useGetQuizOptions();

  const { getSession, clearSession } = useQuizSession();
  const isGeneratingRoute = quiz_session_id === "generating";

  const goBackToDashboard = useCallback(() => {
    clearSession();
    navigate("/");
  }, [clearSession, navigate]);

  useEffect(() => {
    if (isGeneratingRoute) {
      // Prefer state passed via navigate(), fall back to localStorage (user
      // returned to /generating from another page).
      let formData = state?.formData as
        | QuizQuestionsGenerateFormData
        | undefined;
      if (!formData) {
        const session = getSession();
        if (session?.status === "generating") {
          formData = session.formData;
        }
      }
      if (formData && !hasCalled.current) {
        hasCalled.current = true;
        mutation.mutate(formData);
      }
    }
  }, [isGeneratingRoute, state, mutation, getSession]);

  const currentQuestion = questions[currentQuestionIndex];
  const stackName = useMemo(
    () =>
      quizOptions?.stacks.find((stack) => stack.id === currentQuestion?.stackId)
        ?.name || "",
    [quizOptions?.stacks, currentQuestion?.stackId],
  );

  const isOnLastLoadedQuestion = currentQuestionIndex >= questions.length - 1;
  const isWaitingForMore = isOnLastLoadedQuestion && !isFinished;
  const currentSelection = selectedAlternatives[currentQuestionIndex];
  const canGoPrevious = currentQuestionIndex > 0;
  const canGoNext =
    currentSelection !== undefined &&
    currentSelection !== null &&
    !isWaitingForMore;
  const nextButtonLabel =
    isWaitingForMore
      ? "Gerando próximas questões..."
      : isFinished && isOnLastLoadedQuestion
        ? "Finalizar"
        : "Próximo";

  const handleExit = useCallback(() => {
    setIsExitModalOpen(true);
  }, []);

  const confirmExit = useCallback(() => {
    goBackToDashboard();
  }, [goBackToDashboard]);

  const handlePrevious = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      return;
    }

    if (isFinished) {
      goBackToDashboard();
    }
  }, [currentQuestionIndex, questions.length, isFinished, goBackToDashboard]);

  const handleSelectAlternative = useCallback((idx: number) => {
    setSelectedAlternatives((prev) => ({
      ...prev,
      [currentQuestionIndex]: idx,
    }));
  }, [currentQuestionIndex]);

  if (isGeneratingRoute) {
    return (
      <DashboardLayout>
        <QuizLoader />
      </DashboardLayout>
    );
  }

  if (isLoading && questions.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white-2 animate-pulse font-medium">
            Carregando questões do quiz...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && questions.length === 0) {
    return (
      <DashboardLayout>
        <QuizFallback
          message="Esta sessao de quiz nao existe mais ou ficou indisponivel."
          details={error}
          actionLabel="Voltar ao Dashboard"
          onAction={goBackToDashboard}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-8 lg:py-12">
        {/* Header with Progress & Stats */}
        <QuizQuestionsHeader
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          isFinished={isFinished}
          onExit={handleExit}
        />

        {/* Question Area */}
        <div className="min-h-[400px]">
          {questions.length > 0 ? (
            <QuizQuestion
              key={currentQuestion?.id}
              statement={currentQuestion?.statement || ""}
              code={currentQuestion?.code}
              alternatives={currentQuestion?.alternatives || []}
              stack={stackName}
              selectedAlternative={currentSelection}
              onSelectAlternative={handleSelectAlternative}
            />
          ) : (
            <QuizFallback
              message="Nenhuma questão disponível no momento."
              actionLabel="Voltar ao Dashboard"
              actionVariant="ghost"
              onAction={goBackToDashboard}
            />
          )}
        </div>

        <div className="flex justify-end items-center gap-4 w-full sm:w-auto order-1 sm:order-2 mt-12">
          <Button
            variant="ghost"
            size="lg"
            className="flex-1 sm:flex-none border border-bg-3 text-white-1 hover:bg-bg-2 w-30"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
          >
            <ArrowLeft />
            Anterior
          </Button>

          <Button
            className="flex-1 sm:flex-none transition-all min-w-[180px]"
            variant="default"
            size="lg"
            onClick={handleNext}
            disabled={!canGoNext}
          >
            {isWaitingForMore ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                {nextButtonLabel}
              </>
            ) : (
              nextButtonLabel
            )}
          </Button>
        </div>

        <QuizExitModal
          open={isExitModalOpen}
          onOpenChange={setIsExitModalOpen}
          onConfirm={confirmExit}
        />
      </div>
    </DashboardLayout>
  );
}
