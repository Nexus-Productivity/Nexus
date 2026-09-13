import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Sparkles } from "lucide-react";
import { Logo } from "@nexus/ui";
import { prisma } from "@/lib/prisma";
import { getOrgActiva } from "@/lib/org";
import { getModulosActivos } from "@/lib/modulos";

/**
 * Shell del NÚCLEO (nivel negocio): sesión + org activa + onboarding por
 * persona. La navegación sale de los MÓDULOS ACTIVOS de la org — la base
 * no conoce clientes/pagos/gastos: eso vive dentro de cada módulo.
 */
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { member, org } = await getOrgActiva();

  // Onboarding POR PERSONA: cada usuario nuevo ve la guía hasta completarla,
  // aunque la org ya esté armada. La política NO vive en la org.
  const miembro = await prisma.member.findUnique({
    where: { email_orgId: { email: member.email, orgId: org.id } },
  });
  if (!miembro?.onboardingCompletadoAt) redirect("/onboarding");

  const modulos = await getModulosActivos(org.id);

  return (
    <div className="flex min-h-screen bg-nexus-bg">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-nexus-border bg-nexus-surface">
        <div className="flex h-16 items-center border-b border-nexus-border/70 px-5">
          <Link href="/" className="transition hover:opacity-85">
            <Logo size="sm" />
          </Link>
        </div>

        <div className="px-5 pt-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-nexus-muted">Mi negocio</p>
          <h1 className="mt-1 truncate text-sm font-semibold text-nexus-ink">{org.nombre}</h1>
        </div>

        <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-nexus-muted transition hover:bg-nexus-surface-alt hover:text-nexus-ink"
          >
            <LayoutDashboard className="h-4 w-4" />
            Panel principal
          </Link>

          {modulos.length > 0 && (
            <div className="mt-3">
              <p className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-widest text-nexus-muted">
                Módulos
              </p>
              {modulos.map((om) => (
                <Link
                  key={om.moduleId}
                  href={`/${om.module.slug}`}
                  className="mt-1 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-nexus-muted transition hover:bg-nexus-surface-alt hover:text-nexus-ink"
                >
                  <span aria-hidden>{om.module.icono ?? "✦"}</span>
                  {om.module.nombre}
                </Link>
              ))}
            </div>
          )}

          {modulos.length === 0 && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-nexus-gold/30 bg-nexus-gold-soft px-3 py-2.5 text-xs text-nexus-muted">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-nexus-gold" />
              <span>
                Todavía no tenés módulos activos. En el panel vas a ver qué te recomendamos para tu negocio.
              </span>
            </div>
          )}
        </nav>

        <div className="border-t border-nexus-border/70 p-4">
          <p className="truncate text-sm text-nexus-ink">{member.nombre}</p>
          <p className="truncate text-xs text-nexus-muted">{member.email}</p>
          <form action="/api/auth/signout" method="post" className="mt-3">
            <input type="hidden" name="callbackUrl" value="/login" />
            <button
              type="submit"
              className="w-full rounded-lg border border-nexus-border px-3 py-2 text-sm font-medium text-nexus-muted transition hover:bg-nexus-surface-alt hover:text-nexus-ink"
            >
              Salir
            </button>
          </form>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">{children}</div>
      </main>
    </div>
  );
}