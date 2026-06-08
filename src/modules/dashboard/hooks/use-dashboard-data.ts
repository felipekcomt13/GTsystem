"use client";

import * as React from "react";
import { format, parseISO, startOfMonth, subMonths } from "date-fns";
import { es } from "date-fns/locale";

import { CalendarService } from "@/services/calendar-service";
import { PrinterService } from "@/services/printer-service";
import type { CalendarEvent } from "@/types/calendar";
import type { Printer } from "@/types/printer";

export interface DashboardData {
  counts: { taller: number; deposito: number; entregada: number; eventosProximos: number };
  statusDistribution: Array<{ estado: string; cantidad: number }>;
  monthlyIntake: Array<{ mes: string; ingresos: number }>;
  recentActivity: Array<{
    id: string;
    label: string;
    sublabel: string;
    when: string;
    kind: "ingreso" | "deposito" | "entrega";
  }>;
  eventosProximos: CalendarEvent[];
}

interface State {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

function buildMonthlyIntake(printers: Printer[]) {
  const buckets = new Map<string, { mes: string; ingresos: number; key: number }>();
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = startOfMonth(subMonths(now, i));
    const key = d.getTime();
    buckets.set(d.toISOString(), {
      mes: format(d, "MMM yyyy", { locale: es }),
      ingresos: 0,
      key,
    });
  }
  for (const p of printers) {
    const d = startOfMonth(parseISO(p.fechaIngreso));
    const k = d.toISOString();
    const slot = buckets.get(k);
    if (slot) slot.ingresos += 1;
  }
  return Array.from(buckets.values())
    .sort((a, b) => a.key - b.key)
    .map(({ mes, ingresos }) => ({ mes, ingresos }));
}

function buildRecentActivity(printers: Printer[]): DashboardData["recentActivity"] {
  const events: DashboardData["recentActivity"] = [];
  for (const p of printers) {
    events.push({
      id: `${p.id}-ingreso`,
      label: `Ingreso a taller: ${p.modelo}`,
      sublabel: p.propietario,
      when: p.fechaIngreso,
      kind: "ingreso",
    });
    if (p.fechaSalidaTaller) {
      events.push({
        id: `${p.id}-deposito`,
        label: `Movida a depósito: ${p.modelo}`,
        sublabel: p.propietario,
        when: p.fechaSalidaTaller,
        kind: "deposito",
      });
    }
    if (p.fechaEntrega) {
      events.push({
        id: `${p.id}-entrega`,
        label: `Entregada: ${p.modelo}`,
        sublabel: p.propietario,
        when: p.fechaEntrega,
        kind: "entrega",
      });
    }
  }
  events.sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime());
  return events.slice(0, 6);
}

export function useDashboardData() {
  const [state, setState] = React.useState<State>({ data: null, loading: true, error: null });

  const load = React.useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const [printers, events] = await Promise.all([PrinterService.list(), CalendarService.list()]);

      const counts = {
        taller: printers.filter((p) => p.estado === "TALLER").length,
        deposito: printers.filter((p) => p.estado === "DEPOSITO").length,
        entregada: printers.filter((p) => p.estado === "ENTREGADA").length,
        eventosProximos: 0,
      };

      const now = Date.now();
      const in7Days = now + 7 * 24 * 60 * 60 * 1000;
      const proximos = events
        .filter((e) => {
          const t = new Date(e.fechaInicio).getTime();
          return t >= now && t <= in7Days;
        })
        .sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime());
      counts.eventosProximos = proximos.length;

      const data: DashboardData = {
        counts,
        statusDistribution: [
          { estado: "Taller", cantidad: counts.taller },
          { estado: "Depósito", cantidad: counts.deposito },
          { estado: "Entregadas", cantidad: counts.entregada },
        ],
        monthlyIntake: buildMonthlyIntake(printers),
        recentActivity: buildRecentActivity(printers),
        eventosProximos: proximos.slice(0, 5),
      };

      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : "Error al cargar dashboard.",
      });
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  return { ...state, refresh: load };
}
