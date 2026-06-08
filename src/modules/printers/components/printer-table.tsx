"use client";

import * as React from "react";
import { ArrowRightCircle, CheckCircle2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import type { Printer } from "@/types/printer";

import { PrinterStatusBadge } from "./printer-status-badge";

interface PrinterTableProps {
  printers: Printer[];
  showStatus?: boolean;
  showFechaSalidaTaller?: boolean;
  showFechaEntrega?: boolean;
  onEdit: (printer: Printer) => void;
  onDelete: (printer: Printer) => void;
  onMoveToDeposit?: (printer: Printer) => void;
  onMarkAsDelivered?: (printer: Printer) => void;
}

export function PrinterTable({
  printers,
  showStatus = false,
  showFechaSalidaTaller = false,
  showFechaEntrega = false,
  onEdit,
  onDelete,
  onMoveToDeposit,
  onMarkAsDelivered,
}: PrinterTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Modelo</TableHead>
            <TableHead>Propietario</TableHead>
            <TableHead className="hidden md:table-cell">Comentario</TableHead>
            <TableHead className="whitespace-nowrap">Fecha ingreso</TableHead>
            {showFechaSalidaTaller && (
              <TableHead className="whitespace-nowrap hidden lg:table-cell">
                Salida taller
              </TableHead>
            )}
            {showFechaEntrega && (
              <TableHead className="whitespace-nowrap hidden lg:table-cell">Entrega</TableHead>
            )}
            {showStatus && <TableHead>Estado</TableHead>}
            <TableHead className="w-12 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {printers.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.modelo}</TableCell>
              <TableCell className="text-sm">{p.propietario}</TableCell>
              <TableCell className="hidden max-w-xs truncate text-sm text-muted-foreground md:table-cell">
                {p.comentario ?? "—"}
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm">
                {formatDate(p.fechaIngreso)}
              </TableCell>
              {showFechaSalidaTaller && (
                <TableCell className="whitespace-nowrap text-sm hidden lg:table-cell">
                  {formatDate(p.fechaSalidaTaller)}
                </TableCell>
              )}
              {showFechaEntrega && (
                <TableCell className="whitespace-nowrap text-sm hidden lg:table-cell">
                  {formatDate(p.fechaEntrega)}
                </TableCell>
              )}
              {showStatus && (
                <TableCell>
                  <PrinterStatusBadge status={p.estado} />
                </TableCell>
              )}
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Acciones">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEdit(p)}>
                      <Pencil className="h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    {onMoveToDeposit && p.estado === "TALLER" && (
                      <DropdownMenuItem onClick={() => onMoveToDeposit(p)}>
                        <ArrowRightCircle className="h-4 w-4" /> Mover a depósito
                      </DropdownMenuItem>
                    )}
                    {onMarkAsDelivered && p.estado === "DEPOSITO" && (
                      <DropdownMenuItem onClick={() => onMarkAsDelivered(p)}>
                        <CheckCircle2 className="h-4 w-4" /> Marcar como entregada
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(p)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" /> Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
