import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  hint?: string;
  accent?: "amber" | "blue" | "emerald" | "violet";
}

const ACCENTS: Record<NonNullable<StatCardProps["accent"]>, string> = {
  amber: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
  emerald: "bg-emerald-100 text-emerald-700",
  violet: "bg-violet-100 text-violet-700",
};

export function StatCard({ label, value, icon, hint, accent = "blue" }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="text-3xl font-semibold leading-tight">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", ACCENTS[accent])}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
