import { DashboardPage } from "@nexus/ui";
import { APP_HEADER_LINKS, CURRENT_USER, moduleSidebar } from "@/lib/module-config";

export default function HomePage() {
  return (
    <DashboardPage
      sidebar={moduleSidebar("/")}
      header={{
        appHref: `${process.env.NEXT_PUBLIC_APP_SHELL_URL ?? "http://localhost:3001"}`,
        brandLabel: "Finance",
        links: APP_HEADER_LINKS,
        user: CURRENT_USER,
      }}
    />
  );
}