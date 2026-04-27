import { createHash } from "node:crypto";

export function transformerStringDataToNumber(data: string) {
  return Number(data);
}

export function msToSeconds(ms: number): number {
  return Math.floor(ms / 1000);
}

export function msToMinutes(ms: number): number {
  return Math.floor(ms / (1000 * 60));
}

export function msToHours(ms: number): number {
  return Math.floor(ms / (1000 * 60 * 60));
}

export function formatMs(ms: number): string {
  const hours = msToHours(ms);
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days} dia${days > 1 ? "s" : ""}`;
  }
  if (hours >= 1) {
    return `${hours} hora${hours > 1 ? "s" : ""}`;
  }
  const minutes = msToMinutes(ms);
  return `${minutes} minuto${minutes > 1 ? "s" : ""}`;
}

export function stringToDate(date: string): Date {
  return new Date(date);
}

export function generateHash(payload: string): string {
  return createHash("sha256").update(payload).digest("hex");
}

export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function calcAverage(scores: { score: number }[]): number {
  if (scores.length === 0) return 0;
  return scores.reduce((sum, r) => sum + r.score, 0) / scores.length;
}
