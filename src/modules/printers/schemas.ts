import { z } from "zod";

export const printerFormSchema = z.object({
  modelo: z
    .string({ required_error: "El modelo es obligatorio." })
    .trim()
    .min(2, "El modelo debe tener al menos 2 caracteres."),
  propietario: z
    .string({ required_error: "El propietario es obligatorio." })
    .trim()
    .min(2, "El propietario debe tener al menos 2 caracteres."),
  comentario: z
    .string()
    .trim()
    .max(500, "Máximo 500 caracteres.")
    .optional()
    .or(z.literal("")),
});

export type PrinterFormValues = z.infer<typeof printerFormSchema>;
