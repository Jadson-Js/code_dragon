import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import {
  useOnboardingOptions,
  type IOnboardingOptions,
} from "../useOnboardingOptions";
import { api } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  api: { get: vi.fn() },
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockOptions: IOnboardingOptions = {
  seniorities: [{ id: 1, name: "Junior", description: "Less than 2 years" }],
  specialties: [{ id: 1, name: "Backend", description: "Server-side" }],
  careerObjectives: [
    { id: 1, name: "Freelancer", description: "Work independently" },
  ],
  ageRanges: [{ id: 1, name: "18-24" }],
  stacks: [{ id: 1, name: "Node.js" }],
};

describe("useOnboardingOptions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should start with isLoading true and no data", () => {
    vi.mocked(api.get).mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useOnboardingOptions(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("should return data from api after successful fetch", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockOptions });
    const { result } = renderHook(() => useOnboardingOptions(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockOptions);
  });

  it("should call api.get with the correct endpoint", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockOptions });
    renderHook(() => useOnboardingOptions(), { wrapper });

    await waitFor(() =>
      expect(api.get).toHaveBeenCalledWith("/profiles/onboarding-options")
    );
  });

  it("should have isLoading false and undefined data on fetch error", async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new Error("Network error"));
    const { result } = renderHook(() => useOnboardingOptions(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBeUndefined();
  });
});
