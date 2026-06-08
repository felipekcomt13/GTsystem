"use client";

import * as React from "react";
import { Package } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataToolbar } from "@/components/shared/data-toolbar";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PrinterFormDialog } from "@/modules/printers/components/printer-form-dialog";
import { PrinterTable } from "@/modules/printers/components/printer-table";
import { usePrinters } from "@/modules/printers/hooks/use-printers";
import type { Printer, PrinterStatus } from "@/types/printer";

type DepositFilter = "ALL" | "DEPOSITO" | "ENTREGADA";

const DEPOSIT_STATUSES: PrinterStatus[] = ["DEPOSITO", "ENTREGADA"];

export function DepositView() {
  const { printers, loading, error, update, remove, markAsDelivered } = usePrinters();
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<DepositFilter>("ALL");
  const [editing, setEditing] = React.useState<Printer | null>(null);
  const [toDelete, setToDelete] = React.useState<Printer | null>(null);
  const [toDeliver, setToDeliver] = React.useState<Printer | null>(null);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return printers
      .filter((p) => DEPOSIT_STATUSES.includes(p.estado))
      .filter((p) => (filter === "ALL" ? true : p.estado === filter))
      .filter((p) => {
        if (!q) return true;
        return (
          p.modelo.toLowerCase().includes(q) ||
          p.propietario.toLowerCase().includes(q) ||
          (p.comentario?.toLowerCase().includes(q) ?? false)
        );
      });
  }, [printers, filter, search]);

  const counts = React.useMemo(() => {
    const all = printers.filter((p) => DEPOSIT_STATUSES.includes(p.estado));
    return {
      all: all.length,
      deposit: all.filter((p) => p.estado === "DEPOSITO").length,
      delivered: all.filter((p) => p.estado === "ENTREGADA").length,
    };
  }, [printers]);

  const handleSubmit = async (values: {
    modelo: string;
    propietario: string;
    comentario?: string;
  }) => {
    if (!editing) return;
    await update(editing.id, values);
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await remove(toDelete.id);
      toast.success("Registro eliminado.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo eliminar.");
    }
  };

  const handleDeliver = async () => {
    if (!toDeliver) return;
    try {
      await markAsDelivered(toDeliver.id);
      toast.success(`"${toDeliver.modelo}" entregada al cliente.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo marcar como entregada.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Depósito"
        description="Fotocopiadoras reparadas. Cambia el estado a 'Entregada' cuando el cliente recoja el equipo."
      />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as DepositFilter)}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="ALL">Todas ({counts.all})</TabsTrigger>
            <TabsTrigger value="DEPOSITO">En depósito ({counts.deposit})</TabsTrigger>
            <TabsTrigger value="ENTREGADA">Entregadas ({counts.delivered})</TabsTrigger>
          </TabsList>
          <DataToolbar
            searchValue={search}
            onSearchChange={setSearch}
            placeholder="Buscar por modelo, propietario o comentario…"
            className="sm:w-auto"
          />
        </div>

        {error && (
          <div className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <TabsContent value={filter}>
          {loading ? (
            <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">
              Cargando depósito…
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Package className="h-6 w-6" />}
              title={search ? "Sin resultados" : "Sin equipos en este estado"}
              description={
                search
                  ? "Intenta con otros términos de búsqueda."
                  : "Cuando se complete una reparación en taller, aparecerá aquí."
              }
            />
          ) : (
            <PrinterTable
              printers={filtered}
              showStatus
              showFechaSalidaTaller
              showFechaEntrega
              onEdit={(p) => setEditing(p)}
              onDelete={(p) => setToDelete(p)}
              onMarkAsDelivered={(p) => setToDeliver(p)}
            />
          )}
        </TabsContent>
      </Tabs>

      <PrinterFormDialog
        open={Boolean(editing)}
        onOpenChange={(o) => !o && setEditing(null)}
        printer={editing}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Eliminar registro"
        description={
          toDelete
            ? `Se eliminará el historial de "${toDelete.modelo}". Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Eliminar"
        destructive
        onConfirm={handleDelete}
      />

      <ConfirmDialog
        open={Boolean(toDeliver)}
        onOpenChange={(o) => !o && setToDeliver(null)}
        title="Marcar como entregada"
        description={
          toDeliver
            ? `Se registrará la entrega de "${toDeliver.modelo}" al cliente ${toDeliver.propietario}.`
            : ""
        }
        confirmLabel="Marcar entregada"
        onConfirm={handleDeliver}
      />
    </div>
  );
}
