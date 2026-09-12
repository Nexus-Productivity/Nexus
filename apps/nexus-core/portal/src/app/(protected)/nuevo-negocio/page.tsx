import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMisNegocios } from "@/lib/session";
import { PortalHeader } from "@/components/PortalHeader";
import { NuevoNegocioForm } from "@/components/NuevoNegocioForm";

/**
 * NUEVO NEGOCIO — para una cuenta ya logueada que quiere sumar otra org.
 * El módulo BASE (Clientes) se activa automáticamente al crearlo.
 */
export default async function NuevoNegocioPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const negocios = await getMisNegocios(session.user.email);
  const activo = negocios[0];

  return (
    <div className="min-h-screen bg-nexus-bg">
      <PortalHeader email={session.user.email} negocios={negocios} activoSlug={activo?.slug} />

      <main className="mx-auto max-w-md px-4 py-14 lg:px-6">
        <h1 className="text-xl font-semibold text-nexus-ink">Nuevo negocio</h1>
        <p className="mt-1 text-sm text-nexus-muted">
          Se suma a tu cuenta y pasa a ser el negocio activo. El módulo de
          clientes viene incluido por defecto.
        </p>
        <div className="mt-8 rounded-2xl border border-nexus-border bg-nexus-surface p-7 shadow-lg shadow-nexus-ink/5">
          <NuevoNegocioForm standalone />
        </div>
      </main>
    </div>
  );
}