import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageSearch, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ModuloCard } from "@/components/ModuloCard";
import { SolicitarModuloForm } from "@/components/SolicitarModuloForm";
import { iconoNegocio } from "@/lib/iconos";

/**
 * UN NEGOCIO → panel con sus módulos.
 *  - ACTIVO: se entra (cada módulo trae sus secciones).
 *  - SUGERIDOS: recomendados por tipo de negocio → Solicitar.
 *  - SOLICITADO: pedido hecho, espera de aprobación del CEO.
 * El módulo BASE (clientes) siempre está activo y no se solicita.
 */
export default async function NegocioPage({ params }: { params: { slug: string } }) {
  const org = await prisma.organization.findUnique({
    where: { slug: params.slug },
    include: {
      modules: { include: { module: true }, orderBy: { module: { orden: "asc" } } },
    },
  });
  if (!org) notFound();

  const IconoNegocio = iconoNegocio(org.tipoNegocio);
  const activos = org.modules.filter((m) => m.estado === "ACTIVO");
  const solicitados = org.modules.filter((m) => m.estado === "SOLICITADO");

  // Sugerencias contextuales: módulos recomendados para el tipo de negocio
  // que todavía no están ACTIVOS ni SOLICITADOS en esta org.
  const sugeridos = org.tipoNegocio
    ? (await prisma.module.findMany({
        where: {
          activo: true,
          porDefecto: false,
          sugeridoPara: { has: org.tipoNegocio },
        },
        orderBy: { orden: "asc" },
      })).filter(
        (mod) =>
          !org.modules.some(
            (om) => om.moduleId === mod.id && (om.estado === "ACTIVO" || om.estado === "SOLICITADO")
          )
      )
    : [];

  return (
    <>
      {/* Header del negocio */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-nexus-gold-soft text-nexus-gold-strong">
          <IconoNegocio className="h-7 w-7" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-nexus-ink">{org.nombre}</h1>
            <span className="rounded-full bg-nexus-surface-alt px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-nexus-muted">
              {org.moneda}
            </span>
          </div>
          <p className="mt-0.5 text-sm capitalize text-nexus-muted">
            {org.tipoNegocio ?? "Negocio"}
          </p>
        </div>
      </div>

      {/* Módulos ACTIVOS */}
      {activos.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-nexus-muted">
            Módulos activos
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activos.map((om) => (
              <ModuloCard
                key={om.id}
                slug={om.module.slug}
                nombre={om.module.nombre}
                descripcion={om.module.descripcion}
                href={`/negocios/${org.slug}/${om.module.slug}`}
                estado="ACTIVO"
                esBase={om.module.porDefecto}
              />
            ))}
          </div>
        </section>
      )}

      {/* Sugerencias contextuales por tipo de negocio */}
      {sugeridos.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-nexus-brand" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-nexus-muted">
              Recomendado para tu {org.tipoNegocio}
            </h2>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sugeridos.map((mod) => (
              <div
                key={mod.id}
                className="flex flex-col rounded-2xl border border-dashed border-nexus-border bg-nexus-surface/60 p-6"
              >
                <ModuloCard
                  slug={mod.slug}
                  nombre={mod.nombre}
                  descripcion={mod.descripcion}
                  estado="SUGERIDO"
                />
                <div className="mt-4 border-t border-nexus-border/60 pt-4">
                  <SolicitarModuloForm
                    moduleId={mod.id}
                    moduleNombre={mod.nombre}
                    orgs={[{ id: org.id, slug: org.slug, nombre: org.nombre }]}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Solicitudes enviadas */}
      {solicitados.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-nexus-muted">
            Solicitudes enviadas
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {solicitados.map((om) => (
              <ModuloCard
                key={om.id}
                slug={om.module.slug}
                nombre={om.module.nombre}
                descripcion={om.module.descripcion}
                estado="SOLICITADO"
              />
            ))}
          </div>
        </section>
      )}

      {/* Descubrimiento del catálogo */}
      <section className="mt-10 overflow-hidden rounded-2xl border border-dashed border-nexus-border bg-gradient-to-br from-nexus-surface to-nexus-surface-alt/60 p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-nexus-gold-soft text-nexus-gold-strong">
              <PackageSearch className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-nexus-ink">
                ¿Necesitás otra herramienta?
              </h2>
              <p className="mt-1 max-w-md text-sm text-nexus-muted">
                El catálogo de Nexus crece con cada necesidad validada. Explorá los módulos
                disponibles y pedí el que tu negocio necesita.
              </p>
            </div>
          </div>
          <Link
            href="/explorar"
            className="inline-flex items-center gap-2 rounded-lg bg-nexus-ink px-4 py-2.5 text-sm font-medium text-white transition hover:bg-nexus-ink/85"
          >
            <PackageSearch className="h-4 w-4" />
            Explorar catálogo
          </Link>
        </div>
      </section>
    </>
  );
}