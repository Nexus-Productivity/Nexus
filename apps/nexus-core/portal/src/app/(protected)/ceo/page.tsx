import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { BadgeCheck, Building2, Check, Hourglass, LineChart, X } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { PortalHeader } from "@/components/PortalHeader";
import { iconoNegocio } from "@/lib/iconos";
import { decidirSolicitud } from "@/lib/actions";

/**
 * CONSOLA CEO — la plataforma como PROVEEDOR (no como cliente).
 * Solo miembros con scope CEO. Métricas globales, organizaciones y
 * solicitudes de módulos con aprobar/rechazar.
 */
export default async function CeoPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const scope = (session.user as { scope?: string } | undefined)?.scope;
  if (scope !== "CEO") redirect("/");

  const [organizaciones, solicitudes] = await Promise.all([
    prisma.organization.findMany({
      where: { tipoNegocio: { not: "plataforma" } },
      include: {
        modules: { include: { module: true }, orderBy: { module: { orden: "asc" } } },
        members: { select: { email: true, rol: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.organizationModule.findMany({
      where: { estado: "SOLICITADO" },
      include: { org: true, module: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const activos = organizaciones.reduce((acc, o) => acc + o.modules.filter((m) => m.estado === "ACTIVO").length, 0);

  return (
    <div className="min-h-screen bg-nexus-bg">
      <PortalHeader email={session.user.email} negocios={[]} />

      <main className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-nexus-gold-soft text-nexus-gold-strong">
            <LineChart className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-nexus-ink">Consola CEO</h1>
            <p className="text-sm text-nexus-muted">
              La plataforma por dentro: quién usa Nexus y qué hay que habilitar.
            </p>
          </div>
        </div>

        {/* Métricas */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-nexus-border bg-nexus-surface p-5">
            <div className="flex items-center gap-2 text-nexus-muted">
              <Building2 className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Organizaciones</span>
            </div>
            <p className="mt-2 text-3xl font-semibold text-nexus-ink">{organizaciones.length}</p>
          </div>
          <div className="rounded-2xl border border-nexus-border bg-nexus-surface p-5">
            <div className="flex items-center gap-2 text-nexus-muted">
              <BadgeCheck className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Módulos activos</span>
            </div>
            <p className="mt-2 text-3xl font-semibold text-nexus-ink">{activos}</p>
          </div>
          <div className="rounded-2xl border border-nexus-border bg-nexus-surface p-5">
            <div className="flex items-center gap-2 text-nexus-muted">
              <Hourglass className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Solicitudes pendientes</span>
            </div>
            <p className="mt-2 text-3xl font-semibold text-nexus-ink">{solicitudes.length}</p>
          </div>
        </div>

        {/* Solicitudes pendientes */}
        <section className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-nexus-muted">
            Solicitudes de módulos
          </h2>
          {solicitudes.length === 0 ? (
            <p className="mt-4 text-sm text-nexus-muted">Sin solicitudes pendientes.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {solicitudes.map((s) => {
                const IconoNegocio = iconoNegocio(s.org.tipoNegocio);
                return (
                  <div
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-nexus-border bg-nexus-surface p-5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-nexus-gold-soft text-nexus-gold-strong">
                        <IconoNegocio className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-nexus-ink">
                          {s.org.nombre} → {s.module.nombre}
                        </p>
                        <p className="text-xs text-nexus-muted">
                          {s.org.tipoNegocio ?? "Negocio"} ·{" "}
                          {s.createdAt.toLocaleDateString("es-CO")}
                        </p>
                      </div>
                    </div>
                    <form action={decidirSolicitud} className="flex gap-2">
                      <input type="hidden" name="orgModuleId" value={s.id} />
                      <button
                        name="decision"
                        value="aprobar"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-nexus-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-nexus-ink/85"
                      >
                        <Check className="h-4 w-4" />
                        Aprobar
                      </button>
                      <button
                        name="decision"
                        value="rechazar"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-nexus-border px-4 py-2 text-sm font-medium text-nexus-muted transition hover:bg-nexus-red-soft hover:text-nexus-red-strong"
                      >
                        <X className="h-4 w-4" />
                        Rechazar
                      </button>
                    </form>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Organizaciones de la plataforma */}
        <section className="mt-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-nexus-muted">
            Organizaciones
          </h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-nexus-border bg-nexus-surface">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-nexus-border bg-nexus-surface-alt/60 text-xs uppercase tracking-wide text-nexus-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">Negocio</th>
                  <th className="px-5 py-3 font-medium">Tipo</th>
                  <th className="px-5 py-3 font-medium">Módulos</th>
                  <th className="px-5 py-3 font-medium">Miembros</th>
                </tr>
              </thead>
              <tbody>
                {organizaciones.map((o) => (
                  <tr key={o.id} className="border-b border-nexus-border/60 last:border-0">
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/negocios/${o.slug}`}
                        className="font-medium text-nexus-ink hover:text-nexus-brand"
                      >
                        {o.nombre}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 capitalize text-nexus-muted">
                      {o.tipoNegocio ?? "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {o.modules.map((m) => (
                          <span
                            key={m.id}
                            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                              m.estado === "ACTIVO"
                                ? "bg-nexus-green-soft text-nexus-green-strong"
                                : "bg-nexus-surface-alt text-nexus-muted"
                            }`}
                          >
                            {m.module.nombre}
                            {m.estado === "SOLICITADO" && " · pedido"}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-nexus-muted">{o.members.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}