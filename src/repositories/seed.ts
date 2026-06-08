import type { CalendarEvent } from "@/types/calendar";
import type { Printer } from "@/types/printer";
import {
  StorageKeys,
  readCollection,
  readFlag,
  writeCollection,
  writeFlag,
} from "./local/local-storage";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function daysFromNow(n: number, hour = 9, minutes = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(hour, minutes, 0, 0);
  return d.toISOString();
}

function addHours(iso: string, hours: number): string {
  const d = new Date(iso);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function buildSeedPrinters(): Printer[] {
  return [
    {
      id: uid(),
      modelo: "Epson L3250",
      propietario: "Banco Continental — Agencia San Isidro",
      comentario: "Atasco recurrente en bandeja de salida.",
      fechaIngreso: daysAgo(2),
      estado: "TALLER",
    },
    {
      id: uid(),
      modelo: "HP LaserJet Pro M404dn",
      propietario: "Estudio Jurídico Vargas & Asociados",
      comentario: "Cambio de fusor y limpieza profunda.",
      fechaIngreso: daysAgo(4),
      estado: "TALLER",
    },
    {
      id: uid(),
      modelo: "Canon imageRUNNER 2625",
      propietario: "Clínica Internacional — Sede Lima",
      comentario: "Calibración de color y firmware.",
      fechaIngreso: daysAgo(6),
      estado: "TALLER",
    },
    {
      id: uid(),
      modelo: "Brother HL-L2360DW",
      propietario: "Notaría Paino",
      fechaIngreso: daysAgo(10),
      fechaSalidaTaller: daysAgo(1),
      estado: "DEPOSITO",
    },
    {
      id: uid(),
      modelo: "Epson EcoTank L6171",
      propietario: "Municipalidad de Surco",
      comentario: "Sistema de tinta limpio. Listo para recoger.",
      fechaIngreso: daysAgo(14),
      fechaSalidaTaller: daysAgo(3),
      estado: "DEPOSITO",
    },
    {
      id: uid(),
      modelo: "HP OfficeJet Pro 9015e",
      propietario: "Importadora Trujillo S.A.C.",
      fechaIngreso: daysAgo(25),
      fechaSalidaTaller: daysAgo(15),
      fechaEntrega: daysAgo(10),
      estado: "ENTREGADA",
    },
    {
      id: uid(),
      modelo: "Samsung Xpress M2070",
      propietario: "Colegio San Agustín",
      comentario: "Mantenimiento preventivo completo.",
      fechaIngreso: daysAgo(40),
      fechaSalidaTaller: daysAgo(30),
      fechaEntrega: daysAgo(22),
      estado: "ENTREGADA",
    },
  ];
}

function buildSeedEvents(): CalendarEvent[] {
  return [
    {
      id: uid(),
      titulo: "Visita técnica — Banco Continental",
      descripcion: "Revisión de fotocopiadora L3250 en agencia San Isidro.",
      fechaInicio: daysFromNow(1, 10, 0),
      fechaFin: addHours(daysFromNow(1, 10, 0), 2),
      tecnicoResponsable: "Carlos Mendoza",
      tipo: "VISITA",
    },
    {
      id: uid(),
      titulo: "Instalación de cámaras IP",
      descripcion: "Instalación de 6 cámaras en oficinas centrales.",
      fechaInicio: daysFromNow(2, 9, 0),
      fechaFin: addHours(daysFromNow(2, 9, 0), 5),
      tecnicoResponsable: "Luis Vargas",
      tipo: "INSTALACION",
    },
    {
      id: uid(),
      titulo: "Mantenimiento preventivo trimestral",
      descripcion: "Clínica Internacional — flotas de fotocopiadoras.",
      fechaInicio: daysFromNow(3, 14, 0),
      fechaFin: addHours(daysFromNow(3, 14, 0), 3),
      tecnicoResponsable: "Ana Quispe",
      tipo: "MANTENIMIENTO",
    },
    {
      id: uid(),
      titulo: "Reunión semanal de servicio",
      descripcion: "Revisión de tickets abiertos y planning de la semana.",
      fechaInicio: daysFromNow(0, 16, 0),
      fechaFin: addHours(daysFromNow(0, 16, 0), 1),
      tecnicoResponsable: "Equipo GTS",
      tipo: "REUNION",
    },
    {
      id: uid(),
      titulo: "Visita técnica — Notaría Paino",
      descripcion: "Entrega de equipo reparado y capacitación rápida.",
      fechaInicio: daysFromNow(5, 11, 0),
      fechaFin: addHours(daysFromNow(5, 11, 0), 1),
      tecnicoResponsable: "Carlos Mendoza",
      tipo: "VISITA",
    },
    {
      id: uid(),
      titulo: "Mantenimiento — Municipalidad de Surco",
      fechaInicio: daysFromNow(7, 9, 30),
      fechaFin: addHours(daysFromNow(7, 9, 30), 4),
      tecnicoResponsable: "Luis Vargas",
      tipo: "MANTENIMIENTO",
    },
    {
      id: uid(),
      titulo: "Instalación de alarmas — Colegio San Agustín",
      descripcion: "Sistema integral de alarmas en 3 sedes.",
      fechaInicio: daysFromNow(10, 8, 0),
      fechaFin: addHours(daysFromNow(10, 8, 0), 6),
      tecnicoResponsable: "Ana Quispe",
      tipo: "INSTALACION",
    },
    {
      id: uid(),
      titulo: "Reunión con cliente — Importadora Trujillo",
      descripcion: "Propuesta de contrato anual de mantenimiento.",
      fechaInicio: daysFromNow(-2, 15, 0),
      fechaFin: addHours(daysFromNow(-2, 15, 0), 1),
      tecnicoResponsable: "Equipo GTS",
      tipo: "REUNION",
    },
  ];
}

/**
 * Ejecuta el seed una única vez. Si ya hubo seed previo o existen datos, no hace nada.
 */
export function seedLocalIfEmpty(): void {
  if (typeof window === "undefined") return;
  if (readFlag(StorageKeys.seeded)) return;

  const existingPrinters = readCollection<Printer>(StorageKeys.printers);
  const existingEvents = readCollection<CalendarEvent>(StorageKeys.events);

  if (existingPrinters.length === 0) {
    writeCollection(StorageKeys.printers, buildSeedPrinters());
  }
  if (existingEvents.length === 0) {
    writeCollection(StorageKeys.events, buildSeedEvents());
  }
  writeFlag(StorageKeys.seeded, true);
}
