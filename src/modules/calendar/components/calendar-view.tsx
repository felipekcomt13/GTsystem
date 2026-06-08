"use client";

import * as React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import type {
  DateSelectArg,
  DatesSetArg,
  DayHeaderContentArg,
  EventClickArg,
  EventDropArg,
  EventInput,
} from "@fullcalendar/core";
import type { EventResizeDoneArg } from "@fullcalendar/interaction";

import { Plus } from "lucide-react";

import { EVENT_TYPE_COLOR, EVENT_TYPE_LABEL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/calendar";

import { EventFormDialog } from "./event-form-dialog";
import { useCalendarEvents } from "../hooks/use-calendar-events";
import type { EventSubmitValues } from "../schemas";

function DayHeader({ arg }: { arg: DayHeaderContentArg }) {
  // En vistas con horas (semana/día) renderizamos día corto arriba y número grande debajo.
  if (arg.view.type.startsWith("timeGrid")) {
    const weekday = arg.date.toLocaleDateString("es-ES", { weekday: "short" }).replace(".", "");
    const dayNumber = arg.date.getDate();
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-2",
          arg.isToday && "text-accent",
        )}
      >
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {weekday}
        </span>
        <span
          className={cn(
            "mt-1 flex h-9 w-9 items-center justify-center rounded-full text-xl font-semibold",
            arg.isToday ? "bg-accent text-accent-foreground" : "text-foreground",
          )}
        >
          {dayNumber}
        </span>
      </div>
    );
  }
  // Vista mensual: día corto centrado.
  const weekday = arg.date.toLocaleDateString("es-ES", { weekday: "short" }).replace(".", "");
  return (
    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {weekday}
    </span>
  );
}

export function CalendarView() {
  const { events, loading, error, create, update, remove } = useCalendarEvents();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<CalendarEvent | null>(null);
  const [range, setRange] = React.useState<{ start: string; end: string } | null>(null);

  const fcEvents: EventInput[] = React.useMemo(
    () =>
      events.map((e) => {
        const colors = EVENT_TYPE_COLOR[e.tipo];
        return {
          id: e.id,
          title: e.titulo,
          start: e.fechaInicio,
          end: e.fechaFin,
          backgroundColor: colors.bg,
          borderColor: colors.border,
          textColor: colors.text,
          extendedProps: {
            tipo: e.tipo,
            tecnico: e.tecnicoResponsable,
            descripcion: e.descripcion,
          },
        } satisfies EventInput;
      }),
    [events],
  );

  const handleDateSelect = (arg: DateSelectArg) => {
    setEditing(null);
    setRange({ start: arg.start.toISOString(), end: arg.end.toISOString() });
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditing(null);
    setRange(null);
    setDialogOpen(true);
  };

  const handleEventClick = (arg: EventClickArg) => {
    const found = events.find((e) => e.id === arg.event.id);
    if (!found) return;
    setEditing(found);
    setRange(null);
    setDialogOpen(true);
  };

  const handleEventDrop = async (arg: EventDropArg) => {
    if (!arg.event.start || !arg.event.end) {
      arg.revert();
      return;
    }
    try {
      await update(arg.event.id, {
        fechaInicio: arg.event.start.toISOString(),
        fechaFin: arg.event.end.toISOString(),
      });
    } catch {
      arg.revert();
    }
  };

  const handleEventResize = async (arg: EventResizeDoneArg) => {
    if (!arg.event.start || !arg.event.end) {
      arg.revert();
      return;
    }
    try {
      await update(arg.event.id, {
        fechaInicio: arg.event.start.toISOString(),
        fechaFin: arg.event.end.toISOString(),
      });
    } catch {
      arg.revert();
    }
  };

  const handleSubmit = async (values: EventSubmitValues) => {
    if (editing) {
      // Al editar solo tocamos título y horario; tipo/técnico/descripción se conservan.
      await update(editing.id, {
        titulo: values.titulo,
        fechaInicio: values.fechaInicio,
        fechaFin: values.fechaFin,
      });
    } else {
      // El formulario básico crea siempre reuniones.
      await create({
        titulo: values.titulo,
        fechaInicio: values.fechaInicio,
        fechaFin: values.fechaFin,
        tipo: "REUNION",
        tecnicoResponsable: "",
      });
    }
  };

  const handleDelete = editing ? () => remove(editing.id) : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendario"
        description="Gestiona las visitas técnicas, instalaciones, mantenimientos y reuniones del equipo."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Nueva reunión
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card px-4 py-3 text-xs">
        <span className="font-medium uppercase tracking-wide text-muted-foreground">
          Tipos de evento
        </span>
        <span className="text-border">·</span>
        {(Object.keys(EVENT_TYPE_LABEL) as Array<keyof typeof EVENT_TYPE_LABEL>).map((t) => (
          <div key={t} className="flex items-center gap-1.5">
            <span
              className="h-3 w-3 rounded-full border"
              style={{
                backgroundColor: EVENT_TYPE_COLOR[t].bg,
                borderColor: EVENT_TYPE_COLOR[t].border,
              }}
            />
            <span className="text-foreground">{EVENT_TYPE_LABEL[t]}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-sm text-muted-foreground">Cargando eventos…</div>
        ) : (
          <div className="gts-calendar p-3 md:p-5">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              locale={esLocale}
              firstDay={1}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              buttonText={{
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día",
              }}
              height="auto"
              contentHeight={680}
              allDaySlot={false}
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
              slotDuration="00:30:00"
              slotLabelInterval="01:00:00"
              slotLabelFormat={{
                hour: "numeric",
                minute: "2-digit",
                hour12: false,
              }}
              expandRows
              nowIndicator
              scrollTime="08:00:00"
              dayHeaderContent={(arg) => <DayHeader arg={arg} />}
              dayMaxEvents
              selectable
              selectMirror
              editable
              eventDisplay="block"
              eventTimeFormat={{
                hour: "numeric",
                minute: "2-digit",
                hour12: false,
              }}
              events={fcEvents}
              select={handleDateSelect}
              eventClick={handleEventClick}
              eventDrop={handleEventDrop}
              eventResize={handleEventResize}
              datesSet={(_arg: DatesSetArg) => {
                // Hook reservado para integraciones con paginado por rango (Supabase).
              }}
            />
          </div>
        )}
      </div>

      <EventFormDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) {
            setEditing(null);
            setRange(null);
          }
        }}
        event={editing}
        initialRange={range}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
}
