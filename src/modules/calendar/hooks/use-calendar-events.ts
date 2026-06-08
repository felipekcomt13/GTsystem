"use client";

import * as React from "react";

import { CalendarService } from "@/services/calendar-service";
import type {
  CalendarEvent,
  CalendarEventCreateInput,
  CalendarEventUpdateInput,
} from "@/types/calendar";

interface State {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
}

export function useCalendarEvents() {
  const [state, setState] = React.useState<State>({ events: [], loading: true, error: null });

  const refresh = React.useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const events = await CalendarService.list();
      setState({ events, loading: false, error: null });
    } catch (err) {
      setState({
        events: [],
        loading: false,
        error: err instanceof Error ? err.message : "Error al cargar eventos.",
      });
    }
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = React.useCallback(
    async (input: CalendarEventCreateInput) => {
      await CalendarService.create(input);
      await refresh();
    },
    [refresh],
  );

  const update = React.useCallback(
    async (id: string, patch: CalendarEventUpdateInput) => {
      await CalendarService.update(id, patch);
      await refresh();
    },
    [refresh],
  );

  const remove = React.useCallback(
    async (id: string) => {
      await CalendarService.delete(id);
      await refresh();
    },
    [refresh],
  );

  return { ...state, refresh, create, update, remove };
}
