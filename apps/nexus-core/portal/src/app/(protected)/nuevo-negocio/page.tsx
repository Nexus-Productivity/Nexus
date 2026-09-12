import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMisNegocios } from "@/lib/session";
import { PortalHeader } from "@/components/PortalHeader";
import { NuevoNegocioForm } from "@/components/NuevoNegocioForm";

/**
 * ONBOARDING — creación del primer negocio (ya con cuenta creada).
 * Acá se preguntan los datos del negocio: nombre, tipo y moneda.
 * El módulo BASE (Clientes) se activa automáticamente al crearlo.
 */
export default async function NuevoNegocioPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const negocios = await getMisNegocios(session.user.email);
  const activo = negocios[0];
  const yaTieneNegocio = negocios.length > 0;

  return (
    <div className="min-h-screen bg-nexus-bg">
      <PortalHeader email={session.user.email} negocios={negocios} activoSlug={activo?.slug} />

      <main className="mx-auto max-w-md px-4 py-14 lg:px-6">
        <h1 className="text-xl font-semibold text-nexus-ink">
          {yaTieneNegocio ? "Nuevo negocio" : "Creá tu negocio"}
        </h1>
        <p className="mt-1 text-sm text-nexus-muted">
          {yaTieneNegocio
            ? "Se suma a tu cuenta y pasa a ser el negocio activo."
            : "Contanos tu negocio y armamos tu panel: el módulo de clientes viene incluido por defecto y te sugerimos los que le convienen."}
        </p>
        <div className="mt-8 rounded-2xl border border-nexus-border bg-nexus-surface p-7 shadow-lg shadow-nexus-ink/5">
          <NuevoNegocioForm standalone />
        </div>
      </main>
    </div>
  );
}