import type { EventType } from "@/types/calendar";
import type { PrinterStatus } from "@/types/printer";

export const APP_NAME = "GTSystem";
export const COMPANY_NAME = "GrupoTelesistemas";

export const ROUTES = {
  dashboard: "/dashboard",
  taller: "/taller",
  deposito: "/deposito",
  calendario: "/calendario",
} as const;

export const PRINTER_STATUS_LABEL: Record<PrinterStatus, string> = {
  TALLER: "En taller",
  DEPOSITO: "En depósito",
  ENTREGADA: "Entregada",
};

export const PRINTER_STATUS_BADGE: Record<PrinterStatus, string> = {
  TALLER: "bg-amber-100 text-amber-800 border-amber-200",
  DEPOSITO: "bg-blue-100 text-blue-800 border-blue-200",
  ENTREGADA: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  VISITA: "Visita técnica",
  INSTALACION: "Instalación",
  MANTENIMIENTO: "Mantenimiento",
  REUNION: "Reunión",
};

export const EVENT_TYPE_COLOR: Record<EventType, { bg: string; border: string; text: string }> = {
  VISITA: { bg: "#dbeafe", border: "#2563eb", text: "#1e3a8a" },
  INSTALACION: { bg: "#dcfce7", border: "#16a34a", text: "#14532d" },
  MANTENIMIENTO: { bg: "#fef3c7", border: "#d97706", text: "#78350f" },
  REUNION: { bg: "#ede9fe", border: "#7c3aed", text: "#4c1d95" },
};
