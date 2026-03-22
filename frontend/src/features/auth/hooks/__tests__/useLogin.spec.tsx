import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import React from "react";
import { useLogin } from "../useLogin";
import { api } from "@/lib/api-client";

const navigateMock = vi.fn();

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
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return form and mutation", () => {
    const { result } = renderHook(() => useLogin(), { wrapper });

    expect(result.current.form).toBeDefined();
    expect(result.current.mutation).toBeDefined();
  });

  it("should call api.post with correct endpoint and data", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => {
      result.current.mutation.mutate({
        email: "user@test.com",
        password: "password123",
      });
    });

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));

    expect(api.post).toHaveBeenCalledWith("/auth/login", {
      email: "user@test.com",
      password: "password123",
    });
  });

  it("should navigate to '/' on success", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => {
      result.current.mutation.mutate({
        email: "user@test.com",
        password: "password123",
      });
    });

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));

    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("should show error toast on generic failure", async () => {
    vi.mocked(api.post).mockRejectedValueOnce({ response: { status: 500 } });
    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => {
      result.current.mutation.mutate({
        email: "user@test.com",
        password: "password123",
      });
    });

    await waitFor(() => expect(result.current.mutation.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Erro ao realizar login");
  });

  it("should resend verification and navigate to verify-email on 401 error", async () => {
    vi.mocked(api.post)
      .mockRejectedValueOnce({ response: { status: 401 } }) // login fails
      .mockResolvedValueOnce({ data: {} }); // resend-verification succeeds

    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => {
      result.current.mutation.mutate({
        email: "user@test.com",
        password: "password123",
      });
    });

    await waitFor(() => expect(result.current.mutation.isError).toBe(true));

    expect(api.post).toHaveBeenCalledWith("/auth/resend-verification", {
      email: "user@test.com",
    });
    expect(navigateMock).toHaveBeenCalledWith("/auth/verify-email", {
      state: { email: "user@test.com" },
    });
  });
});
