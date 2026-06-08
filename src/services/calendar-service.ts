import { calendarRepository } from "@/lib/repositories";
import type {
  CalendarEvent,
  CalendarEventCreateInput,
  CalendarEventUpdateInput,
} from "@/types/calendar";

export const CalendarService = {
  list(rangeStart?: string, rangeEnd?: string): Promise<CalendarEvent[]> {
    return calendarRepository.list(rangeStart, rangeEnd);
  },

  async create(input: CalendarEventCreateInput): Promise<CalendarEvent> {
    if (new Date(input.fechaFin) <= new Date(input.fechaInicio)) {
      throw new Error("La fecha de fin debe ser posterior a la fecha de inicio.");
    }
    return calendarRepository.create(input);
  },

  async update(id: string, patch: CalendarEventUpdateInput): Promise<CalendarEvent> {
    if (patch.fechaInicio && patch.fechaFin) {
      if (new Date(patch.fechaFin) <= new Date(patch.fechaInicio)) {
        throw new Error("La fecha de fin debe ser posterior a la fecha de inicio.");
      }
    }
    return calendarRepository.update(id, patch);
  },

  delete(id: string): Promise<void> {
    return calendarRepository.delete(id);
  },
};
