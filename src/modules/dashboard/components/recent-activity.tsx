import { ArrowRightCircle, CheckCircle2, Wrench } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelative } from "@/lib/utils";
import type { DashboardData } from "../hooks/use-dashboard-data";

const ICON = {
  ingreso: { Icon: Wrench, color: "bg-amber-100 text-amber-700" },
  deposito: { Icon: ArrowRightCircle, color: "bg-blue-100 text-blue-700" },
  entrega: { Icon: CheckCircle2, color: "bg-emerald-100 text-emerald-700" },
} as const;

interface RecentActivityProps {
  items: DashboardData["recentActivity"];
}

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Actividad reciente</CardTitle>
        <CardDescription>Últimas transiciones registradas en el flujo.</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Sin actividad registrada.
          </p>
        ) : (
          <ul className="space-y-4">
            {items.map((it) => {
              const { Icon, color } = ICON[it.kind];
              return (
                <li key={it.id} className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm font-medium leading-tight">{it.label}</p>
                    <p className="text-xs text-muted-foreground">{it.sublabel}</p>
                  </div>
                  <span className="whitespace-nowrap text-xs text-muted-foreground">
                    {formatRelative(it.when)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
