import { describe, expect, it } from "@jest/globals";
import {
  transformerStringDataToNumber,
  msToSeconds,
  msToMinutes,
  msToHours,
  formatMs,
  stringToDate,
  generateHash,
} from "./utils";

describe("utils", () => {
  describe("transformerStringDataToNumber", () => {
    it("should convert numeric string to number", () => {
      expect(transformerStringDataToNumber("42")).toBe(42);
    });

    it("should return NaN for non-numeric string", () => {
      expect(transformerStringDataToNumber("abc")).toBeNaN();
    });
  });

  describe("msToSeconds", () => {
    it("should convert milliseconds to seconds", () => {
      expect(msToSeconds(5000)).toBe(5);
    });

    it("should floor the result", () => {
      expect(msToSeconds(5999)).toBe(5);
    });
  });

  describe("msToMinutes", () => {
    it("should convert milliseconds to minutes", () => {
      expect(msToMinutes(60_000)).toBe(1);
    });

    it("should floor the result", () => {
      expect(msToMinutes(61_000)).toBe(1);
      expect(msToMinutes(120_000)).toBe(2);
    });
  });

  describe("msToHours", () => {
    it("should convert milliseconds to hours", () => {
      expect(msToHours(3_600_000)).toBe(1);
    });

    it("should floor the result", () => {
      expect(msToHours(3_600_000 * 2 + 100)).toBe(2);
    });
  });

  describe("formatMs", () => {
    it("should return days when >= 24 hours", () => {
      expect(formatMs(24 * 3_600_000)).toBe("1 dia");
      expect(formatMs(48 * 3_600_000)).toBe("2 dias");
    });

    it("should return hours when >= 1 hour and < 24 hours", () => {
      expect(formatMs(3_600_000)).toBe("1 hora");
      expect(formatMs(2 * 3_600_000)).toBe("2 horas");
    });

    it("should return minutes when < 1 hour", () => {
      expect(formatMs(60_000)).toBe("1 minuto");
      expect(formatMs(2 * 60_000)).toBe("2 minutos");
    });
  });

  describe("stringToDate", () => {
    it("should parse an ISO date string to a Date object", () => {
      const date = stringToDate("2024-01-15");
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2024);
    });
  });

  describe("generateHash", () => {
    it("should return a deterministic SHA-256 hex string", () => {
      const hash1 = generateHash("hello");
      const hash2 = generateHash("hello");
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64);
      expect(hash1).toMatch(/^[a-f0-9]+$/);
    });

    it("should produce different hashes for different inputs", () => {
      expect(generateHash("foo")).not.toBe(generateHash("bar"));
    });
  });
});
