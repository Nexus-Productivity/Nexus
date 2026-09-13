import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const HASH = bcrypt.hashSync("Admin123", 10);

/**
 * Seed del NÚCLEO de Nexus (rama core/base).
 *
 * - Catálogo global de MÓDULOS disponibles. Solo lo que existe de verdad:
 *   un módulo nace de un dolor validado (regla §9 PLAN-BASE-NEXUS), no de
 *   listas imaginadas. Hoy: Gym (construido). Caja Menor vuelve cuando su
 *   código se reimplemente como módulo (2 casos reales).
 * - Org "Zona Rosa" (gimnasio REAL de la demo) con el módulo Gym ACTIVO.
 *
 * DEMO: laura@zonarosa.com / Admin123
 */
async function main() {
  // ---------- Limpieza del catálogo viejo (módulos que ya no existen) ----------
  const slugsViejos = ["clientes", "caja-menor", "facturacion", "presupuestos", "gym"];
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
      icono: "💪",
      porDefecto: false,
      sugeridoPara: ["gimnasio"],
      orden: 1,
    },
    create: {
      slug: "gym",
      nombre: "Gym",
      descripcion: "Socios, membresías y cobros: el gimnasio al día sin planillas.",
      campo: "SERVICES",
      icono: "💪",
      porDefecto: false,
      sugeridoPara: ["gimnasio"],
      orden: 1,
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

  console.log("🌌 Seed núcleo listo:");
  console.log("  módulos:", gym.slug);
  console.log("  Zona Rosa → Gym ACTIVO");
  console.log("  DEMO → laura@zonarosa.com / Admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());