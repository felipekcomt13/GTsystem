import { PRINTER_STATUS_BADGE, PRINTER_STATUS_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { PrinterStatus } from "@/types/printer";

interface PrinterStatusBadgeProps {
  status: PrinterStatus;
}

export function PrinterStatusBadge({ status }: PrinterStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        PRINTER_STATUS_BADGE[status],
      )}
    >
      {PRINTER_STATUS_LABEL[status]}
    </span>
  );
}
