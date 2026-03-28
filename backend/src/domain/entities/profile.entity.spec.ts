import { describe, expect, it } from "@jest/globals";
import { Profile } from "./profile.entity";

describe("Profile entity", () => {
  describe("create", () => {
    it("should create a Profile with all provided props", () => {
      const id = "profile-1";
      const now = new Date("2024-01-01T00:00:00Z");

      const profile = Profile.create({
        id,
        userId: "user-1",
        linkedinUrl: "https://linkedin.com/in/john",
        githubUrl: "https://github.com/john",
        portfolioUrl: "https://john.dev",
        ageRangeId: 1,
        seniorityId: 2,
        specialtyId: 3,
        careerObjectiveId: 4,
        createdAt: now,
        updatedAt: now,
      });

      expect(profile.id).toBe(id);
      expect(profile.userId).toBe("user-1");
      expect(profile.linkedinUrl).toBe("https://linkedin.com/in/john");
      expect(profile.githubUrl).toBe("https://github.com/john");
      expect(profile.portfolioUrl).toBe("https://john.dev");
      expect(profile.ageRangeId).toBe(1);
      expect(profile.seniorityId).toBe(2);
      expect(profile.specialtyId).toBe(3);
      expect(profile.careerObjectiveId).toBe(4);
      expect(profile.createdAt).toBe(now);
      expect(profile.updatedAt).toBe(now);
    });

    it("should generate a UUID when id is not provided", () => {
      const profile = Profile.create({ userId: "user-1" });

      expect(profile.id).toBeDefined();
      expect(profile.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });

    it("should default optional fields to null when not provided", () => {
      const profile = Profile.create({ userId: "user-1" });

      expect(profile.linkedinUrl).toBeNull();
      expect(profile.githubUrl).toBeNull();
      expect(profile.portfolioUrl).toBeNull();
      expect(profile.ageRangeId).toBeNull();
      expect(profile.seniorityId).toBeNull();
      expect(profile.specialtyId).toBeNull();
      expect(profile.careerObjectiveId).toBeNull();
    });

    it("should default createdAt and updatedAt to now when not provided", () => {
      const before = new Date();
      const profile = Profile.create({ userId: "user-1" });
      const after = new Date();

      expect(profile.createdAt.getTime()).toBeGreaterThanOrEqual(
        before.getTime(),
      );
      expect(profile.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(profile.updatedAt.getTime()).toBeGreaterThanOrEqual(
        before.getTime(),
      );
      expect(profile.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe("update", () => {
    it("should mutate the profile fields with provided values", () => {
      const profile = Profile.create({
        userId: "user-1",
        seniorityId: 1,
        specialtyId: 1,
        careerObjectiveId: 1,
        linkedinUrl: "https://old.linkedin.com",
      });

      profile.update({
        linkedinUrl: "https://new.linkedin.com",
        githubUrl: "https://github.com/new",
        portfolioUrl: "https://new.dev",
        seniorityId: 2,
        specialtyId: 3,
        careerObjectiveId: 4,
      });

      expect(profile.linkedinUrl).toBe("https://new.linkedin.com");
      expect(profile.githubUrl).toBe("https://github.com/new");
      expect(profile.portfolioUrl).toBe("https://new.dev");
      expect(profile.seniorityId).toBe(2);
      expect(profile.specialtyId).toBe(3);
      expect(profile.careerObjectiveId).toBe(4);
    });

    it("should keep existing values when update props are undefined", () => {
      const profile = Profile.create({
        userId: "user-1",
        linkedinUrl: "https://linkedin.com/in/john",
        seniorityId: 5,
      });

      profile.update({});

      expect(profile.linkedinUrl).toBe("https://linkedin.com/in/john");
      expect(profile.seniorityId).toBe(5);
    });

    it("should update updatedAt on every call", () => {
      const profile = Profile.create({ userId: "user-1" });
      const before = new Date();
      profile.update({ seniorityId: 99 });
      const after = new Date();

      expect(profile.updatedAt.getTime()).toBeGreaterThanOrEqual(
        before.getTime(),
      );
      expect(profile.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });
});
