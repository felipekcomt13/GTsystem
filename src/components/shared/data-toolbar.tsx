"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DataToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
  className?: string;
}

export function DataToolbar({
  searchValue,
  onSearchChange,
  placeholder = "Buscar…",
  children,
  className,
}: DataToolbarProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center", className)}>
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">{children}</div>
      )}
    </div>
  );
}
