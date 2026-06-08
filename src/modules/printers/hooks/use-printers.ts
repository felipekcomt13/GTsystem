"use client";

import * as React from "react";

import { PrinterService } from "@/services/printer-service";
import type { Printer, PrinterCreateInput, PrinterUpdateInput } from "@/types/printer";

interface UsePrintersState {
  printers: Printer[];
  loading: boolean;
  error: string | null;
}

export function usePrinters() {
  const [state, setState] = React.useState<UsePrintersState>({
    printers: [],
    loading: true,
    error: null,
  });

  const refresh = React.useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const printers = await PrinterService.list();
      const sorted = [...printers].sort(
        (a, b) => new Date(b.fechaIngreso).getTime() - new Date(a.fechaIngreso).getTime(),
      );
      setState({ printers: sorted, loading: false, error: null });
    } catch (err) {
      setState({
        printers: [],
        loading: false,
        error: err instanceof Error ? err.message : "Error al cargar fotocopiadoras.",
      });
    }
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = React.useCallback(
    async (input: PrinterCreateInput) => {
      await PrinterService.create(input);
      await refresh();
    },
    [refresh],
  );

  const update = React.useCallback(
    async (id: string, patch: PrinterUpdateInput) => {
      await PrinterService.updateInfo(id, patch);
      await refresh();
    },
    [refresh],
  );

  const remove = React.useCallback(
    async (id: string) => {
      await PrinterService.delete(id);
      await refresh();
    },
    [refresh],
  );

  const moveToDeposit = React.useCallback(
    async (id: string) => {
      await PrinterService.moveToDeposit(id);
      await refresh();
    },
    [refresh],
  );

  const markAsDelivered = React.useCallback(
    async (id: string) => {
      await PrinterService.markAsDelivered(id);
      await refresh();
    },
    [refresh],
  );

  return {
    ...state,
    refresh,
    create,
    update,
    remove,
    moveToDeposit,
    markAsDelivered,
  };
}
