import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const HASH = bcrypt.hashSync("Admin123", 10);

/**
 * Seed del NÚCLEO de Nexus (rama core/base).
 *
 * - Catálogo global de MÓDULOS disponibles. Solo lo que existe de verdad:
 *   un módulo nace de un dolor validado (regla §9 PLAN-BASE-NEXUS), no de
 *   listas imaginadas. Hoy: Gym (construido) y Caja Menor (construido).
 * - Org "Zona Rosa" (gimnasio REAL de la demo) con el módulo Gym ACTIVO.
 * - Org "Casa Museo Pozón" (museo real del profe) con Caja Menor ACTIVA.
 *
 * DEMO:
 *   laura@zonarosa.com / Admin123        (Zona Rosa → Gym)
 *   profe@casamuseopozon.com / Admin123  (Casa Museo Pozón → Caja Menor)
 *   (email del profe PENDIENTE confirmar con el CEO)
 */
async function main() {
  // ---------- Limpieza del catálogo viejo (módulos que ya no existen) ----------
  const slugsViejos = ["clientes", "facturacion", "presupuestos"];
  for (const slug of slugsViejos) {
    const old = await prisma.module.findUnique({ where: { slug } });
    if (old && slug !== "gym") {
      await prisma.organizationModule.deleteMany({ where: { moduleId: old.id } });
      await prisma.module.delete({ where: { id: old.id } });
    }
  }

  // ---------- Catálogo de módulos (productos reutilizables) ----------
  const gym = await prisma.module.upsert({
    where: { slug: "gym" },
    update: {
      nombre: "Gym",
      descripcion: "Socios, membresías y cobros: el gimnasio al día sin planillas.",
      campo: "SERVICES",
      naturaleza: "VERTICAL", // plantilla del rubro gimnasio (se activa por rubro)
      icono: "dumbbell",
      porDefecto: false,
      sugeridoPara: ["gimnasio"],
      orden: 1,
    },
    create: {
      slug: "gym",
      nombre: "Gym",
      descripcion: "Socios, membresías y cobros: el gimnasio al día sin planillas.",
      campo: "SERVICES",
      naturaleza: "VERTICAL",
      icono: "dumbbell",
      porDefecto: false,
      sugeridoPara: ["gimnasio"],
      orden: 1,
    },
  });

  const cajamenor = await prisma.module.upsert({
    where: { slug: "caja-menor" },
    update: {
      nombre: "Caja Menor",
      descripcion: "El efectivo del negocio claro: entradas, salidas y saldo al día.",
      campo: "FINANCE",
      naturaleza: "CAPA", // horizontal: sirve a cualquier negocio con efectivo
      icono: "wallet",
      porDefecto: false,
      sugeridoPara: ["museo", "comercio", "restaurante", "tienda", "cafe"],
      orden: 2,
    },
    create: {
      slug: "caja-menor",
      nombre: "Caja Menor",
      descripcion: "El efectivo del negocio claro: entradas, salidas y saldo al día.",
      campo: "FINANCE",
      naturaleza: "CAPA",
      icono: "wallet",
      porDefecto: false,
      sugeridoPara: ["museo", "comercio", "restaurante", "tienda", "cafe"],
      orden: 2,
    },
  });

  // ---------- Zona Rosa (gimnasio real de la demo) ----------
  const zona = await prisma.organization.upsert({
    where: { slug: "zonarosa" },
    update: { nombre: "Zona Rosa", tipoNegocio: "gimnasio", moneda: "COP", pais: "CO" },
    create: {
      nombre: "Zona Rosa",
      slug: "zonarosa",
      tipoNegocio: "gimnasio",
      moneda: "COP",
      pais: "CO",
    },
  });

  await prisma.member.upsert({
    where: { email_orgId: { email: "laura@zonarosa.com", orgId: zona.id } },
    update: { nombre: "Laura Rivas", rol: "ADMIN", passwordHash: HASH, activo: true },
    create: {
      orgId: zona.id,
      nombre: "Laura Rivas",
      email: "laura@zonarosa.com",
      passwordHash: HASH,
      rol: "ADMIN",
    },
  });

  // Módulo Gym ACTIVO para Zona Rosa (demo funcionando desde el primer acceso).
  await prisma.organizationModule.upsert({
    where: { orgId_moduleId: { orgId: zona.id, moduleId: gym.id } },
    update: { estado: "ACTIVO", activadoAt: new Date() },
    create: { orgId: zona.id, moduleId: gym.id, estado: "ACTIVO", activadoAt: new Date() },
  });

  // ---------- Casa Museo Pozón (museo real del profe → Caja Menor) ----------
  const museo = await prisma.organization.upsert({
    where: { slug: "casamuseopozon" },
    update: { nombre: "Casa Museo Pozón", tipoNegocio: "museo", moneda: "COP", pais: "CO" },
    create: {
      nombre: "Casa Museo Pozón",
      slug: "casamuseopozon",
      tipoNegocio: "museo",
      moneda: "COP",
      pais: "CO",
    },
  });

  await prisma.member.upsert({
    where: { email_orgId: { email: "profe@casamuseopozon.com", orgId: museo.id } },
    update: { nombre: "Profe (pendiente nombre)", rol: "ADMIN", passwordHash: HASH, activo: true },
    create: {
      orgId: museo.id,
      nombre: "Profe (pendiente nombre)",
      email: "profe@casamuseopozon.com",
      passwordHash: HASH,
      rol: "ADMIN",
    },
  });

  // Módulo Caja Menor ACTIVO para Casa Museo Pozón.
  await prisma.organizationModule.upsert({
    where: { orgId_moduleId: { orgId: museo.id, moduleId: cajamenor.id } },
    update: { estado: "ACTIVO", activadoAt: new Date() },
    create: { orgId: museo.id, moduleId: cajamenor.id, estado: "ACTIVO", activadoAt: new Date() },
  });

  // Categorías iniciales de caja menor (configurables por el dueño después).
  const categoriasIniciales = ["Mercado", "Transporte", "Papelería", "Mantenimiento", "Servicios", "Ventas", "Otros"];
  for (const nombre of categoriasIniciales) {
    await prisma.cajaCategoria.upsert({
      where: { orgId_nombre: { orgId: museo.id, nombre } },
      update: { activo: true },
      create: { orgId: museo.id, nombre },
    });
  }

  console.log("🌌 Seed núcleo listo:");
  console.log("  módulos:", gym.slug, "·", cajamenor.slug);
  console.log("  Zona Rosa → Gym ACTIVO");
  console.log("  Casa Museo Pozón → Caja Menor ACTIVA");
  console.log("  DEMO → laura@zonarosa.com / Admin123");
  console.log("  DEMO → profe@casamuseopozon.com / Admin123 (profe, PENDIENTE confirmar)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());