import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Building2 } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getNegocioActivo } from "@/lib/session";
import { PortalHeader } from "@/components/PortalHeader";

/**
 * HOME — sin fricción:
 *  - CEO → /ceo (consola global, no cliente).
 *  - Con negocios → redirige al negocio ACTIVO (select en la navbar).
 *  - Sin negocios → CTA "Crear tu primer negocio".
 */
export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const scope = (session.user as { scope?: string } | undefined)?.scope;
  if (scope === "CEO") redirect("/ceo");

  const activo = await getNegocioActivo(session.user.email);
  if (activo) redirect(`/negocios/${activo.slug}`);

  return (
    <div className="min-h-screen bg-nexus-bg">
      <PortalHeader email={session.user.email} negocios={[]} />

      <main className="mx-auto max-w-xl px-4 py-16 lg:px-6">
        <div className="rounded-2xl border border-dashed border-nexus-border bg-nexus-surface/50 p-10 text-center">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-nexus-gold-soft text-nexus-gold-strong">
            <Building2 className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-xl font-semibold text-nexus-ink">
            Creá tu primer negocio
          </h1>
          <p className="mt-2 text-sm text-nexus-muted">
            Nexus es la plataforma que conecta tus módulos de gestión: clientes,
            caja menor, facturación y más. Un negocio, un panel.
          </p>
          <Link
            href="/registro"
            className="mt-6 inline-flex rounded-lg bg-nexus-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-nexus-ink/85"
          >
            Crear cuenta y negocio
          </Link>
        </div>
      </main>
    </div>
  );
}