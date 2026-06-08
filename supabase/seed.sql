-- =====================================================================
-- GTSystem — Datos de ejemplo (opcional)
-- =====================================================================
-- Espejo de src/repositories/seed.ts. Ejecutar DESPUÉS de schema.sql.
-- Las fechas son relativas a now() (CURRENT_TIMESTAMP), igual que el seed local.
--
-- Re-ejecutable: primero limpia las tablas para no duplicar.
-- (Comenta los TRUNCATE si quieres conservar lo existente.)
-- =====================================================================

truncate table public.printers;
truncate table public.calendar_events;

-- ---------------------------------------------------------------------
-- Impresoras
-- ---------------------------------------------------------------------
insert into public.printers
  (modelo, propietario, comentario, fecha_ingreso, fecha_salida_taller, fecha_entrega, estado)
values
  ('Epson L3250',            'Banco Continental — Agencia San Isidro', 'Atasco recurrente en bandeja de salida.', now() - interval '2 days',  null,                    null,                    'TALLER'),
  ('HP LaserJet Pro M404dn', 'Estudio Jurídico Vargas & Asociados',    'Cambio de fusor y limpieza profunda.',    now() - interval '4 days',  null,                    null,                    'TALLER'),
  ('Canon imageRUNNER 2625', 'Clínica Internacional — Sede Lima',      'Calibración de color y firmware.',        now() - interval '6 days',  null,                    null,                    'TALLER'),
  ('Brother HL-L2360DW',     'Notaría Paino',                          null,                                      now() - interval '10 days', now() - interval '1 day', null,                    'DEPOSITO'),
  ('Epson EcoTank L6171',    'Municipalidad de Surco',                 'Sistema de tinta limpio. Listo para recoger.', now() - interval '14 days', now() - interval '3 days', null,               'DEPOSITO'),
  ('HP OfficeJet Pro 9015e', 'Importadora Trujillo S.A.C.',            null,                                      now() - interval '25 days', now() - interval '15 days', now() - interval '10 days', 'ENTREGADA'),
  ('Samsung Xpress M2070',   'Colegio San Agustín',                    'Mantenimiento preventivo completo.',      now() - interval '40 days', now() - interval '30 days', now() - interval '22 days', 'ENTREGADA');

-- ---------------------------------------------------------------------
-- Eventos de calendario
-- ---------------------------------------------------------------------
insert into public.calendar_events
  (titulo, descripcion, fecha_inicio, fecha_fin, tecnico_responsable, tipo)
values
  ('Visita técnica — Banco Continental',          'Revisión de impresora L3250 en agencia San Isidro.', now() + interval '1 day'  + interval '1 hour',  now() + interval '1 day'  + interval '3 hours', 'Carlos Mendoza', 'VISITA'),
  ('Instalación de cámaras IP',                   'Instalación de 6 cámaras en oficinas centrales.',    now() + interval '2 days',                       now() + interval '2 days' + interval '5 hours', 'Luis Vargas',    'INSTALACION'),
  ('Mantenimiento preventivo trimestral',         'Clínica Internacional — flotas de impresoras.',      now() + interval '3 days' + interval '5 hours',  now() + interval '3 days' + interval '8 hours', 'Ana Quispe',     'MANTENIMIENTO'),
  ('Reunión semanal de servicio',                 'Revisión de tickets abiertos y planning de la semana.', now() + interval '7 hours',                   now() + interval '8 hours',                     'Equipo GTS',     'REUNION'),
  ('Visita técnica — Notaría Paino',              'Entrega de equipo reparado y capacitación rápida.',  now() + interval '5 days' + interval '2 hours',  now() + interval '5 days' + interval '3 hours', 'Carlos Mendoza', 'VISITA'),
  ('Mantenimiento — Municipalidad de Surco',      null,                                                 now() + interval '7 days' + interval '30 minutes', now() + interval '7 days' + interval '4 hours', 'Luis Vargas',  'MANTENIMIENTO'),
  ('Instalación de alarmas — Colegio San Agustín','Sistema integral de alarmas en 3 sedes.',            now() + interval '10 days',                      now() + interval '10 days' + interval '6 hours','Ana Quispe',     'INSTALACION'),
  ('Reunión con cliente — Importadora Trujillo',  'Propuesta de contrato anual de mantenimiento.',      now() - interval '2 days',                       now() - interval '2 days' + interval '1 hour',  'Equipo GTS',     'REUNION');
