import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { BadgeCheck, Compass, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getPortalCtx } from "@/lib/session";
import { PortalScaffold } from "@/components/PortalScaffold";
import { SolicitarModuloForm } from "@/components/SolicitarModuloForm";
import { iconoModulo } from "@/lib/iconos";

/**
 * EXPLORAR — catálogo GLOBAL de módulos HORIZONTALES de Nexus.
 * El estado de cada tarjeta depende de la org ACTIVA (select de la navbar):
 * incluido (base) · activo · solicitado · disponible (+ recomendado por tipo).
 */
export default async function ExplorarPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const scope = (session.user as { scope?: string } | undefined)?.scope;
  if (scope === "CEO") redirect("/ceo");

  const [ctx, catalogo] = await Promise.all([
    getPortalCtx(session.user.email),
    prisma.module.findMany({ orderBy: { orden: "asc" } }),
  ]);

  const activo = ctx.activo;
  const orgActiva = activo
    ? await prisma.organization.findUnique({
        where: { slug: activo.slug },
        include: { modules: { include: { module: true } } },
      })
    : null;

  const orgsSolicitantes = ctx.negocios.filter((n) => n.slug !== "Nexus");

  function estadoDelModulo(moduleId: string) {
    if (!orgActiva) return { estado: "DISPONIBLE" as const };
    const om = orgActiva.modules.find((m) => m.moduleId === moduleId);
    if (om) return { estado: om.estado as "ACTIVO" | "SOLICITADO", en: orgActiva.nombre };
    return { estado: "DISPONIBLE" as const };
  }

  return (
    <PortalScaffold email={ctx.email} negocios={ctx.negocios} activoSlug={ctx.activo?.slug}>
      <nav className="text-sm text-nexus-muted">
        <Link href="/" className="hover:text-nexus-ink">
          Inicio
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-nexus-ink">Explorar</span>
      </nav>

      <div className="mt-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-nexus-gold-soft text-nexus-gold-strong">
          <Compass className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-semibold text-nexus-ink">Explorá los módulos de Nexus</h1>
          <p className="max-w-xl text-sm text-nexus-muted">
            Cada módulo resuelve una necesidad concreta de gestión. El de clientes
            viene incluido; el resto lo pedís y lo habilitamos.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {catalogo.map((mod) => {
          const st = estadoDelModulo(mod.id);
          const Icono = iconoModulo(mod.slug);
          const recomendado =
            activo?.tipoNegocio && mod.sugeridoPara.includes(activo.tipoNegocio);
          const esBase = mod.porDefecto;

          return (
            <div
              key={mod.id}
              className="flex flex-col rounded-2xl border border-nexus-border bg-nexus-surface p-6 transition hover:border-nexus-brand/40 hover:shadow-md hover:shadow-nexus-ink/5"
            >
              <div className="flex items-start justify-between">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-nexus-gold-soft text-nexus-gold-strong">
                  <Icono className="h-6 w-6" />
                </span>
                {recomendado && !esBase && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-nexus-gold-soft px-2 py-0.5 text-[11px] font-medium text-nexus-gold-strong">
                    <Sparkles className="h-3 w-3" />
                    Para tu {activo.tipoNegocio}
                  </span>
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-nexus-ink">{mod.nombre}</h2>
                {esBase && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-nexus-surface-alt px-2 py-0.5 text-[11px] font-medium text-nexus-muted">
                    <BadgeCheck className="h-3 w-3" />
                    Incluido
                  </span>
                )}
                {!esBase && st.estado !== "DISPONIBLE" && (
                  <span className="rounded-full bg-nexus-surface-alt px-2 py-0.5 text-[11px] font-medium text-nexus-muted">
                    {st.estado === "ACTIVO" ? `Activo en ${st.en}` : "Solicitado"}
                  </span>
                )}
              </div>
              <p className="mt-1 flex-1 text-sm text-nexus-muted">{mod.descripcion}</p>

              <div className="mt-5">
                {esBase ? (
                  <p className="rounded-lg border border-nexus-border bg-nexus-surface-alt/60 px-4 py-2 text-center text-sm text-nexus-muted">
                    Ya es parte de tu negocio
                  </p>
                ) : st.estado === "DISPONIBLE" ? (
                  <SolicitarModuloForm
                    moduleId={mod.id}
                    moduleNombre={mod.nombre}
                    orgs={orgsSolicitantes}
                    activoEn={undefined}
                  />
                ) : st.estado === "SOLICITADO" ? (
                  <button
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-nexus-border px-4 py-2 text-sm text-nexus-muted"
                  >
                    Pedido enviado
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </PortalScaffold>
  );
}