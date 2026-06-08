import type { Printer, PrinterCreateInput, PrinterUpdateInput } from "@/types/printer";
import type { PrinterRepository } from "../types";
import { StorageKeys, readCollection, writeCollection } from "./local-storage";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export class LocalPrinterRepository implements PrinterRepository {
  async list(): Promise<Printer[]> {
    return readCollection<Printer>(StorageKeys.printers);
  }

  async getById(id: string): Promise<Printer | null> {
    const all = await this.list();
    return all.find((p) => p.id === id) ?? null;
  }

  async create(input: PrinterCreateInput): Promise<Printer> {
    const all = await this.list();
    const printer: Printer = {
      id: uid(),
      modelo: input.modelo.trim(),
      propietario: input.propietario.trim(),
      comentario: input.comentario?.trim() || undefined,
      fechaIngreso: new Date().toISOString(),
      estado: "TALLER",
    };
    writeCollection(StorageKeys.printers, [printer, ...all]);
    return printer;
  }

  async update(id: string, patch: PrinterUpdateInput & Partial<Printer>): Promise<Printer> {
    const all = await this.list();
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error(`Fotocopiadora ${id} no encontrada`);
    const current = all[idx]!;
    const updated: Printer = {
      ...current,
      ...patch,
      modelo: patch.modelo?.trim() ?? current.modelo,
      propietario: patch.propietario?.trim() ?? current.propietario,
      comentario:
        patch.comentario !== undefined ? patch.comentario?.trim() || undefined : current.comentario,
      id: current.id,
    };
    const next = [...all];
    next[idx] = updated;
    writeCollection(StorageKeys.printers, next);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const all = await this.list();
    writeCollection(
      StorageKeys.printers,
      all.filter((p) => p.id !== id),
    );
  }
}
