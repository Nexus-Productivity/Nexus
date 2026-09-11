import {
  CajaMenorDashboardLayout,
  PagePlaceholder,
  type AppHeaderLink,
  type AppHeaderUser,
} from "@nexus/ui";
import { moduleSidebar } from "@/lib/module-config";

interface ModulePlaceholderProps {
  title: string;
  description: string;
  activeHref: string;
  icon?: React.ReactNode;
  headerLinks?: AppHeaderLink[];
  user?: AppHeaderUser;
  appHref?: string;
}

/** Sección del módulo en fase 2: layout del módulo + tarjeta "próximamente". */
export function ModulePlaceholder({
  title,
  description,
  activeHref,
  icon,
  headerLinks = [],
  user,
  appHref = "/",
}: ModulePlaceholderProps) {
  return (
    <CajaMenorDashboardLayout
      sidebar={moduleSidebar(activeHref)}
      header={{ appHref, brandLabel: "Finance", links: headerLinks, user }}
    >
      <PagePlaceholder title={title} description={description} icon={icon} />
    </CajaMenorDashboardLayout>
  );
}