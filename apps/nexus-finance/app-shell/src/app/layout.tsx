import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus Finance",
  description: "Ecosistema financiero de Nexus: módulos de gestión empresarial.",
};

/** Public Stunt — tipografía del wordmark (solo uso personal). */
const publicStunt = localFont({
  src: [
    {
      path: "../assets/fonts/PublicStunt_PERSONAL_USE_ONLY.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/PublicStuntItalic_PERSONAL_USE_ONLY.otf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-public-stunt",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={publicStunt.variable}>
      <body className="min-h-screen bg-nexus-bg font-sans text-nexus-ink antialiased">
        {children}
      </body>
    </html>
  );
}