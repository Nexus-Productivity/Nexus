import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Caja Menor — Nexus Finance",
  description: "Gestión de caja menor para negocios: ingresos, egresos y control.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-nexus-bg font-sans text-nexus-ink antialiased">
        {children}
      </body>
    </html>
  );
}