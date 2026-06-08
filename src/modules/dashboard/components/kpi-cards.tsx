import { CalendarDays, CheckCircle2, Package, Wrench } from "lucide-react";

import { StatCard } from "@/components/shared/stat-card";
import type { DashboardData } from "../hooks/use-dashboard-data";

interface KpiCardsProps {
  counts: DashboardData["counts"];
}

export function KpiCards({ counts }: KpiCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="En taller"
        value={counts.taller}
        icon={<Wrench className="h-5 w-5" />}
        accent="amber"
        hint="Equipos en mantenimiento"
      />
      <StatCard
        label="En depósito"
        value={counts.deposito}
        icon={<Package className="h-5 w-5" />}
        accent="blue"
        hint="Listas para recoger"
      />
      <StatCard
        label="Entregadas"
        value={counts.entregada}
        icon={<CheckCircle2 className="h-5 w-5" />}
        accent="emerald"
        hint="Histórico de entregas"
      />
      <StatCard
        label="Eventos próximos"
        value={counts.eventosProximos}
        icon={<CalendarDays className="h-5 w-5" />}
        accent="violet"
        hint="En los próximos 7 días"
      />
    </div>
  );
}
