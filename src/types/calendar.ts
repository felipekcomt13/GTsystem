import type { ISODateString } from "./common";

export type EventType = "VISITA" | "INSTALACION" | "MANTENIMIENTO" | "REUNION";

export interface CalendarEvent {
  id: string;
  titulo: string;
  descripcion?: string;
  fechaInicio: ISODateString;
  fechaFin: ISODateString;
  tecnicoResponsable: string;
  tipo: EventType;
}

export interface CalendarEventCreateInput {
  titulo: string;
  descripcion?: string;
  fechaInicio: ISODateString;
  fechaFin: ISODateString;
  tecnicoResponsable: string;
  tipo: EventType;
}

export type CalendarEventUpdateInput = Partial<CalendarEventCreateInput>;
