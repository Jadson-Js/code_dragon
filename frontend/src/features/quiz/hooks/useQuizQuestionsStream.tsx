import { useEffect, useRef, useState } from "react";
import { env } from "@/shared/environments";

interface Question {
  id: string;
  statement: string;
  code?: string | null;
  alternatives: string[];
  correctAlternativeIndex: number;
  stackId?: number | null;
}

export function useQuizQuestionsStream(quizSessionId: string | undefined) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasReceivedQuestionsRef = useRef(false);
  const hasFinishedEventRef = useRef(false);

  useEffect(() => {
    if (!quizSessionId || quizSessionId === "generating") return;

    setIsLoading(true);
    setIsFinished(false);
    setError(null);
    hasReceivedQuestionsRef.current = false;
    hasFinishedEventRef.current = false;

    const eventSource = new EventSource(
      `${env.serverUrl}/quiz/questions/stream/${quizSessionId}`,
      { withCredentials: true },
    );

    eventSource.onmessage = (event) => {
      try {
        const newQuestions = JSON.parse(event.data) as Question[];
        if (newQuestions.length > 0) {
          hasReceivedQuestionsRef.current = true;
        }
        setQuestions((prev) => [...prev, ...newQuestions]);
        setIsLoading(false);
      } catch (err) {
        console.error("Error parsing questions data:", err);
      }
    };

    eventSource.addEventListener("finished", () => {
      // Some backends send an empty payload for custom SSE events.
      // Finishing the stream must not depend on parsing event.data.
      hasFinishedEventRef.current = true;
      setIsFinished(true);
      setIsLoading(false);
      eventSource.close();
    });

    eventSource.onerror = () => {
      if (hasFinishedEventRef.current) return;

      const isConnectionClosed = eventSource.readyState === EventSource.CLOSED;

      // Some backends close SSE without dispatching a custom "finished" event.
      // Browsers may also attempt auto-reconnect and keep readyState as CONNECTING.
      // If we already received questions, treat this as stream completion.
      if (isConnectionClosed || hasReceivedQuestionsRef.current) {
        setIsFinished(true);
        setIsLoading(false);
        eventSource.close();
        return;
      }

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
