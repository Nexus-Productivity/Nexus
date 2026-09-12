import { Breadcrumb, Button, CajaMenorDashboardLayout, PlusIcon } from "@nexus/ui";
import { MovementsTable } from "@/components/MovementsTable";
import { allMovements } from "@/lib/data";
import { GYM_HEADER_USER, gymSidebar } from "@/lib/module-config";
import { ORG } from "@/lib/org";

export default function GymHistorialPage() {
  return (
    <CajaMenorDashboardLayout
      sidebar={gymSidebar("/historial")}
      header={{ appHref: "/", brandLabel: "Servicios", user: GYM_HEADER_USER }}
    >
      <Breadcrumb
        items={[{ label: "Nexus" }, { label: ORG.name }, { label: "Historial de efectivo" }]}
      />

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-nexus-ink">Historial de efectivo</h1>
          <p className="mt-1 text-sm text-nexus-muted">
            Todos los ingresos y egresos del negocio, con su categoría y estado.
          </p>
        </div>
        <Button>
          <PlusIcon className="mr-1.5 h-4 w-4" />
          Nuevo movimiento
        </Button>
      </div>

      <div className="mt-6">
        <MovementsTable movements={allMovements} />
      </div>
    </CajaMenorDashboardLayout>
  );
}