"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CalendarEvent } from "@/types/calendar";

import { eventFormSchema, type EventFormValues, type EventSubmitValues } from "../schemas";
import { buildEndTimeOptions, startOptionsWith } from "../time-options";

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: CalendarEvent | null;
  initialRange?: { start: string; end: string } | null;
  onSubmit: (values: EventSubmitValues) => Promise<void>;
  onDelete?: () => Promise<void>;
}

const pad = (n: number) => n.toString().padStart(2, "0");

function isoToDatePart(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function isoToTimePart(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function todayDatePart(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function combineToISO(fecha: string, hora: string): string {
  if (!fecha || !hora) return "";
  const d = new Date(`${fecha}T${hora}:00`);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}

export function EventFormDialog({
  open,
  onOpenChange,
  event,
  initialRange,
  onSubmit,
  onDelete,
}: EventFormDialogProps) {
  const isEdit = Boolean(event);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      titulo: "",
      fecha: todayDatePart(),
      horaInicio: "09:00",
      horaFin: "09:30",
    },
  });

  React.useEffect(() => {
    if (!open) return;
    if (event) {
      form.reset({
        titulo: event.titulo,
        fecha: isoToDatePart(event.fechaInicio),
        horaInicio: isoToTimePart(event.fechaInicio),
        horaFin: isoToTimePart(event.fechaFin),
      });
    } else {
      form.reset({
        titulo: "",
        fecha: isoToDatePart(initialRange?.start) || todayDatePart(),
        horaInicio: isoToTimePart(initialRange?.start) || "09:00",
        horaFin: isoToTimePart(initialRange?.end) || "09:30",
      });
    }
  }, [open, event, initialRange, form]);

  const horaInicio = form.watch("horaInicio");
  const endOptions = React.useMemo(() => buildEndTimeOptions(horaInicio), [horaInicio]);
  const startOptions = React.useMemo(() => startOptionsWith(horaInicio), [horaInicio]);

  // Si la hora de fin deja de ser válida tras cambiar el inicio, se ajusta a la 1ª opción (inicio + 30).
  React.useEffect(() => {
    if (!horaInicio) return;
    const options = buildEndTimeOptions(horaInicio);
    const current = form.getValues("horaFin");
    if (options.length > 0 && !options.some((o) => o.value === current)) {
      form.setValue("horaFin", options[0]!.value, { shouldValidate: true });
    }
  }, [horaInicio, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSubmit({
        titulo: values.titulo,
        fechaInicio: combineToISO(values.fecha, values.horaInicio),
        fechaFin: combineToISO(values.fecha, values.horaFin),
      });
      toast.success(isEdit ? "Reunión actualizada." : "Reunión creada.");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar la reunión.");
    }
  });

  const handleDelete = async () => {
    if (!onDelete) return;
    try {
      await onDelete();
      toast.success("Reunión eliminada.");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo eliminar la reunión.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar reunión" : "Nueva reunión"}</DialogTitle>
          <DialogDescription>Agenda una reunión: título, fecha y horario.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input
              id="titulo"
              placeholder="Ej: Reunión semanal de servicio"
              {...form.register("titulo")}
              autoFocus
            />
            {form.formState.errors.titulo && (
              <p className="text-xs text-destructive">{form.formState.errors.titulo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha">
              Fecha <span className="text-destructive">*</span>
            </Label>
            <Input id="fecha" type="date" {...form.register("fecha")} />
            {form.formState.errors.fecha && (
              <p className="text-xs text-destructive">{form.formState.errors.fecha.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="horaInicio">
                Hora de inicio <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={form.control}
                name="horaInicio"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="horaInicio">
                      <SelectValue placeholder="Selecciona…" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {startOptions.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horaFin">
                Hora de fin <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={form.control}
                name="horaFin"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="horaFin">
                      <SelectValue placeholder="Selecciona…" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {endOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.horaFin && (
                <p className="text-xs text-destructive">{form.formState.errors.horaFin.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="flex-row items-center justify-between gap-2 sm:justify-between">
            <div>
              {isEdit && onDelete && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleDelete}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" /> Eliminar
                </Button>
              )}
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Guardando…"
                  : isEdit
                    ? "Guardar cambios"
                    : "Crear reunión"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
