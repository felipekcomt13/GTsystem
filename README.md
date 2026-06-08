# GTSystem — GrupoTelesistemas

Aplicación web interna para gestionar el flujo operativo del servicio técnico de **GrupoTelesistemas** (seguridad electrónica, ofimática y soporte técnico):

- **Taller** — fotocopiadoras actualmente en mantenimiento.
- **Depósito** — fotocopiadoras reparadas, listas para recoger o entregadas.
- **Calendario** — visitas técnicas, instalaciones, mantenimientos y reuniones.
- **Dashboard** — KPIs, gráficos y actividad reciente.

> La app está construida con una arquitectura de **repositorios intercambiables**: arranca con persistencia en `LocalStorage` y queda preparada para migrar a **Supabase** sin refactor mayor (basta intercambiar una variable de entorno y materializar las clases `Supabase*Repository`).

---

## Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript** (strict)
- **TailwindCSS** + **shadcn/ui** + **Lucide Icons**
- **React Hook Form** + **Zod**
- **FullCalendar** (vistas mensual / semanal / diaria, drag & drop)
- **Recharts** (gráficos del dashboard)
- **date-fns** con locale `es`
- **Supabase JS** (cliente preparado, sin uso aún)
- **pnpm**, **ESLint**

---

## Requisitos

- Node.js ≥ 18.18 (recomendado 20+)
- pnpm ≥ 9 (`npm install -g pnpm`)

---

## Puesta en marcha

```bash
pnpm install
cp .env.example .env.local   # opcional; la app corre sin esto en modo local
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000). La raíz redirige a `/dashboard`.

La **primera vez** que abres la app, se cargan datos mock de ejemplo (fotocopiadoras en diferentes estados y eventos pasados/futuros). Para regenerarlos: abre DevTools → Application → Local Storage → borra las claves `gts:*` y recarga.

### Scripts

| Script | Descripción |
|---|---|
| `pnpm dev` | Servidor de desarrollo en :3000 |
| `pnpm build` | Build de producción |
| `pnpm start` | Servir el build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |

---

## Estructura

```
src/
├── app/                          # App Router (RSC + layouts)
│   ├── (app)/                    # Layout con AppShell (sidebar+header)
│   │   ├── dashboard/page.tsx
│   │   ├── taller/page.tsx
│   │   ├── deposito/page.tsx
│   │   └── calendario/page.tsx
│   ├── layout.tsx                # Root layout (Toaster, fuentes)
│   └── page.tsx                  # redirect → /dashboard
│
├── components/
│   ├── ui/                       # primitives estilo shadcn
│   ├── layout/                   # AppShell, Sidebar, Header, MobileNav
│   └── shared/                   # PageHeader, StatCard, ConfirmDialog, EmptyState, DataToolbar
│
├── modules/
│   ├── printers/                 # form / table / hook / schema reutilizables
│   ├── workshop/                 # vista Taller
│   ├── deposit/                  # vista Depósito
│   ├── calendar/                 # FullCalendar + form
│   └── dashboard/                # KPIs + gráficos Recharts
│
├── repositories/
│   ├── types.ts                  # interfaces PrinterRepository / CalendarRepository
│   ├── local/                    # implementaciones con LocalStorage
│   ├── supabase/                 # esqueletos para Supabase
│   └── seed.ts                   # datos mock iniciales
│
├── services/                     # reglas de negocio (transiciones de estado, validación)
├── types/                        # Printer, CalendarEvent, etc.
└── lib/
    ├── supabase.ts               # cliente Supabase (lazy singleton)
    ├── repositories.ts           # factory: local | supabase
    ├── utils.ts                  # cn(), formatters
    └── constants.ts              # rutas, labels, colores
```

### Patrón Repository

- La **UI nunca toca LocalStorage** directamente. Consume los hooks (`usePrinters`, `useCalendarEvents`), que delegan en `services/*`, que a su vez delegan en `repositories/*`.
- `src/lib/repositories.ts` decide qué implementación exportar según `NEXT_PUBLIC_DATA_SOURCE`.
- Para migrar a Supabase: completa las clases `Supabase*Repository`, define las tablas (esquema documentado en sus comentarios), y cambia `NEXT_PUBLIC_DATA_SOURCE=supabase`.

---

## Migración a Supabase (más adelante)

1. Crear el proyecto Supabase y obtener `URL` + `anon key`.
2. Crear las tablas siguiendo el esquema documentado en:
   - `src/repositories/supabase/supabase-printer-repository.ts`
   - `src/repositories/supabase/supabase-calendar-repository.ts`
3. Completar los métodos `list/getById/create/update/delete` usando el cliente `getSupabaseClient()` de `src/lib/supabase.ts` y aplicando el mapping `snake_case ↔ camelCase` documentado.
4. Definir variables en `.env.local`:
   ```env
   NEXT_PUBLIC_DATA_SOURCE="supabase"
   NEXT_PUBLIC_SUPABASE_URL="https://<project>.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
   ```
5. Reiniciar `pnpm dev`. La UI no requiere ningún cambio.

---

## Convenciones

- **Idioma**: UI en español. Código y comentarios en español/inglés según convenga.
- **Tipado**: `strict: true`, `noUncheckedIndexedAccess: true`.
- **Validación**: Zod en los formularios; las reglas de transición (`moveToDeposit`, `markAsDelivered`) viven en los services.
- **Estados de fotocopiadora**: `TALLER → DEPOSITO → ENTREGADA`. Los registros nunca se eliminan al cambiar de estado; sólo se marcan.
- **Mock data**: ejecutado una sola vez por navegador, gestionado por `src/repositories/seed.ts` y el flag `gts:seeded` en LocalStorage.
