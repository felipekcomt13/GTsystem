import type { ISODateString } from "./common";

export type PrinterStatus = "TALLER" | "DEPOSITO" | "ENTREGADA";

export interface Printer {
  id: string;
  modelo: string;
  propietario: string;
  comentario?: string;
  fechaIngreso: ISODateString;
  fechaSalidaTaller?: ISODateString;
  fechaEntrega?: ISODateString;
  estado: PrinterStatus;
}

export interface PrinterCreateInput {
  modelo: string;
  propietario: string;
  comentario?: string;
}

export type PrinterUpdateInput = Partial<PrinterCreateInput>;
