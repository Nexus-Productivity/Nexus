import { WalletIcon } from "@nexus/ui";
import { ModulePlaceholder } from "@/components/module-placeholder";
import { APP_HEADER_LINKS, CURRENT_USER } from "@/lib/module-config";

export default function CategoriasPage() {
  return (
    <ModulePlaceholder
      title="Categorías"
      description="Configuración del módulo: Transporte, Papelería, Alimentación, Limpieza, Mantenimiento, Servicios, Compras y más."
      activeHref="/categorias"
      icon={<WalletIcon />}
      headerLinks={APP_HEADER_LINKS}
      user={CURRENT_USER}
    />
  );
}