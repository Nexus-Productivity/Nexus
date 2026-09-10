import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Caja Menor — Nexus",
  description: "Sistema de caja menor para negocios no modernizados.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-nexus-bg font-sans text-stone-100 antialiased">
        {children}
      </body>
    </html>
  );
}