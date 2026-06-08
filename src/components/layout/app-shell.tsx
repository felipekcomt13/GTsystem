"use client";

import * as React from "react";

import { seedLocalIfEmpty } from "@/repositories/seed";
import { activeDataSource } from "@/lib/repositories";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (activeDataSource === "local") {
      seedLocalIfEmpty();
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
