import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { LayoutDashboard, Users, Wallet, Receipt } from "lucide-react";
import { Logo } from "@nexus/ui";
import { authOptions } from "@/lib/auth";
import { getGymOrg } from "@/lib/gym";

/**
 * Layout del prototipo GYM: una sesión, un negocio (el gimnasio).
 * Fuera del alcance acá: explorar catálogo, consola CEO, multi-org.
 */
export default async function GymLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const org = await getGymOrg();
  if (!org) notFound();

  const nav = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/clientes", label: "Clientes", icon: Users },
    { href: "/pagos", label: "Pagos", icon: Wallet },
    { href: "/gastos", label: "Gastos", icon: Receipt },
  ];

  return (
    <div className="flex min-h-screen bg-nexus-bg">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-nexus-border bg-nexus-surface">
        <div className="flex h-16 items-center border-b border-nexus-border/70 px-5">
          <Link href="/" className="transition hover:opacity-85">
            <Logo size="sm" />
          </Link>
        </div>

        <div className="px-5 pt-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-nexus-muted">Mi negocio</p>
          <h1 className="mt-1 truncate text-sm font-semibold text-nexus-ink">{org.nombre}</h1>
        </div>

        <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-nexus-muted transition hover:bg-nexus-surface-alt hover:text-nexus-ink"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-nexus-border/70 p-4">
          <p className="truncate text-sm text-nexus-ink">{session.user.name}</p>
          <p className="truncate text-xs text-nexus-muted">{session.user.email}</p>
          <form action="/api/auth/signout" method="post" className="mt-3">
            <input type="hidden" name="callbackUrl" value="/login" />
            <button
              type="submit"
              className="w-full rounded-lg border border-nexus-border px-3 py-2 text-sm font-medium text-nexus-muted transition hover:bg-nexus-surface-alt hover:text-nexus-ink"
            >
              Salir
            </button>
          </form>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">{children}</div>
      </main>
    </div>
  );
}