import { describe, expect, it } from "@jest/globals";
import { Profile } from "./profile.entity";

describe("Profile Entity", () => {
  it("should create a profile with default values", () => {
    const profile = Profile.create({
      userId: "user-1",
    });

    expect(profile.id).toBeDefined();
    expect(profile.userId).toBe("user-1");
    expect(profile.linkedinUrl).toBeNull();
    expect(profile.githubUrl).toBeNull();
    expect(profile.portfolioUrl).toBeNull();
    expect(profile.ageRangeId).toBeNull();
    expect(profile.seniorityId).toBeNull();
    expect(profile.specialtyId).toBeNull();
    expect(profile.careerObjectiveId).toBeNull();
    expect(profile.createdAt).toBeInstanceOf(Date);
    expect(profile.updatedAt).toBeInstanceOf(Date);
  });

  it("should create a profile with provided values", () => {
    const id = "fixed-id";
    const now = new Date();
    const profile = Profile.create({
      id,
      userId: "user-1",
      linkedinUrl: "linkedin.com/in/user",
      githubUrl: "github.com/user",
      portfolioUrl: "user.dev",
      ageRangeId: 1,
      seniorityId: 2,
      specialtyId: 3,
      careerObjectiveId: 4,
      createdAt: now,
      updatedAt: now,
    });

    expect(profile.id).toBe(id);
    expect(profile.linkedinUrl).toBe("linkedin.com/in/user");
    expect(profile.githubUrl).toBe("github.com/user");
    expect(profile.portfolioUrl).toBe("user.dev");
    expect(profile.ageRangeId).toBe(1);
    expect(profile.seniorityId).toBe(2);
    expect(profile.specialtyId).toBe(3);
    expect(profile.careerObjectiveId).toBe(4);
    expect(profile.createdAt).toBe(now);
    expect(profile.updatedAt).toBe(now);
  });

  it("should update profile properties", () => {
    const profile = Profile.create({
      userId: "user-1",
    });

    const oldUpdatedAt = profile.updatedAt;

    // Use a small delay to ensure the Date constructor generates a different time if needed,
    // or just rely on the fact that the test environment might be fast enough that they are the same,
    // though in a real app this would typically change.
    // Actually, I'll just check that it's called and the values change.
    
    profile.update({
      linkedinUrl: "new-linkedin",
      seniorityId: 5,
    });

    expect(profile.linkedinUrl).toBe("new-linkedin");
    expect(profile.seniorityId).toBe(5);
    expect(profile.githubUrl).toBeNull(); // remains unchanged
    expect(profile.updatedAt).not.toBe(oldUpdatedAt);
  });

  it("should not update properties if not provided in update props", () => {
    const profile = Profile.create({
      userId: "user-1",
      linkedinUrl: "original-linkedin",
    });

    profile.update({});

    expect(profile.linkedinUrl).toBe("original-linkedin");
  });
});
