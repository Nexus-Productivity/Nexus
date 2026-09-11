import { InboxIcon } from "@nexus/ui";
import { ModulePlaceholder } from "@/components/module-placeholder";
import { APP_HEADER_LINKS, CURRENT_USER } from "@/lib/module-config";

export default function SolicitudesPage() {
  return (
    <ModulePlaceholder
      title="Solicitudes"
      description="Flujo Nueva solicitud → Pendiente → Aprobada / Rechazada → Entregada → Justificada. Separa pedir dinero de gastarlo."
      activeHref="/solicitudes"
      icon={<InboxIcon />}
      headerLinks={APP_HEADER_LINKS}
      user={CURRENT_USER}
    />
  );
}