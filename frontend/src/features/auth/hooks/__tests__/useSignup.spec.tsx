import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import React from "react";
import { useSignup } from "../useSignup";
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

const signupData = {
  name: "Admin User",
  email: "user@test.com",
  password: "password123",
};

describe("useSignup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return form and mutation", () => {
    const { result } = renderHook(() => useSignup(), { wrapper });

    expect(result.current.form).toBeDefined();
    expect(result.current.mutation).toBeDefined();
  });

  it("should call api.post with correct endpoint and data", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useSignup(), { wrapper });

    act(() => {
      result.current.mutation.mutate(signupData);
    });

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));

    expect(api.post).toHaveBeenCalledWith("/auth/signup", signupData);
  });

  it("should navigate to verify-email with email in state on success", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useSignup(), { wrapper });

    act(() => {
      result.current.mutation.mutate(signupData);
    });

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));

    expect(navigateMock).toHaveBeenCalledWith("/auth/verify-email", {
      state: { email: signupData.email },
    });
  });

  it("should reset form on success", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useSignup(), { wrapper });

    act(() => {
      result.current.form.setValue("name", "Admin User");
      result.current.mutation.mutate(signupData);
    });

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));

    expect(result.current.form.getValues("name")).toBeUndefined();
  });

  it("should show error toast on failure", async () => {
    vi.mocked(api.post).mockRejectedValueOnce(new Error("Network error"));
    const { result } = renderHook(() => useSignup(), { wrapper });

    act(() => {
      result.current.mutation.mutate(signupData);
    });

    await waitFor(() => expect(result.current.mutation.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Erro ao criar conta");
  });
});
