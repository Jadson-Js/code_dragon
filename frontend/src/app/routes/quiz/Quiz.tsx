import { Button } from "@/components/ui/button";
import DashboardLayout from "@/features/dashboard/layout/DashboardLayout";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import type { QuizQuestionsGenerateFormData } from "@/features/dashboard/schemas/useQuizQuestionsGenerate";
import { QuizLoader } from "@/features/quiz/components/QuizLoader";
import { useQuizQuestionsStream } from "@/features/quiz/hooks/useQuizQuestionsStream";
import { useQuizQuestionsGenerate } from "@/features/quiz/hooks/useQuizQuestionsGenerate";
import { useGetQuizOptions } from "@/features/dashboard/hooks/useGetQuizOptions";
import QuizQuestionsHeader from "@/features/quiz/components/QuizQuestionsHeader";
import QuizQuestion from "@/features/quiz/components/QuizQuestion";
import { useQuizSession } from "@/features/quiz/hooks/useQuizSession";

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

  const { questions, isLoading, isFinished } =
    useQuizQuestionsStream(quiz_session_id);
  const { data: quizOptions } = useGetQuizOptions();

  const currentQuestion = questions[currentQuestionIndex];
  const stackName =
    quizOptions?.stacks.find((s) => s.id === currentQuestion?.stackId)?.name ||
    "";

  const { getSession, clearSession } = useQuizSession();

  useEffect(() => {
    if (quiz_session_id === "generating") {
      // Prefer state passed via navigate(), fall back to localStorage (user
      // returned to /generating from another page).
      let formData = state?.formData as QuizQuestionsGenerateFormData | undefined;
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
    // REMOVED: clearSession() here was stopping the session persistence 
    // as soon as the quiz started.
  }, [quiz_session_id, state, mutation, getSession]);

  if (quiz_session_id === "generating") {
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

  const isOnLastLoadedQuestion = currentQuestionIndex >= questions.length - 1;
  const isWaitingForMore = isOnLastLoadedQuestion && !isFinished;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-8 lg:py-12">
        {/* Header with Progress & Stats */}
        <QuizQuestionsHeader
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          isFinished={isFinished}
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
              selectedAlternative={selectedAlternatives[currentQuestionIndex]}
              onSelectAlternative={(idx) =>
                setSelectedAlternatives((prev) => ({
                  ...prev,
                  [currentQuestionIndex]: idx,
                }))
              }
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-20 bg-bg-2/50 rounded-2xl border border-bg-3/50">
              <span className="text-white-2 text-lg">
                Nenhuma questão disponível no momento.
              </span>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="ghost"
                className="border border-bg-3"
              >
                Voltar ao Dashboard
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end items-center gap-4 w-full sm:w-auto order-1 sm:order-2 mt-12">
          <Button
            variant="ghost"
            size="lg"
            className="flex-1 sm:flex-none border border-bg-3 text-white-1 hover:bg-bg-2 w-30"
            onClick={() =>
              setCurrentQuestionIndex((prev: number) => Math.max(0, prev - 1))
            }
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft />
            Anterior
          </Button>

          <Button
            className="flex-1 sm:flex-none transition-all min-w-[180px]"
            variant="default"
            size="lg"
            onClick={() => {
              if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex((prev: number) => prev + 1);
              } else if (isFinished) {
                // Handle finish quiz
                clearSession();
                navigate("/dashboard");
              }
            }}
            disabled={
              selectedAlternatives[currentQuestionIndex] === undefined ||
              selectedAlternatives[currentQuestionIndex] === null ||
              isWaitingForMore
            }
          >
            {isWaitingForMore ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Gerando próximas questões...
              </>
            ) : isFinished && isOnLastLoadedQuestion ? (
              "Finalizar"
            ) : (
              "Próximo"
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
