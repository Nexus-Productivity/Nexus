import { CoinsIcon } from "@nexus/ui";
import { ModulePlaceholder } from "@/components/module-placeholder";
import { APP_HEADER_LINKS, CURRENT_USER } from "@/lib/module-config";

export default function ArqueosPage() {
  return (
    <ModulePlaceholder
      title="Arqueos"
      description="Apertura y cierre de caja, saldo esperado vs. conteo físico, diferencia y justificación. Al cerrar un periodo, los movimientos quedan inmutables."
      activeHref="/arqueos"
      icon={<CoinsIcon />}
      headerLinks={APP_HEADER_LINKS}
      user={CURRENT_USER}
    />
  );
}