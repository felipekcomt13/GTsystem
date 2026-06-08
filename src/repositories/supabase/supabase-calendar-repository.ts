import { getSupabaseClient } from "@/lib/supabase";
import type {
  CalendarEvent,
  CalendarEventCreateInput,
  CalendarEventUpdateInput,
  EventType,
} from "@/types/calendar";
import type { CalendarRepository } from "../types";

/**
 * Implementación Supabase del repositorio de eventos del calendario.
 *
 * Tabla `calendar_events` (ver supabase/schema.sql):
 *   id                  uuid        primary key default gen_random_uuid()
 *   titulo              text        not null
 *   descripcion         text
 *   fecha_inicio        timestamptz not null
 *   fecha_fin           timestamptz not null
 *   tecnico_responsable text        not null
 *   tipo                text        not null check (tipo in ('VISITA','INSTALACION','MANTENIMIENTO','REUNION'))
 *
 * Mapping snake_case (DB) ↔ camelCase (dominio):
 *   fecha_inicio        → fechaInicio
 *   fecha_fin           → fechaFin
 *   tecnico_responsable → tecnicoResponsable
 */

const TABLE = "calendar_events";

interface CalendarEventRow {
  id: string;
  titulo: string;
  descripcion: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  tecnico_responsable: string;
  tipo: EventType;
}

function rowToEvent(row: CalendarEventRow): CalendarEvent {
  return {
    id: row.id,
    titulo: row.titulo,
    descripcion: row.descripcion ?? undefined,
    fechaInicio: row.fecha_inicio,
    fechaFin: row.fecha_fin,
    tecnicoResponsable: row.tecnico_responsable,
    tipo: row.tipo,
  };
}

export class SupabaseCalendarRepository implements CalendarRepository {
  async list(rangeStart?: string, rangeEnd?: string): Promise<CalendarEvent[]> {
    let query = getSupabaseClient()
      .from(TABLE)
      .select("*")
      .order("fecha_inicio", { ascending: true });

    // Solapamiento con [rangeStart, rangeEnd]: fecha_fin >= start AND fecha_inicio <= end.
    if (rangeStart) query = query.gte("fecha_fin", rangeStart);
    if (rangeEnd) query = query.lte("fecha_inicio", rangeEnd);

    const { data, error } = await query;
    if (error) throw new Error(`No se pudieron listar los eventos: ${error.message}`);
    return (data as CalendarEventRow[]).map(rowToEvent);
  }

  async getById(id: string): Promise<CalendarEvent | null> {
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(`No se pudo obtener el evento ${id}: ${error.message}`);
    return data ? rowToEvent(data as CalendarEventRow) : null;
  }

  async create(input: CalendarEventCreateInput): Promise<CalendarEvent> {
    const payload = {
      titulo: input.titulo.trim(),
      descripcion: input.descripcion?.trim() || null,
      fecha_inicio: input.fechaInicio,
      fecha_fin: input.fechaFin,
      tecnico_responsable: input.tecnicoResponsable.trim(),
      tipo: input.tipo,
    };
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .insert(payload)
      .select("*")
      .single();
    if (error) throw new Error(`No se pudo crear el evento: ${error.message}`);
    return rowToEvent(data as CalendarEventRow);
  }

  async update(id: string, patch: CalendarEventUpdateInput): Promise<CalendarEvent> {
    const payload: Partial<CalendarEventRow> = {};
    if (patch.titulo !== undefined) payload.titulo = patch.titulo.trim();
    if (patch.descripcion !== undefined) payload.descripcion = patch.descripcion?.trim() || null;
    if (patch.fechaInicio !== undefined) payload.fecha_inicio = patch.fechaInicio;
    if (patch.fechaFin !== undefined) payload.fecha_fin = patch.fechaFin;
    if (patch.tecnicoResponsable !== undefined)
      payload.tecnico_responsable = patch.tecnicoResponsable.trim();
    if (patch.tipo !== undefined) payload.tipo = patch.tipo;

    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(`No se pudo actualizar el evento ${id}: ${error.message}`);
    return rowToEvent(data as CalendarEventRow);
  }

  async delete(id: string): Promise<void> {
    const { error } = await getSupabaseClient().from(TABLE).delete().eq("id", id);
    if (error) throw new Error(`No se pudo eliminar el evento ${id}: ${error.message}`);
  }
}
