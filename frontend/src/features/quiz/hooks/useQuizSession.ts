/**
 * useQuizSession
 *
 * Manages a lightweight "active quiz session" in localStorage so the user
 * can navigate away while the quiz is being generated and come back to it.
 *
 * Storage key: @code_dragon:active_quiz_session
 * Shape:
 *   { status: "generating"; route: "/quiz/session/generating"; formData: {...} }
 *   { status: "active";     route: "/quiz/session/<id>" }
 */

import { useCallback } from "react";
import type { QuizQuestionsGenerateFormData } from "@/features/dashboard/schemas/useQuizQuestionsGenerate";

const STORAGE_KEY = "@code_dragon:active_quiz_session";

export type QuizSessionState =
  | {
      status: "generating";
      route: string;
      formData: QuizQuestionsGenerateFormData;
    }
  | { status: "active"; route: string };

export function useQuizSession() {
  const getSession = useCallback((): QuizSessionState | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as QuizSessionState;
    } catch {
      return null;
    }
  }, []);

  const setGenerating = useCallback(
    (formData: QuizQuestionsGenerateFormData) => {
      const session: QuizSessionState = {
        status: "generating",
        route: "/quiz/session/generating",
        formData,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    },
    [],
  );

  const setActive = useCallback((sessionId: string) => {
    const session: QuizSessionState = {
      status: "active",
      route: `/quiz/session/${sessionId}`,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { getSession, setGenerating, setActive, clearSession };
}
