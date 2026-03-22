import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import React from "react";
import { useProfile } from "../useProfile";
import { api } from "@/lib/api-client";

const navigateMock = vi.fn();
const resetQueriesMock = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("@/lib/api-client", () => ({
  api: { post: vi.fn() },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  queryClient.resetQueries = resetQueriesMock;
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const profileData = {
  ageRangeId: 1,
  seniorityId: 2,
  specialtyId: 3,
  careerObjectiveId: 4,
  stacksId: [1, 2],
};

describe("useProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return form and mutation", () => {
    const { result } = renderHook(() => useProfile(), { wrapper });

    expect(result.current.form).toBeDefined();
    expect(result.current.mutation).toBeDefined();
  });

  it("should call api.post with correct endpoint and data", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useProfile(), { wrapper });

    act(() => {
      result.current.mutation.mutate(profileData);
    });

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));

    expect(api.post).toHaveBeenCalledWith("/profiles", profileData);
  });

  it("should reset auth-user query and navigate after 2 seconds on success", async () => {
    vi.useFakeTimers();
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useProfile(), { wrapper });

    act(() => {
      result.current.mutation.mutate(profileData);
    });

    // Deixa as microtasks (promises) resolverem antes dos timers
    await act(async () => {
      await Promise.resolve();
    });

    // Antes do timeout: nenhuma ação deve ter acontecido
    expect(resetQueriesMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();

    // Avança o timer de 2 segundos
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(resetQueriesMock).toHaveBeenCalledWith({
      queryKey: ["auth-user"],
    });
    expect(navigateMock).toHaveBeenCalledWith("/");
    vi.useRealTimers();
  });

  it("should show error toast on failure", async () => {
    vi.mocked(api.post).mockRejectedValueOnce(new Error("Server error"));
    const { result } = renderHook(() => useProfile(), { wrapper });

    act(() => {
      result.current.mutation.mutate(profileData);
    });

    await waitFor(() => expect(result.current.mutation.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith(
      "Erro ao realizar o setup do perfil"
    );
  });

  it("should not navigate before the 2 second timeout", async () => {
    vi.useFakeTimers();
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useProfile(), { wrapper });

    act(() => {
      result.current.mutation.mutate(profileData);
    });

    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      vi.advanceTimersByTime(1999);
    });

    expect(navigateMock).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
