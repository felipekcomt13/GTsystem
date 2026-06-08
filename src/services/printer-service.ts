import { printerRepository } from "@/lib/repositories";
import type { Printer, PrinterCreateInput, PrinterUpdateInput } from "@/types/printer";

/**
 * Capa de lógica de negocio para fotocopiadoras.
 * Encapsula las reglas de transición de estado:
 *   TALLER → DEPOSITO → ENTREGADA
 */
export const PrinterService = {
  list(): Promise<Printer[]> {
    return printerRepository.list();
  },

  create(input: PrinterCreateInput): Promise<Printer> {
    if (!input.modelo?.trim()) throw new Error("El modelo es obligatorio.");
    if (!input.propietario?.trim()) throw new Error("El propietario es obligatorio.");
    return printerRepository.create(input);
  },

  updateInfo(id: string, patch: PrinterUpdateInput): Promise<Printer> {
    return printerRepository.update(id, patch);
  },

  delete(id: string): Promise<void> {
    return printerRepository.delete(id);
  },

  async moveToDeposit(id: string): Promise<Printer> {
    const current = await printerRepository.getById(id);
    if (!current) throw new Error("Fotocopiadora no encontrada.");
    if (current.estado !== "TALLER") {
      throw new Error("Solo se pueden mover a depósito fotocopiadoras en estado 'En taller'.");
    }
    return printerRepository.update(id, {
      estado: "DEPOSITO",
      fechaSalidaTaller: new Date().toISOString(),
    });
  },

  async markAsDelivered(id: string): Promise<Printer> {
    const current = await printerRepository.getById(id);
    if (!current) throw new Error("Fotocopiadora no encontrada.");
    if (current.estado !== "DEPOSITO") {
      throw new Error("Solo se pueden entregar fotocopiadoras que estén en depósito.");
    }
    return printerRepository.update(id, {
      estado: "ENTREGADA",
      fechaEntrega: new Date().toISOString(),
    });
  },
};
