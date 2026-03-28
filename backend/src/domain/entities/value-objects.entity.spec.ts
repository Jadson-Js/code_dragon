import { describe, expect, it } from "@jest/globals";
import { QuizSubject } from "./quiz-subject.entity";
import { QuizObjective } from "./quiz-objective.entity";
import { Stack } from "./stack.entity";
import { Specialty } from "./specialty.entity";
import { Seniority } from "./seniority.entity";
import { AgeRange } from "./age-range.entity";
import { CareerObjective } from "./career-objective.entity";

// ─── QuizSubject ──────────────────────────────────────────────────────────────

describe("QuizSubject entity", () => {
  it("should create with all props", () => {
    const now = new Date("2024-01-01");
    const q = QuizSubject.create({
      id: 1,
      name: "CSS",
      description: "Styling",
      slug: "css",
      createdAt: now,
      updatedAt: now,
    });

    expect(q.id).toBe(1);
    expect(q.name).toBe("CSS");
    expect(q.description).toBe("Styling");
    expect(q.slug).toBe("css");
    expect(q.createdAt).toBe(now);
    expect(q.updatedAt).toBe(now);
  });

  it("should default id to undefined when omitted", () => {
    const q = QuizSubject.create({
      name: "CSS",
      description: "Styling",
      slug: "css",
    });
    expect(q.id).toBeUndefined();
  });

  it("should default dates to now when omitted", () => {
    const before = new Date();
    const q = QuizSubject.create({ name: "CSS", description: "d", slug: "s" });
    const after = new Date();
    expect(q.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(q.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    expect(q.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(q.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });
});

// ─── QuizObjective ────────────────────────────────────────────────────────────

describe("QuizObjective entity", () => {
  it("should create with all props", () => {
    const now = new Date("2024-01-01");
    const q = QuizObjective.create({
      id: 5,
      name: "Master JS",
      description: "Obj",
      slug: "master-js",
      createdAt: now,
      updatedAt: now,
    });
    expect(q.id).toBe(5);
    expect(q.name).toBe("Master JS");
    expect(q.slug).toBe("master-js");
    expect(q.createdAt).toBe(now);
  });

  it("should default id to undefined when omitted", () => {
    const q = QuizObjective.create({ name: "X", description: "d", slug: "x" });
    expect(q.id).toBeUndefined();
  });

  it("should default dates to now when omitted", () => {
    const before = new Date();
    const q = QuizObjective.create({ name: "X", description: "d", slug: "x" });
    const after = new Date();
    expect(q.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(q.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });
});

// ─── Stack ────────────────────────────────────────────────────────────────────

describe("Stack entity", () => {
  it("should create with all props", () => {
    const now = new Date("2024-01-01");
    const s = Stack.create({
      id: 10,
      name: "React",
      slug: "react",
      usageCount: 100,
      createdAt: now,
      updatedAt: now,
    });
    expect(s.id).toBe(10);
    expect(s.name).toBe("React");
    expect(s.slug).toBe("react");
    expect(s.usageCount).toBe(100);
    expect(s.createdAt).toBe(now);
  });

  it("should default id to undefined when omitted", () => {
    const s = Stack.create({ name: "Vue", slug: "vue" });
    expect(s.id).toBeUndefined();
  });

  it("should default usageCount to 0 when omitted", () => {
    const s = Stack.create({ name: "Vue", slug: "vue" });
    expect(s.usageCount).toBe(0);
  });

  it("should default dates to now when omitted", () => {
    const before = new Date();
    const s = Stack.create({ name: "Vue", slug: "vue" });
    const after = new Date();
    expect(s.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(s.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });
});

// ─── Specialty ────────────────────────────────────────────────────────────────

describe("Specialty entity", () => {
  it("should create with all props", () => {
    const now = new Date("2024-01-01");
    const s = Specialty.create({
      id: 3,
      name: "Frontend",
      description: "FE",
      slug: "frontend",
      order: 1,
      createdAt: now,
      updatedAt: now,
    });
    expect(s.id).toBe(3);
    expect(s.name).toBe("Frontend");
    expect(s.order).toBe(1);
  });

  it("should default id and order to undefined when omitted", () => {
    const s = Specialty.create({ name: "FE", description: "d", slug: "fe" });
    expect(s.id).toBeUndefined();
    expect(s.order).toBeUndefined();
  });

  it("should default dates to now when omitted", () => {
    const before = new Date();
    const s = Specialty.create({ name: "FE", description: "d", slug: "fe" });
    const after = new Date();
    expect(s.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(s.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });
});

// ─── Seniority ────────────────────────────────────────────────────────────────

describe("Seniority entity", () => {
  it("should create with all props", () => {
    const now = new Date("2024-01-01");
    const s = Seniority.create({
      id: 2,
      name: "Senior",
      description: "Senior dev",
      slug: "senior",
      order: 3,
      createdAt: now,
      updatedAt: now,
    });
    expect(s.id).toBe(2);
    expect(s.name).toBe("Senior");
    expect(s.order).toBe(3);
  });

  it("should default id and order to undefined when omitted", () => {
    const s = Seniority.create({ name: "Junior", description: "d", slug: "j" });
    expect(s.id).toBeUndefined();
    expect(s.order).toBeUndefined();
  });

  it("should default dates to now when omitted", () => {
    const before = new Date();
    const s = Seniority.create({ name: "Mid", description: "d", slug: "m" });
    const after = new Date();
    expect(s.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(s.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });
});

// ─── AgeRange ─────────────────────────────────────────────────────────────────

describe("AgeRange entity", () => {
  it("should create with all props", () => {
    const now = new Date("2024-01-01");
    const a = AgeRange.create({
      id: 1,
      name: "18-24",
      startAge: 18,
      endAge: 24,
      slug: "18-24",
      order: 1,
      createdAt: now,
      updatedAt: now,
    });
    expect(a.id).toBe(1);
    expect(a.name).toBe("18-24");
    expect(a.startAge).toBe(18);
    expect(a.endAge).toBe(24);
    expect(a.order).toBe(1);
  });

  it("should default id and order to undefined when omitted", () => {
    const a = AgeRange.create({
      name: "25-34",
      startAge: 25,
      endAge: 34,
      slug: "25-34",
    });
    expect(a.id).toBeUndefined();
    expect(a.order).toBeUndefined();
  });

  it("should default dates to now when omitted", () => {
    const before = new Date();
    const a = AgeRange.create({ name: "X", startAge: 0, endAge: 99, slug: "x" });
    const after = new Date();
    expect(a.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(a.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });
});

// ─── CareerObjective ──────────────────────────────────────────────────────────

describe("CareerObjective entity", () => {
  it("should create with all props", () => {
    const now = new Date("2024-01-01");
    const c = CareerObjective.create({
      id: 4,
      name: "Fullstack",
      description: "Full",
      slug: "fullstack",
      order: 2,
      createdAt: now,
      updatedAt: now,
    });
    expect(c.id).toBe(4);
    expect(c.name).toBe("Fullstack");
    expect(c.order).toBe(2);
  });

  it("should default id and order to undefined when omitted", () => {
    const c = CareerObjective.create({ name: "BE", description: "d", slug: "be" });
    expect(c.id).toBeUndefined();
    expect(c.order).toBeUndefined();
  });

  it("should default dates to now when omitted", () => {
    const before = new Date();
    const c = CareerObjective.create({ name: "X", description: "d", slug: "x" });
    const after = new Date();
    expect(c.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(c.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });
});
