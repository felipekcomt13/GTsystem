import type {
  CalendarEvent,
  CalendarEventCreateInput,
  CalendarEventUpdateInput,
} from "@/types/calendar";
import type { CalendarRepository } from "../types";
import { StorageKeys, readCollection, writeCollection } from "./local-storage";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export class LocalCalendarRepository implements CalendarRepository {
  async list(rangeStart?: string, rangeEnd?: string): Promise<CalendarEvent[]> {
    const all = readCollection<CalendarEvent>(StorageKeys.events);
    if (!rangeStart && !rangeEnd) return all;
    const start = rangeStart ? new Date(rangeStart).getTime() : -Infinity;
    const end = rangeEnd ? new Date(rangeEnd).getTime() : Infinity;
    return all.filter((e) => {
      const s = new Date(e.fechaInicio).getTime();
      const f = new Date(e.fechaFin).getTime();
      return f >= start && s <= end;
    });
  }

  async getById(id: string): Promise<CalendarEvent | null> {
    const all = readCollection<CalendarEvent>(StorageKeys.events);
    return all.find((e) => e.id === id) ?? null;
  }

  async create(input: CalendarEventCreateInput): Promise<CalendarEvent> {
    const all = readCollection<CalendarEvent>(StorageKeys.events);
    const event: CalendarEvent = {
      id: uid(),
      titulo: input.titulo.trim(),
      descripcion: input.descripcion?.trim() || undefined,
      fechaInicio: input.fechaInicio,
      fechaFin: input.fechaFin,
      tecnicoResponsable: input.tecnicoResponsable.trim(),
      tipo: input.tipo,
    };
    writeCollection(StorageKeys.events, [event, ...all]);
    return event;
  }

  async update(id: string, patch: CalendarEventUpdateInput): Promise<CalendarEvent> {
    const all = readCollection<CalendarEvent>(StorageKeys.events);
    const idx = all.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error(`Evento ${id} no encontrado`);
    const current = all[idx]!;
    const updated: CalendarEvent = {
      ...current,
      ...patch,
      titulo: patch.titulo?.trim() ?? current.titulo,
      descripcion:
        patch.descripcion !== undefined
          ? patch.descripcion?.trim() || undefined
          : current.descripcion,
      tecnicoResponsable: patch.tecnicoResponsable?.trim() ?? current.tecnicoResponsable,
      id: current.id,
    };
    const next = [...all];
    next[idx] = updated;
    writeCollection(StorageKeys.events, next);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const all = readCollection<CalendarEvent>(StorageKeys.events);
    writeCollection(
      StorageKeys.events,
      all.filter((e) => e.id !== id),
    );
  }
}
