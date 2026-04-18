import "reflect-metadata";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { GetQuizOptionsUseCase } from "./get-quiz-options";
// No entity imports needed for simple vocabulary items

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeUseCase() {
  const getQuizOptionsRepository = {
    execute: jest.fn<() => Promise<any>>(),
  };

  const sut = new GetQuizOptionsUseCase(getQuizOptionsRepository as any);

  return { sut, getQuizOptionsRepository };
}

function makeQuizObjective(id: number) {
  return {
    id,
    name: `Objective ${id}`,
    description: "Description",
    slug: `objective-${id}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function makeQuizSubject(id: number) {
  return {
    id,
    name: `Subject ${id}`,
    description: "Description",
    slug: `subject-${id}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function makeSeniority(id: number) {
  return {
    id,
    name: `Seniority ${id}`,
    description: "Description",
    slug: `seniority-${id}`,
    order: id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function makeSpecialty(id: number) {
  return {
    id,
    name: `Specialty ${id}`,
    description: "Description",
    slug: `specialty-${id}`,
    order: id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function makeStack(id: number) {
  return {
    id,
    name: `Stack ${id}`,
    slug: `stack-${id}`,
    usageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("GetQuizOptionsUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call the repository and return the options mapped to DTO", async () => {
    const { sut, getQuizOptionsRepository } = makeUseCase();

    const mockResponse = {
      quizObjectives: [makeQuizObjective(1)],
      quizSubjects: [makeQuizSubject(2)],
      seniorities: [makeSeniority(3)],
      specialties: [{ ...makeSpecialty(4), subjects: [] }],
      stacks: [makeStack(5)],
    };

    getQuizOptionsRepository.execute.mockResolvedValue(mockResponse);

    const result = await sut.execute();

    expect(getQuizOptionsRepository.execute).toHaveBeenCalledTimes(1);

    // Check if mapping is correct (returning only id and name)
    expect(result).toEqual({
      quizObjectives: [{ id: 1, name: "Objective 1" }],
      quizSubjects: [{ id: 2, name: "Subject 2" }],
      seniorities: [{ id: 3, name: "Seniority 3" }],
      specialties: [{ id: 4, name: "Specialty 4", subjects: [] }],
      stacks: [{ id: 5, name: "Stack 5" }],
    });
  });

  it("should return empty arrays if the repository returns no data", async () => {
    const { sut, getQuizOptionsRepository } = makeUseCase();

    getQuizOptionsRepository.execute.mockResolvedValue({
      quizObjectives: [],
      quizSubjects: [],
      seniorities: [],
      specialties: [],
      stacks: [],
    });

    const result = await sut.execute();

    expect(result).toEqual({
      quizObjectives: [],
      quizSubjects: [],
      seniorities: [],
      specialties: [],
      stacks: [],
    });
  });

  it("should map specialties with subjects correctly", async () => {
    const { sut, getQuizOptionsRepository } = makeUseCase();

    const mockResponse = {
      quizObjectives: [],
      quizSubjects: [],
      seniorities: [],
      specialties: [
        {
          ...makeSpecialty(4),
          subjects: [makeQuizSubject(2)],
        },
      ],
      stacks: [],
    };

    getQuizOptionsRepository.execute.mockResolvedValue(mockResponse);

    const result = await sut.execute();

    expect(result.specialties[0]!.subjects).toHaveLength(1);
    expect(result.specialties[0]!.subjects[0]!).toEqual({
      id: 2,
      name: "Subject 2",
    });
  });

  it("should handle specialties with missing subjects property", async () => {
    const { sut, getQuizOptionsRepository } = makeUseCase();

    const specialty = makeSpecialty(4);
    (specialty as any).subjects = undefined;

    const mockResponse = {
      quizObjectives: [],
      quizSubjects: [],
      seniorities: [],
      specialties: [specialty],
      stacks: [],
    };

    getQuizOptionsRepository.execute.mockResolvedValue(mockResponse);

    const result = await sut.execute();

    expect(result.specialties[0]!.subjects).toEqual([]);
  });

  it("should propagate errors thrown by the repository", async () => {
    const { sut, getQuizOptionsRepository } = makeUseCase();

    getQuizOptionsRepository.execute.mockRejectedValue(
      new Error("Database error"),
    );

    await expect(sut.execute()).rejects.toThrow("Database error");
  });
});
