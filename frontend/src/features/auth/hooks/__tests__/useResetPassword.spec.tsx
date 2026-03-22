import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import React from "react";
import { useResetPassword } from "../useResetPassword";
import { api } from "@/lib/api-client";

const navigateMock = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
  useParams: () => ({ token: "my-token-123" }),
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

const validPayload = {
  token: "my-token-123",
  password: "newpassword123",
  confirmPassword: "newpassword123",
};

describe("useResetPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return form and mutation", () => {
    const { result } = renderHook(() => useResetPassword(), { wrapper });

    expect(result.current.form).toBeDefined();
    expect(result.current.mutation).toBeDefined();
  });

  it("should prefill token from useParams in form default values", () => {
    const { result } = renderHook(() => useResetPassword(), { wrapper });

    expect(result.current.form.getValues("token")).toBe("my-token-123");
  });

  it("should call api.post with correct endpoint sending token and password", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useResetPassword(), { wrapper });

    act(() => {
      result.current.mutation.mutate(validPayload);
    });

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));

    expect(api.post).toHaveBeenCalledWith("/auth/reset-password", {
      token: validPayload.token,
      password: validPayload.password,
    });
  });

  it("should navigate to /auth/login on success", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useResetPassword(), { wrapper });

    act(() => {
      result.current.mutation.mutate(validPayload);
    });

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));

    expect(navigateMock).toHaveBeenCalledWith("/auth/login");
  });

  it("should show generic error toast on non-token error", async () => {
    vi.mocked(api.post).mockRejectedValueOnce({
      response: { status: 500, data: { error: "Internal server error" } },
    });
    const { result } = renderHook(() => useResetPassword(), { wrapper });

    act(() => {
      result.current.mutation.mutate(validPayload);
    });

    await waitFor(() => expect(result.current.mutation.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith(
      "Erro ao redefinir senha. Tente novamente."
    );
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("should show token error toast and navigate to forgot-password on 400 with token message", async () => {
    vi.mocked(api.post).mockRejectedValueOnce({
      response: {
        status: 400,
        data: { error: "Token inválido ou expirado" },
      },
    });
    const { result } = renderHook(() => useResetPassword(), { wrapper });

    act(() => {
      result.current.mutation.mutate(validPayload);
    });

    await waitFor(() => expect(result.current.mutation.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith(
      "Token inválido ou expirado. Solicite um novo link."
    );
    expect(navigateMock).toHaveBeenCalledWith("/auth/forgot-password");
  });
});
