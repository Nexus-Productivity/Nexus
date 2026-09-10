import { Button } from "@nexus/ui";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-nexus-star">
        Nexus · Finance
      </p>
      <h1 className="text-3xl font-semibold text-nexus-gold">Caja Menor</h1>
      <p className="max-w-md text-sm text-nexus-muted">
        Registrá ingresos y egresos, mirá el saldo y las categorías de tu negocio.
      </p>
      <Button className="mt-4">Nuevo movimiento</Button>
    </main>
  );
}
