import { useEffect, useState } from "react";
import { env } from "@/shared/environments";

interface Question {
  id: number;
  statement: string;
  code?: string;
  alternatives: string[];
  answer: string;
  stackId: number;
}

export function useQuizQuestionsStream(quizSessionId: string | undefined) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizSessionId || quizSessionId === "generating") return;

    setIsLoading(true);

    const eventSource = new EventSource(
      `${env.serverUrl}/quiz/questions/stream/${quizSessionId}`,
      { withCredentials: true },
    );

    eventSource.onmessage = (event) => {
      try {
        const newQuestions = JSON.parse(event.data) as Question[];
        setQuestions((prev) => [...prev, ...newQuestions]);
        setIsLoading(false);
      } catch (err) {
        console.error("Error parsing questions data:", err);
      }
    };

    eventSource.addEventListener("finished", (event: any) => {
      try {
        const data = JSON.parse(event.data);
        setIsFinished(true);
        setIsLoading(false);
        eventSource.close();
      } catch (err) {
        console.error("Error parsing finished event:", err);
      }
    });

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      setError("Falha na conexão com o servidor");
      setIsLoading(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [quizSessionId]);

  return { questions, isLoading, isFinished, error };
}
