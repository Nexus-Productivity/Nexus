import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getPortalCtx } from "@/lib/session";
import { PortalHeader } from "@/components/PortalHeader";
import { NegocioSidebar } from "@/components/NegocioSidebar";

/**
 * Layout del segmento /negocios/[slug] — el NEGOCIO.
 * Shell corporativo: header global (marca + select) + sidebar del negocio
 * (Dashboard + módulos ACTIVOS) + contenido extendido estilo empresa.
 */
export default async function NegocioLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const org = await prisma.organization.findUnique({
    where: { slug: params.slug },
    include: {
      members: true,
      modules: {
        where: { estado: "ACTIVO" },
        include: { module: true },
        orderBy: { module: { orden: "asc" } },
      },
    },
  });
  if (!org) notFound();

  const soyMiembro = org.members.some((m) => m.email === session.user!.email);
  const scope = (session.user as { scope?: string } | undefined)?.scope;

  if (scope === "CEO" && !soyMiembro) redirect("/ceo");
  if (!soyMiembro) redirect("/");

  const ctx = await getPortalCtx(session.user.email);

  const modulos = org.modules.map((m) => ({
    slug: m.module.slug,
    nombre: m.module.nombre,
  }));

  return (
    <div className="min-h-screen bg-nexus-bg">
      <PortalHeader email={ctx.email} negocios={ctx.negocios} activoSlug={ctx.activo?.slug} />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="w-60 shrink-0 border-r border-nexus-border bg-white">
          <NegocioSidebar
            negocioSlug={params.slug}
            negocioNombre={org.nombre}
            modulos={modulos}
          />
        </aside>
        <main className="min-w-0 flex-1 px-6 py-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}