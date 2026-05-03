import { describe, expect, it } from "@jest/globals";
import { Feedback } from "./feedback.entity";
import { BadRequestError } from "@/shared/app.error";

describe("Feedback Entity", () => {
  const validProps = {
    userId: "user-id",
    rate: 5,
    reason: "Great app",
    description: "I love the UI",
    featureId: 1,
    sessionId: "session-id",
  };

  it("should create a feedback with all values successfully", () => {
    const feedback = Feedback.create(validProps);

    expect(feedback.id).toBeDefined();
    expect(feedback.userId).toBe(validProps.userId);
    expect(feedback.rate).toBe(validProps.rate);
    expect(feedback.reason).toBe(validProps.reason);
    expect(feedback.description).toBe(validProps.description);
    expect(feedback.featureId).toBe(validProps.featureId);
    expect(feedback.sessionId).toBe(validProps.sessionId);
    expect(feedback.createdAt).toBeInstanceOf(Date);
    expect(feedback.updatedAt).toBeInstanceOf(Date);
    expect(feedback.deletedAt).toBeNull();
  });

  it("should create a feedback with only mandatory values successfully", () => {
    const mandatoryProps = {
      userId: "user-id",
      rate: 4,
      reason: "Good",
      description: "Nice work",
    };

    const feedback = Feedback.create(mandatoryProps);

    expect(feedback.id).toBeDefined();
    expect(feedback.featureId).toBeNull();
    expect(feedback.sessionId).toBeNull();
    expect(feedback.createdAt).toBeInstanceOf(Date);
  });

  it("should create a feedback with provided id and dates", () => {
    const id = "fixed-id";
    const now = new Date();
    const feedback = Feedback.create({
      ...validProps,
      id,
      createdAt: now,
      updatedAt: now,
      deletedAt: now,
    });

    expect(feedback.id).toBe(id);
    expect(feedback.createdAt).toBe(now);
    expect(feedback.updatedAt).toBe(now);
    expect(feedback.deletedAt).toBe(now);
  });

  describe("Validation", () => {
    it("should throw BadRequestError if rate is less than 1", () => {
      expect(() => {
        Feedback.create({ ...validProps, rate: 0 });
      }).toThrow(new BadRequestError("Rate must be between 1 and 5"));
    });

    it("should throw BadRequestError if rate is greater than 5", () => {
      expect(() => {
        Feedback.create({ ...validProps, rate: 6 });
      }).toThrow(new BadRequestError("Rate must be between 1 and 5"));
    });
  });
});
