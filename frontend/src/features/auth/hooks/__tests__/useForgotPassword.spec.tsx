import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import React from "react";
import { useForgotPassword } from "../useForgotPassword";
import { api } from "@/lib/api-client";

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
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useForgotPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return form and mutation", () => {
    const { result } = renderHook(() => useForgotPassword(), { wrapper });

    expect(result.current.form).toBeDefined();
    expect(result.current.mutation).toBeDefined();
  });

  it("should call api.post with correct endpoint and data on mutate", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useForgotPassword(), { wrapper });

    act(() => {
      result.current.mutation.mutate({ email: "user@test.com" });
    });

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));

    expect(api.post).toHaveBeenCalledWith("/auth/forgot-password", {
      email: "user@test.com",
    });
  });

  it("should show success toast on successful mutation", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useForgotPassword(), { wrapper });

    act(() => {
      result.current.mutation.mutate({ email: "user@test.com" });
    });

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));

    expect(toast.success).toHaveBeenCalledWith(
      "E-mail de recuperação enviado com sucesso!"
    );
  });

  it("should show error toast on failed mutation", async () => {
    vi.mocked(api.post).mockRejectedValueOnce(new Error("Network error"));
    const { result } = renderHook(() => useForgotPassword(), { wrapper });

    act(() => {
      result.current.mutation.mutate({ email: "user@test.com" });
    });

    await waitFor(() => expect(result.current.mutation.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith(
      "Erro ao enviar e-mail de recuperação"
    );
  });
});
