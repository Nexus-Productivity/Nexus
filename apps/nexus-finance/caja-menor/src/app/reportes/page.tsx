import { ChartIcon } from "@nexus/ui";
import { ModulePlaceholder } from "@/components/module-placeholder";
import { APP_HEADER_LINKS, CURRENT_USER } from "@/lib/module-config";

export default function ReportesPage() {
  return (
    <ModulePlaceholder
      title="Reportes"
      description="Por día / semana / mes / categoría / usuario / proveedor. Exportables a PDF, Excel y CSV."
      activeHref="/reportes"
      icon={<ChartIcon />}
      headerLinks={APP_HEADER_LINKS}
      user={CURRENT_USER}
    />
  );
}