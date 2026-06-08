import { CalendarDays } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EVENT_TYPE_COLOR, EVENT_TYPE_LABEL } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import type { CalendarEvent } from "@/types/calendar";

interface UpcomingEventsProps {
  events: CalendarEvent[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Próximos eventos</CardTitle>
        <CardDescription>Agenda de los próximos 7 días.</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center text-sm text-muted-foreground">
            <CalendarDays className="h-6 w-6" />
            Sin eventos programados.
          </div>
        ) : (
          <ul className="space-y-3">
            {events.map((e) => {
              const colors = EVENT_TYPE_COLOR[e.tipo];
              return (
                <li
                  key={e.id}
                  className="flex items-start gap-3 rounded-lg border bg-card p-3"
                  style={{ borderLeft: `4px solid ${colors.border}` }}
                >
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm font-medium leading-tight">{e.titulo}</p>
                    <p className="text-xs text-muted-foreground">
                      {EVENT_TYPE_LABEL[e.tipo]}
                      {e.tecnicoResponsable ? ` · ${e.tecnicoResponsable}` : ""}
                    </p>
                  </div>
                  <span className="whitespace-nowrap text-xs text-muted-foreground">
                    {formatDateTime(e.fechaInicio)}
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
