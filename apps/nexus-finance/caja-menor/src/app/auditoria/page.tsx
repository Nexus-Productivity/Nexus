import { ShieldIcon } from "@nexus/ui";
import { ModulePlaceholder } from "@/components/module-placeholder";
import { APP_HEADER_LINKS, CURRENT_USER } from "@/lib/module-config";

export default function AuditoriaPage() {
  return (
    <ModulePlaceholder
      title="Auditoría"
      description="Registro de quién hizo qué y cuándo: movimientos, aprobaciones, arqueos. Crítico por el manejo de dinero."
      activeHref="/auditoria"
      icon={<ShieldIcon />}
      headerLinks={APP_HEADER_LINKS}
      user={CURRENT_USER}
    />
  );
}