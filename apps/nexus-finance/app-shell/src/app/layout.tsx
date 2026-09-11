import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus Finance",
  description: "Ecosistema financiero de Nexus: módulos de gestión empresarial.",
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