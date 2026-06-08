"use client";

import { PageHeader } from "@/components/shared/page-header";

import { KpiCards } from "./kpi-cards";
import { MonthlyIntakeChart } from "./monthly-intake-chart";
import { RecentActivity } from "./recent-activity";
import { StatusBarChart } from "./status-bar-chart";
import { UpcomingEvents } from "./upcoming-events";
import { useDashboardData } from "../hooks/use-dashboard-data";

export function DashboardView() {
  const { data, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Cargando datos…" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl border bg-muted/40" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" />
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error ?? "No se pudo cargar la información."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visión general del estado operativo del servicio técnico."
      />

      <KpiCards counts={data.counts} />

      <div className="grid gap-4 lg:grid-cols-2">
        <StatusBarChart data={data.statusDistribution} />
        <MonthlyIntakeChart data={data.monthlyIntake} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentActivity items={data.recentActivity} />
        <UpcomingEvents events={data.eventosProximos} />
      </div>
    </div>
  );
}
