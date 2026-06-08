"use client";

import * as React from "react";
import { Plus, Wrench } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataToolbar } from "@/components/shared/data-toolbar";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { PrinterFormDialog } from "@/modules/printers/components/printer-form-dialog";
import { PrinterTable } from "@/modules/printers/components/printer-table";
import { usePrinters } from "@/modules/printers/hooks/use-printers";
import type { Printer } from "@/types/printer";

export function WorkshopView() {
  const { printers, loading, error, create, update, remove, moveToDeposit } = usePrinters();
  const [search, setSearch] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Printer | null>(null);
  const [toDelete, setToDelete] = React.useState<Printer | null>(null);
  const [toMove, setToMove] = React.useState<Printer | null>(null);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const onlyTaller = printers.filter((p) => p.estado === "TALLER");
    if (!q) return onlyTaller;
    return onlyTaller.filter(
      (p) =>
        p.modelo.toLowerCase().includes(q) ||
        p.propietario.toLowerCase().includes(q) ||
        (p.comentario?.toLowerCase().includes(q) ?? false),
    );
  }, [printers, search]);

  const handleSubmit = async (values: {
    modelo: string;
    propietario: string;
    comentario?: string;
  }) => {
    if (editing) {
      await update(editing.id, values);
    } else {
      await create(values);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await remove(toDelete.id);
      toast.success("Fotocopiadora eliminada.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo eliminar.");
    }
  };

  const handleMove = async () => {
    if (!toMove) return;
    try {
      await moveToDeposit(toMove.id);
      toast.success(`"${toMove.modelo}" se movió a depósito.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo mover a depósito.");
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Taller"
        description="Fotocopiadoras en mantenimiento. Una vez reparadas, muévelas al depósito."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Nueva fotocopiadora
          </Button>
        }
      />

      <DataToolbar
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Buscar por modelo, propietario o comentario…"
      />

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">
          Cargando fotocopiadoras…
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Wrench className="h-6 w-6" />}
          title={search ? "Sin resultados" : "No hay fotocopiadoras en taller"}
          description={
            search
              ? "Intenta con otros términos de búsqueda."
              : "Registra la primera fotocopiadora para comenzar."
          }
          action={
            !search && (
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4" /> Nueva fotocopiadora
              </Button>
            )
          }
        />
      ) : (
        <PrinterTable
          printers={filtered}
          onEdit={(p) => {
            setEditing(p);
            setFormOpen(true);
          }}
          onDelete={(p) => setToDelete(p)}
          onMoveToDeposit={(p) => setToMove(p)}
        />
      )}

      <PrinterFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        printer={editing}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Eliminar fotocopiadora"
        description={
          toDelete
            ? `Se eliminará permanentemente "${toDelete.modelo}" de ${toDelete.propietario}. Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Eliminar"
        destructive
        onConfirm={handleDelete}
      />

      <ConfirmDialog
        open={Boolean(toMove)}
        onOpenChange={(o) => !o && setToMove(null)}
        title="Mover a depósito"
        description={
          toMove
            ? `La fotocopiadora "${toMove.modelo}" pasará al depósito y quedará lista para recoger.`
            : ""
        }
        confirmLabel="Mover a depósito"
        onConfirm={handleMove}
      />
    </div>
  );
}
