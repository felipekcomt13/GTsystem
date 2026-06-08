/**
 * Única capa autorizada a interactuar con `window.localStorage`.
 * El resto de la app debe consumirla a través de los repositorios.
 */

const isBrowser = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const StorageKeys = {
  printers: "gts:printers",
  events: "gts:calendar-events",
  seeded: "gts:seeded",
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

export function readCollection<T>(key: StorageKey): T[] {
  if (!isBrowser) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function writeCollection<T>(key: StorageKey, value: T[]): void {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function readFlag(key: StorageKey): boolean {
  if (!isBrowser) return false;
  return window.localStorage.getItem(key) === "true";
}

export function writeFlag(key: StorageKey, value: boolean): void {
  if (!isBrowser) return;
  window.localStorage.setItem(key, value ? "true" : "false");
}

export function clearAll(): void {
  if (!isBrowser) return;
  Object.values(StorageKeys).forEach((k) => window.localStorage.removeItem(k));
}
