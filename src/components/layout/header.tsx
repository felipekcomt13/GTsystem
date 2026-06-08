"use client";

import { usePathname } from "next/navigation";

import { ROUTES } from "@/lib/constants";
import { MobileNav } from "./mobile-nav";

const TITLES: Record<string, { title: string; subtitle: string }> = {
  [ROUTES.dashboard]: {
    title: "Dashboard",
    subtitle: "Resumen operativo del servicio técnico.",
  },
  [ROUTES.taller]: {
    title: "Taller",
    subtitle: "Fotocopiadoras actualmente en mantenimiento.",
  },
  [ROUTES.deposito]: {
    title: "Depósito",
    subtitle: "Fotocopiadoras reparadas, listas para recoger o entregadas.",
  },
  [ROUTES.calendario]: {
    title: "Calendario",
    subtitle: "Visitas técnicas, instalaciones y mantenimientos programados.",
  },
};

export function Header() {
  const pathname = usePathname();
  const info =
    TITLES[pathname] ??
    (pathname.startsWith(ROUTES.dashboard)
      ? TITLES[ROUTES.dashboard]
      : { title: "GTSystem", subtitle: "" });

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card/95 px-4 backdrop-blur md:px-8">
      <MobileNav />
      <div className="flex flex-col">
        <h1 className="text-base font-semibold leading-none md:text-lg">{info!.title}</h1>
        <p className="hidden text-xs text-muted-foreground sm:block">{info!.subtitle}</p>
      </div>
    </header>
  );
}
