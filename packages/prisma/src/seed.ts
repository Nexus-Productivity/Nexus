import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const HASH = bcrypt.hashSync("Admin123", 10);

/**
 * Seed base del portal Nexus:
 *  - Catálogo global de módulos HORIZONTALES (capacidades de gestión).
 *    No hay "gym" como módulo: el tipo de negocio vive en la organización.
 *  - Módulo "clientes" = BASE (porDefecto): toda org lo recibe ACTIVO al crearse.
 *  - Org "Zona Rosa" (gimnasio) → clientes ACTIVO + caja-menor ACTIVO
 *    + presupuestos SOLICITADO (demo de la consola CEO).
 *  - Org interna "Nexus" para el CEO (scope global).
 *
 * DEMO: credenciales
 *   santiago@nexus.io / Admin123   (CEO — global, consola)
 *   laura@zonarosa.com / Admin123  (admin de Zona Rosa)
 */
async function main() {
  // ---------- Catálogo de módulos (capacidades horizontales) ----------
  const modulos = [
    {
      slug: "clientes",
      nombre: "Clientes",
      descripcion: "Base de clientes: registro, historial y seguimiento de cada persona.",
      campo: "SERVICES",
      icono: "👥",
      porDefecto: true,
      sugeridoPara: [],
      orden: 1,
    },
    {
      slug: "caja-menor",
      nombre: "Caja menor",
      descripcion: "Control de gastos menores: movimientos, solicitudes y arqueos.",
      campo: "FINANCE",
      icono: "💵",
      porDefecto: false,
      sugeridoPara: ["gimnasio", "comercio", "restaurante", "taller"],
      orden: 2,
    },
    {
      slug: "facturacion",
      nombre: "Facturación",
      descripcion: "Emití facturas y llevá las cuentas por cobrar de tu negocio.",
      campo: "FINANCE",
      icono: "🧾",
      porDefecto: false,
      sugeridoPara: ["comercio", "restaurante", "taller"],
      orden: 3,
    },
    {
      slug: "presupuestos",
      nombre: "Presupuestos",
      descripcion: "Planificá y compará presupuesto contra gasto real (máquinas, insumos).",
      campo: "FINANCE",
      icono: "📊",
      porDefecto: false,
      sugeridoPara: ["gimnasio", "taller"],
      orden: 4,
    },
  ] as const;

  for (const m of modulos) {
    await prisma.module.upsert({
      where: { slug: m.slug },
      update: {
        nombre: m.nombre,
        descripcion: m.descripcion,
        campo: m.campo,
        icono: m.icono,
        porDefecto: m.porDefecto,
        sugeridoPara: m.sugeridoPara,
        orden: m.orden,
      },
      create: { ...m },
    });
  }

  // Fuera del catálogo: el "gym" vertical ya no se ofrece como módulo.
  const gymOld = await prisma.module.findUnique({ where: { slug: "gym" } });
  if (gymOld) {
    await prisma.organizationModule.deleteMany({ where: { moduleId: gymOld.id } });
    await prisma.module.delete({ where: { id: gymOld.id } });
  }

  // ---------- Zona Rosa (gimnasio real) ----------
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
    where: { email: "laura@zonarosa.com" },
    update: { nombre: "Laura Rivas", rol: "ADMIN", passwordHash: HASH, activo: true },
    create: {
      orgId: zona.id,
      nombre: "Laura Rivas",
      email: "laura@zonarosa.com",
      passwordHash: HASH,
      rol: "ADMIN",
    },
  });

  // Módulos de Zona Rosa: clientes (BASE) ACTIVO, caja-menor ACTIVO,
  // presupuestos SOLICITADO → lo ve el CEO en la consola para aprobar.
  const clientes = await prisma.module.findUniqueOrThrow({ where: { slug: "clientes" } });
  const cajaMenor = await prisma.module.findUniqueOrThrow({ where: { slug: "caja-menor" } });
  const presupuestos = await prisma.module.findUniqueOrThrow({ where: { slug: "presupuestos" } });

  for (const mod of [
    { module: clientes, estado: "ACTIVO" as const },
    { module: cajaMenor, estado: "ACTIVO" as const },
    { module: presupuestos, estado: "SOLICITADO" as const },
  ]) {
    await prisma.organizationModule.upsert({
      where: { orgId_moduleId: { orgId: zona.id, moduleId: mod.module.id } },
      update: { estado: mod.estado, activadoAt: mod.estado === "ACTIVO" ? new Date() : null },
      create: {
        orgId: zona.id,
        moduleId: mod.module.id,
        estado: mod.estado,
        activadoAt: mod.estado === "ACTIVO" ? new Date() : null,
      },
    });
  }

  // ---------- Nexus interna (CEO) ----------
  const nexus = await prisma.organization.upsert({
    where: { slug: "nexus" },
    update: { nombre: "Nexus", tipoNegocio: "plataforma", moneda: "COP", pais: "CO" },
    create: {
      nombre: "Nexus",
      slug: "nexus",
      tipoNegocio: "plataforma",
      moneda: "COP",
      pais: "CO",
    },
  });

  await prisma.member.upsert({
    where: { email: "santiago@nexus.io" },
    update: { nombre: "Santiago", rol: "ADMIN", scope: "CEO", passwordHash: HASH, activo: true },
    create: {
      orgId: nexus.id,
      nombre: "Santiago",
      email: "santiago@nexus.io",
      passwordHash: HASH,
      rol: "ADMIN",
      scope: "CEO",
    },
  });

  console.log("🌌 Seed listo:");
  console.log("  módulos (horizontales):", modulos.map((m) => m.slug).join(", "));
  console.log("  clientes = BASE (por defecto en toda organización)");
  console.log("  Zona Rosa → clientes ACTIVO, caja-menor ACTIVO, presupuestos SOLICITADO");
  console.log("  Nexus CEO  → santiago@nexus.io / Admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());