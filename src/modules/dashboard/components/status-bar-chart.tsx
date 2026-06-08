"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardData } from "../hooks/use-dashboard-data";

interface StatusBarChartProps {
  data: DashboardData["statusDistribution"];
}

const COLORS: Record<string, string> = {
  Taller: "#d97706",
  Depósito: "#2563eb",
  Entregadas: "#059669",
};

export function StatusBarChart({ data }: StatusBarChartProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Distribución por estado</CardTitle>
        <CardDescription>Cantidad de fotocopiadoras en cada etapa del flujo.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" vertical={false} />
              <XAxis dataKey="estado" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid hsl(214 32% 91%)",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="cantidad" radius={[8, 8, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.estado} fill={COLORS[entry.estado] ?? "#2563eb"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
