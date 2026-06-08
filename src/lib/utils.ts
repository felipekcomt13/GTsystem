import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string | undefined | null, pattern = "dd MMM yyyy"): string {
  if (!iso) return "—";
  try {
    return format(parseISO(iso), pattern, { locale: es });
  } catch {
    return "—";
  }
}

export function formatDateTime(iso: string | undefined | null): string {
  return formatDate(iso, "dd MMM yyyy · HH:mm");
}

export function formatRelative(iso: string | undefined | null): string {
  if (!iso) return "—";
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true, locale: es });
  } catch {
    return "—";
  }
}
