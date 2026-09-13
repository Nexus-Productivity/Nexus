# BASE NEXUS — Rama `core/base`

> Base sólida del ecosistema Nexus: **REGISTRO → ONBOARDING → PANEL PRINCIPAL → MÓDULOS según el onboarding**.
> Rama creada desde `gym/prototipo` (2026-09-13). El prototipo gym sigue vivo en `gym/prototipo` para la demo de Zona Rosa.

## Estructura de la base

```
apps/nexus-core/portal/src/
├── app/
│   ├── (auth)/                  ← REGISTRO + LOGIN (la cuenta es la persona)
│   │   ├── registro/            ← nombre + email + contraseña
│   │   └── login/
│   ├── (onboarding)/onboarding/ ← ONBOARDING (5 pasos, editable después)
│   ├── (protected)/
│   │   ├── layout.tsx           ← shell nivel negocio: org + módulos ACTIVOS
│   │   ├── page.tsx             ← PANEL PRINCIPAL: módulos + sugerencias por rubro
│   │   └── gym/                 ← MÓDULO GYM (demo real: dashboard, clientes,
│   │       │                       pagos, gastos — todo bajo su propio espacio)
│   ├── api/auth/[...nextauth]/
├── lib/
│   ├── acciones.ts              ← NÚCLEO: registrar, guardarOnboarding, activarModulo
│   ├── org.ts                   ← sesión → org activa del usuario (multi-org a futuro)
│   ├── modulos.ts               ← catálogo: activos + sugeridos + activación
│   ├── gym.ts                   ← MÓDULO: dashboard gym (sin tocar el núcleo)
│   └── acciones-gym.ts          ← MÓDULO: acciones server del gym
```

## El flujo (cómo se siente el producto)

1. **Registro** — crea la cuenta de la PERSONA y su primer negocio en borrador ("Mi negocio"). Nadie cae en una org interna ni en un gym inventado.
2. **Onboarding** — el dueño perfila SU negocio: nombre, rubro, país+moneda, equipo, dolor primero. Por persona: cada usuario ve la guía hasta completarla.
3. **Módulo según rubro** — el onboarding activa el módulo que encaja con el rubro (ej: gimnasio → Gym). Nada de "próximamente".
4. **Panel principal** — el hogar del negocio: módulos ACTIVOS (se entra) + sugerencias según el perfil + checklist de arranque.

## Vocabulario (no se mezcla)

| Nivel | Qué es | Dónde vive |
|---|---|---|
| NEXUS | La marca | — |
| Campo | Taxonomía interna (`CampoModulo`) | `schema.prisma` |
| Módulo | Producto reutilizable (`Module`) | `identidad.prisma` + su carpeta en el portal |
| Organización | Cliente real (`Organization`) | `identidad.prisma` |

Regla de oro: el cliente solo ve NEXUS y módulos. La organización ACTIVA módulos (`OrganizationModule`); el catálogo SUGIERE según el rubro (`Module.sugeridoPara`).

## Reglas que sostienen la base

- **El núcleo NO conoce módulos verticales.** `identidad.prisma` solo tiene Organization/Member/Module/OrganizationModule. Gym cuelga de orgId sin relación Prisma (FK lógica).
- **Un módulo nace de un dolor validado** (regla §9 PLAN-BASE-NEXUS): no se crean módulos de listas imaginadas. Hoy solo existe Gym.
- **Nada de basura**: al repo solo entra producto real. Las apps `nexus-finance` y `nexus-services` quedaron fuera de esta rama (referencia histórica en `main`).
- **Nunca se borra, se anula** (pagos y gastos con motivo).

## Deuda consciente (NO tocar aún)

- Pricing/planes → con 2–3 clientes pagando.
- Selector multi-org → `getMisOrgs()` ya existe; la UI del selector llega con el segundo negocio real.
- Sistema de afiliados → piloto solo tras el próximo cliente activo.
- Lint del portal → pendiente configurar ESLint (deuda previa, no de esta rama).

## Cómo correr

```bash
docker compose up -d            # PostgreSQL
pnpm install
pnpm --filter @nexus/prisma generate
pnpm --filter @nexus/prisma db:push --accept-data-loss   # sync schema a la DB local
pnpm --filter @nexus/prisma db:seed                       # democredenciales Zona Rosa
pnpm --filter nexus-portal dev                            # portal en :3005
```

Demo: `laura@zonarosa.com / Admin123` (Zona Rosa, módulo Gym ACTIVO).

## Próximo paso natural

Reimplementar **Caja Menor** como módulo (ya hay 2 casos reales: Casa Museo Pozón + repetición del patrón clientes/pagos/gastos) para validar que un segundo módulo cuelga del núcleo sin tocarlo.