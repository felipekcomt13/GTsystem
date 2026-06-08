"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardData } from "../hooks/use-dashboard-data";

interface MonthlyIntakeChartProps {
  data: DashboardData["monthlyIntake"];
}

export function MonthlyIntakeChart({ data }: MonthlyIntakeChartProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Ingresos a taller</CardTitle>
        <CardDescription>Equipos ingresados en los últimos 6 meses.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid hsl(214 32% 91%)",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="ingresos"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#2563eb" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
