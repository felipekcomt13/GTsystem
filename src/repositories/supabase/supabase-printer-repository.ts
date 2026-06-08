import { getSupabaseClient } from "@/lib/supabase";
import type {
  Printer,
  PrinterCreateInput,
  PrinterStatus,
  PrinterUpdateInput,
} from "@/types/printer";
import type { PrinterRepository } from "../types";

/**
 * Implementación Supabase del repositorio de fotocopiadoras.
 *
 * Tabla `printers` (ver supabase/schema.sql):
 *   id                  uuid        primary key default gen_random_uuid()
 *   modelo              text        not null
 *   propietario         text        not null
 *   comentario          text
 *   fecha_ingreso       timestamptz not null default now()
 *   fecha_salida_taller timestamptz
 *   fecha_entrega       timestamptz
 *   estado              text        not null check (estado in ('TALLER','DEPOSITO','ENTREGADA'))
 *
 * Mapping snake_case (DB) ↔ camelCase (dominio):
 *   fecha_ingreso        → fechaIngreso
 *   fecha_salida_taller  → fechaSalidaTaller
 *   fecha_entrega        → fechaEntrega
 *
 * Activar con NEXT_PUBLIC_DATA_SOURCE="supabase".
 */

const TABLE = "printers";

interface PrinterRow {
  id: string;
  modelo: string;
  propietario: string;
  comentario: string | null;
  fecha_ingreso: string;
  fecha_salida_taller: string | null;
  fecha_entrega: string | null;
  estado: PrinterStatus;
}

function rowToPrinter(row: PrinterRow): Printer {
  return {
    id: row.id,
    modelo: row.modelo,
    propietario: row.propietario,
    comentario: row.comentario ?? undefined,
    fechaIngreso: row.fecha_ingreso,
    fechaSalidaTaller: row.fecha_salida_taller ?? undefined,
    fechaEntrega: row.fecha_entrega ?? undefined,
    estado: row.estado,
  };
}

export class SupabasePrinterRepository implements PrinterRepository {
  async list(): Promise<Printer[]> {
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .select("*")
      .order("fecha_ingreso", { ascending: false });
    if (error) throw new Error(`No se pudieron listar las fotocopiadoras: ${error.message}`);
    return (data as PrinterRow[]).map(rowToPrinter);
  }

  async getById(id: string): Promise<Printer | null> {
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(`No se pudo obtener la fotocopiadora ${id}: ${error.message}`);
    return data ? rowToPrinter(data as PrinterRow) : null;
  }

  async create(input: PrinterCreateInput): Promise<Printer> {
    const payload = {
      modelo: input.modelo.trim(),
      propietario: input.propietario.trim(),
      comentario: input.comentario?.trim() || null,
      // fecha_ingreso y estado los resuelve el default de la tabla.
    };
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .insert(payload)
      .select("*")
      .single();
    if (error) throw new Error(`No se pudo crear la fotocopiadora: ${error.message}`);
    return rowToPrinter(data as PrinterRow);
  }

  async update(id: string, patch: PrinterUpdateInput & Partial<Printer>): Promise<Printer> {
    const payload: Partial<PrinterRow> = {};
    if (patch.modelo !== undefined) payload.modelo = patch.modelo.trim();
    if (patch.propietario !== undefined) payload.propietario = patch.propietario.trim();
    if (patch.comentario !== undefined) payload.comentario = patch.comentario?.trim() || null;
    if (patch.estado !== undefined) payload.estado = patch.estado;
    if (patch.fechaIngreso !== undefined) payload.fecha_ingreso = patch.fechaIngreso;
    if (patch.fechaSalidaTaller !== undefined)
      payload.fecha_salida_taller = patch.fechaSalidaTaller ?? null;
    if (patch.fechaEntrega !== undefined) payload.fecha_entrega = patch.fechaEntrega ?? null;

    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(`No se pudo actualizar la fotocopiadora ${id}: ${error.message}`);
    return rowToPrinter(data as PrinterRow);
  }

  async delete(id: string): Promise<void> {
    const { error } = await getSupabaseClient().from(TABLE).delete().eq("id", id);
    if (error) throw new Error(`No se pudo eliminar la fotocopiadora ${id}: ${error.message}`);
  }
}
