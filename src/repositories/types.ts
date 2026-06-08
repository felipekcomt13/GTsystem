import type {
  CalendarEvent,
  CalendarEventCreateInput,
  CalendarEventUpdateInput,
} from "@/types/calendar";
import type {
  Printer,
  PrinterCreateInput,
  PrinterUpdateInput,
} from "@/types/printer";

/**
 * Contrato del repositorio de fotocopiadoras. Toda implementación (local, supabase, etc.)
 * debe satisfacer esta interfaz para que la UI no acople con un origen de datos concreto.
 */
export interface PrinterRepository {
  list(): Promise<Printer[]>;
  getById(id: string): Promise<Printer | null>;
  create(input: PrinterCreateInput): Promise<Printer>;
  update(id: string, patch: PrinterUpdateInput & Partial<Printer>): Promise<Printer>;
  delete(id: string): Promise<void>;
}

/**
 * Contrato del repositorio de eventos del calendario.
 */
export interface CalendarRepository {
  list(rangeStart?: string, rangeEnd?: string): Promise<CalendarEvent[]>;
  getById(id: string): Promise<CalendarEvent | null>;
  create(input: CalendarEventCreateInput): Promise<CalendarEvent>;
  update(id: string, patch: CalendarEventUpdateInput): Promise<CalendarEvent>;
  delete(id: string): Promise<void>;
}
