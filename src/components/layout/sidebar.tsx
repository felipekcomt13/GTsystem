"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, LayoutDashboard, Package, Wrench } from "lucide-react";

import { APP_NAME, COMPANY_NAME, ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: ROUTES.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.taller, label: "Taller", icon: Wrench },
  { href: ROUTES.deposito, label: "Depósito", icon: Package },
  { href: ROUTES.calendario, label: "Calendario", icon: Calendar },
] as const;

interface SidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export function Sidebar({ onNavigate, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-sidebar-border px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
          <span className="text-sm font-bold">GT</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight">{APP_NAME}</span>
          <span className="text-xs text-sidebar-foreground/60 leading-tight">{COMPANY_NAME}</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-6 py-4 text-xs text-sidebar-foreground/50">
        © {new Date().getFullYear()} {COMPANY_NAME}
      </div>
    </aside>
  );
}
