import { DocumentIcon } from "@nexus/ui";
import { ModulePlaceholder } from "@/components/module-placeholder";
import { APP_HEADER_LINKS, CURRENT_USER } from "@/lib/module-config";

export default function ComprobantesPage() {
  return (
    <ModulePlaceholder
      title="Comprobantes"
      description="Gestión de soportes (facturas, recibos, tickets, PDFs) vinculados a cada movimiento."
      activeHref="/comprobantes"
      icon={<DocumentIcon />}
      headerLinks={APP_HEADER_LINKS}
      user={CURRENT_USER}
    />
  );
}