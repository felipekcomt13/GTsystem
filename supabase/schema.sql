-- =====================================================================
-- GTSystem — Esquema de base de datos (Supabase / PostgreSQL)
-- =====================================================================
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotente: se puede correr varias veces sin error.
--
-- Tablas:
--   printers         → impresoras en el flujo TALLER → DEPOSITO → ENTREGADA
--   calendar_events  → visitas, instalaciones, mantenimientos y reuniones
--
-- Mapping snake_case (DB) ↔ camelCase (dominio TypeScript):
--   fecha_ingreso        → fechaIngreso
--   fecha_salida_taller  → fechaSalidaTaller
--   fecha_entrega        → fechaEntrega
--   fecha_inicio         → fechaInicio
--   fecha_fin            → fechaFin
--   tecnico_responsable  → tecnicoResponsable
-- =====================================================================

-- gen_random_uuid() vive en pgcrypto (suele venir habilitado en Supabase).
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Tabla: printers
-- ---------------------------------------------------------------------
create table if not exists public.printers (
  id                   uuid         primary key default gen_random_uuid(),
  modelo               text         not null,
  propietario          text         not null,
  comentario           text,
  fecha_ingreso        timestamptz  not null default now(),
  fecha_salida_taller  timestamptz,
  fecha_entrega        timestamptz,
  estado               text         not null default 'TALLER'
                         check (estado in ('TALLER', 'DEPOSITO', 'ENTREGADA'))
);

comment on table public.printers is 'Impresoras en mantenimiento/depósito/entregadas (GTSystem).';

-- Índices para los listados y filtros habituales.
create index if not exists printers_estado_idx
  on public.printers (estado);
create index if not exists printers_fecha_ingreso_idx
  on public.printers (fecha_ingreso desc);

-- ---------------------------------------------------------------------
-- Tabla: calendar_events
-- ---------------------------------------------------------------------
create table if not exists public.calendar_events (
  id                   uuid         primary key default gen_random_uuid(),
  titulo               text         not null,
  descripcion          text,
  fecha_inicio         timestamptz  not null,
  fecha_fin            timestamptz  not null,
  tecnico_responsable  text         not null,
  tipo                 text         not null
                         check (tipo in ('VISITA', 'INSTALACION', 'MANTENIMIENTO', 'REUNION')),
  -- La fecha de fin debe ser posterior a la de inicio (espejo de CalendarService).
  constraint calendar_events_rango_valido check (fecha_fin > fecha_inicio)
);

comment on table public.calendar_events is 'Eventos de calendario: visitas, instalaciones, mantenimientos y reuniones (GTSystem).';

create index if not exists calendar_events_fecha_inicio_idx
  on public.calendar_events (fecha_inicio);
create index if not exists calendar_events_fecha_fin_idx
  on public.calendar_events (fecha_fin);

-- ---------------------------------------------------------------------
-- Row Level Security (RLS)
-- ---------------------------------------------------------------------
-- La app es interna y, hoy por hoy, no tiene autenticación: el navegador
-- usa la ANON KEY pública. Para que funcione, se habilita RLS con políticas
-- permisivas (acceso total a anon y authenticated).
--
-- ⚠️  SEGURIDAD: cualquiera con la URL + anon key puede leer/escribir estas
--     tablas. Es aceptable para un entorno interno/demo. Cuando se agregue
--     Supabase Auth, reemplazar las políticas `using (true)` por reglas
--     basadas en `auth.uid()` / roles.
-- ---------------------------------------------------------------------
alter table public.printers        enable row level security;
alter table public.calendar_events enable row level security;

drop policy if exists "printers_acceso_total" on public.printers;
create policy "printers_acceso_total"
  on public.printers
  for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "calendar_events_acceso_total" on public.calendar_events;
create policy "calendar_events_acceso_total"
  on public.calendar_events
  for all
  to anon, authenticated
  using (true)
  with check (true);
