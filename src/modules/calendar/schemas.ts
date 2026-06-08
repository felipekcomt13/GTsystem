import { z } from "zod";

import { hhmmToMinutes } from "./time-options";

/**
 * Formulario básico de reunión (estilo Google Calendar):
 * título + fecha + hora de inicio + hora de fin (mismo día).
 */
export const eventFormSchema = z
  .object({
    titulo: z
      .string({ required_error: "El título es obligatorio." })
      .trim()
      .min(2, "El título debe tener al menos 2 caracteres."),
    fecha: z
      .string({ required_error: "La fecha es obligatoria." })
      .min(1, "La fecha es obligatoria."),
    horaInicio: z
      .string({ required_error: "La hora de inicio es obligatoria." })
      .min(1, "La hora de inicio es obligatoria."),
    horaFin: z
      .string({ required_error: "La hora de fin es obligatoria." })
      .min(1, "La hora de fin es obligatoria."),
  })
  .refine((d) => hhmmToMinutes(d.horaFin) > hhmmToMinutes(d.horaInicio), {
    path: ["horaFin"],
    message: "La hora de fin debe ser posterior a la de inicio.",
  });

export type EventFormValues = z.infer<typeof eventFormSchema>;

// Payload que el diálogo entrega al contenedor (fechas ya en ISO).
export interface EventSubmitValues {
  titulo: string;
  fechaInicio: string;
  fechaFin: string;
}
