import { Breadcrumb, CajaMenorDashboardLayout, PagePlaceholder, UsersIcon } from "@nexus/ui";
import { GYM_HEADER_USER, gymSidebar } from "@/lib/module-config";
import { ORG } from "@/lib/org";

export default function GymClientesPage() {
  return (
    <CajaMenorDashboardLayout
      sidebar={gymSidebar("/clientes")}
      header={{ appHref: "/", brandLabel: "Servicios", user: GYM_HEADER_USER }}
    >
      <Breadcrumb items={[{ label: "Nexus" }, { label: ORG.name }, { label: "Clientes" }]} />
      <PagePlaceholder
        title="Clientes"
        description="El registro de socios y su historial de pagos. La próxima fase del módulo."
        phase="Próximamente"
        icon={<UsersIcon />}
      />
    </CajaMenorDashboardLayout>
  );
}