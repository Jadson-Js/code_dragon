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
