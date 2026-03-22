import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import React from "react";
import { useVerifyEmail } from "../useVerifyEmail";
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

describe("useVerifyEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return mutation", () => {
    const { result } = renderHook(() => useVerifyEmail(), { wrapper });
    expect(result.current.mutation).toBeDefined();
  });

  it("should call api.post with token wrapped in object", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useVerifyEmail(), { wrapper });

    act(() => {
      result.current.mutation.mutate("abc-token-123");
    });

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));

    expect(api.post).toHaveBeenCalledWith("/auth/verify-email", {
      token: "abc-token-123",
    });
  });

  it("should not call toast.error on success (no onSuccess handler defined)", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useVerifyEmail(), { wrapper });

    act(() => {
      result.current.mutation.mutate("abc-token-123");
    });

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));

    expect(toast.error).not.toHaveBeenCalled();
  });

  it("should show error toast on failure", async () => {
    vi.mocked(api.post).mockRejectedValueOnce(new Error("Invalid token"));
    const { result } = renderHook(() => useVerifyEmail(), { wrapper });

    act(() => {
      result.current.mutation.mutate("bad-token");
    });

    await waitFor(() => expect(result.current.mutation.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Erro ao verificar e-mail");
  });
});
