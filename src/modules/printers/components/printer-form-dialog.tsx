"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Printer } from "@/types/printer";

import { printerFormSchema, type PrinterFormValues } from "../schemas";

interface PrinterFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  printer?: Printer | null;
  onSubmit: (values: PrinterFormValues) => Promise<void>;
}

export function PrinterFormDialog({
  open,
  onOpenChange,
  printer,
  onSubmit,
}: PrinterFormDialogProps) {
  const isEdit = Boolean(printer);

  const form = useForm<PrinterFormValues>({
    resolver: zodResolver(printerFormSchema),
    defaultValues: {
      modelo: "",
      propietario: "",
      comentario: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        modelo: printer?.modelo ?? "",
        propietario: printer?.propietario ?? "",
        comentario: printer?.comentario ?? "",
      });
    }
  }, [open, printer, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(values);
      toast.success(isEdit ? "Fotocopiadora actualizada." : "Fotocopiadora registrada.");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar la fotocopiadora.");
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar fotocopiadora" : "Nueva fotocopiadora"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Actualiza la información del equipo en taller."
              : "Registra una fotocopiadora que ingresa al taller para mantenimiento."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="modelo">
              Modelo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="modelo"
              placeholder="Ej: Epson L3250"
              {...form.register("modelo")}
              autoFocus
            />
            {form.formState.errors.modelo && (
              <p className="text-xs text-destructive">{form.formState.errors.modelo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="propietario">
              Propietario <span className="text-destructive">*</span>
            </Label>
            <Input
              id="propietario"
              placeholder="Ej: Banco Continental — Agencia San Isidro"
              {...form.register("propietario")}
            />
            {form.formState.errors.propietario && (
              <p className="text-xs text-destructive">
                {form.formState.errors.propietario.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comentario">Comentario</Label>
            <Textarea
              id="comentario"
              placeholder="Detalles del problema, observaciones, etc."
              {...form.register("comentario")}
            />
            {form.formState.errors.comentario && (
              <p className="text-xs text-destructive">
                {form.formState.errors.comentario.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={form.formState.isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Guardando…" : isEdit ? "Guardar cambios" : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
