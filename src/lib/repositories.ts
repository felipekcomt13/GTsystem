import { LocalCalendarRepository } from "@/repositories/local/local-calendar-repository";
import { LocalPrinterRepository } from "@/repositories/local/local-printer-repository";
import { SupabaseCalendarRepository } from "@/repositories/supabase/supabase-calendar-repository";
import { SupabasePrinterRepository } from "@/repositories/supabase/supabase-printer-repository";
import type { CalendarRepository, PrinterRepository } from "@/repositories/types";

type DataSource = "local" | "supabase";

function resolveDataSource(): DataSource {
  const raw = process.env.NEXT_PUBLIC_DATA_SOURCE;
  return raw === "supabase" ? "supabase" : "local";
}

const dataSource = resolveDataSource();

export const printerRepository: PrinterRepository =
  dataSource === "supabase" ? new SupabasePrinterRepository() : new LocalPrinterRepository();

export const calendarRepository: CalendarRepository =
  dataSource === "supabase" ? new SupabaseCalendarRepository() : new LocalCalendarRepository();

export const activeDataSource: DataSource = dataSource;
