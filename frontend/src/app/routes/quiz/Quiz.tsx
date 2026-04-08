import { Button } from "@/components/ui/button";
import DashboardLayout from "@/features/dashboard/layout/DashboardLayout";
import { AlertCircle, ArrowLeft, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router";
import type { QuizQuestionsGenerateFormData } from "@/features/dashboard/schemas/useQuizQuestionsGenerate";
import { QuizLoader } from "@/features/quiz/components/QuizLoader";
import { useQuizQuestionsStream } from "@/features/quiz/hooks/useQuizQuestionsStream";
import { useQuizQuestionsGenerate } from "@/features/quiz/hooks/useQuizQuestionsGenerate";
import QuizQuestionsHeader from "@/features/quiz/components/QuizQuestionsHeader";
import QuizQuestion from "@/features/quiz/components/QuizQuestion";

export default function Quiz() {
  const { quiz_session_id } = useParams();
  const { state } = useLocation();
  const { mutation } = useQuizQuestionsGenerate();
  const hasCalled = useRef(false);

  useEffect(() => {
    if (quiz_session_id === "generating") {
      const formData = state?.formData as QuizQuestionsGenerateFormData;
      if (formData && !hasCalled.current) {
        hasCalled.current = true;
        mutation.mutate(formData);
      }
    }
  }, [quiz_session_id, state, mutation]);

  if (quiz_session_id === "generating") {
    return (
      <DashboardLayout>
        <QuizLoader />
      </DashboardLayout>
    );
  }

  const { questions } = useQuizQuestionsStream(quiz_session_id);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-8 lg:py-12">
        {/* Header with Progress & Stats */}
        <QuizQuestionsHeader />

        {/* Question Area */}
        <QuizQuestion className="mb-8" />

        <div className="flex justify-end  items-center gap-4 w-full sm:w-auto order-1 sm:order-2">
          <Button
            variant="ghost"
            size="lg"
            className="flex-1 sm:flex-none border border-bg-3 text-white-1 hover:bg-bg-2 w-30"
          >
            <ArrowLeft />
            Anterior
          </Button>

          <Button
            className="flex-1 sm:flex-none transition-all w-30"
            variant="default"
            size="lg"
          >
            Próximo
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
