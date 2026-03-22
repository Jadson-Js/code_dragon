import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import React from "react";
import { useResendVerification } from "../useResendVerification";
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

describe("useResendVerification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return mutation", () => {
    const { result } = renderHook(() => useResendVerification(), { wrapper });
    expect(result.current.mutation).toBeDefined();
  });

  it("should call api.post with email wrapped in object", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useResendVerification(), { wrapper });

    act(() => {
      result.current.mutation.mutate("user@test.com");
    });

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));

    expect(api.post).toHaveBeenCalledWith("/auth/resend-verification", {
      email: "user@test.com",
    });
  });

  it("should show success toast on success", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useResendVerification(), { wrapper });

    act(() => {
      result.current.mutation.mutate("user@test.com");
    });

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));

    expect(toast.success).toHaveBeenCalledWith(
      "E-mail de verificação reenviado com sucesso!"
    );
  });

  it("should show error toast on failure", async () => {
    vi.mocked(api.post).mockRejectedValueOnce(new Error("Network error"));
    const { result } = renderHook(() => useResendVerification(), { wrapper });

    act(() => {
      result.current.mutation.mutate("user@test.com");
    });

    await waitFor(() => expect(result.current.mutation.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith(
      "Erro ao reenviar e-mail de verificação"
    );
  });
});
