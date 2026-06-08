import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import { APP_NAME, COMPANY_NAME } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: `${APP_NAME} · ${COMPANY_NAME}`,
  description:
    "Aplicación interna de GrupoTelesistemas para gestionar taller, depósito y calendario de servicios técnicos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`} suppressHydrationWarning>
        {children}
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  );
}
