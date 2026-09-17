# BASE NEXUS — Rama `core/base`

> Base sólida del ecosistema Nexus: **REGISTRO → ONBOARDING → PANEL PRINCIPAL → PLANTILLAS y MÓDULOS según el onboarding**.
> Rama creada desde `gym/prototipo` (2026-09-13). El prototipo gym sigue vivo en `gym/prototipo` para la demo de Zona Rosa.
> Refactor de niveles (2026-09-16): orden mental **NEXUS → CAPA → PLANTILLA → MÓDULO → COMPONENTE** — gym es una PLANTILLA armada de módulos; caja-menor es un módulo suelto.

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
│   │   ├── plantillas/
│   │   │   └── gym/             ← PLANTILLA GYM (plataforma armada a base de
│   │   │       │                    módulos: dashboard, clientes, pagos, gastos)
│   │   │       ├── layout.tsx   ← guard: módulo gym ACTIVO (`requiereModuloActivo`)
│   │   │       ├── page.tsx     ← dashboard de la plantilla
│   │   │       ├── clientes/    ← MÓDULO clientes (admin socios, perfiles)
│   │   │       ├── pagos/       ← MÓDULO pagos (planes + cobros)
│   │   │       └── gastos/      ← MÓDULO gastos
│   │   └── modulos/
│   │       └── caja-menor/      ← MÓDULO CAJA MENOR (suelto, acumulable:
│   │           │                    dashboard, movimientos, categorías)
│   ├── api/auth/[...nextauth]/
├── lib/
│   ├── core/                    ← NÚCLEO — no conoce módulos verticales
│   │   ├── acciones.ts          ← registrar, guardarOnboarding, activarModulo
│   │   ├── org.ts               ← sesión → org activa del usuario (multi-org a futuro)
│   │   ├── modulos.ts           ← catálogo: activos + sugeridos + activación
│   │   ├── navegacion.ts        ← SECCIONES_MODULOS + RUTA_POR_SLUG (única fuente de rutas)
│   │   ├── requiere-modulo.ts   ← guard: exige módulo ACTIVO (usado por cada módulo)
│   │   └── prisma.ts · auth.ts · iconos-modulos.ts
│   ├── shared/                  ← COMPARTIDO — extraído por repetición real (regla §9)
│   │   ├── rango.ts · format.ts · tipos.ts (ex data.ts)
│   │   └── form.ts              ← str()/din() para FormData
│   ├── plantillas/
│   │   └── gym/dashboard.ts     ← datos del dashboard de la PLANTILLA gym
│   └── modulos/
│       ├── caja-menor/          ← MÓDULO suelto (datos.ts, acciones.ts)
│       ├── clientes/ · planes/ · pagos/ · gastos/   ← MÓDULOS de la plantilla gym
├── components/
│   ├── core/                    ← Navbar, NavModulos, MenuCuenta, SelectorNegocio, TourInicial
│   ├── shared/                  ← FiltroRango, charts/ (CashFlowChart, ExpenseDonut)
│   └── modulos/clientes/        ← ListaClientes (componente del módulo clientes)
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
| CAPA | Taxonomía interna (`CampoModulo`) | `schema.prisma` |
| PLANTILLA | Plataforma armada A BASE DE MÓDULOS (ej: Gym = clientes + planes + pagos + gastos, capa Services) | `/plantillas/` |
| MÓDULO | Producto reutilizable (`Module`): caja-menor suelto; clientes/planes/pagos/gastos dentro de Gym | `/modulos/` |
| COMPONENTE | Pieza UI reutilizable | `components/` |

Regla de oro: el cliente solo ve NEXUS y módulos. La organización ACTIVA módulos (`OrganizationModule`); el catálogo SUGIERE según el rubro (`Module.sugeridoPara`). Una PLANTILLA es un conjunto de módulos que juntos resuelven un negocio completo (hoy Gym, capa Services).

> NOTA (2026-09-16): la tabla `Plantilla`/`PlantillaModulo` NO existe todavía en la DB — se definirá al rediseñar el catálogo. Hoy gym se guarda con slug `gym` en `Module`, y `RUTA_POR_SLUG` en `lib/core/navegacion.ts` es la fuente de verdad de rutas.

## Reglas que sostienen la base

- **El núcleo NO conoce módulos verticales.** `identidad.prisma` solo tiene Organization/Member/Module/OrganizationModule. Gym y Caja Menor cuelgan de orgId sin relación Prisma (FK lógica, cada uno en su archivo).
- **Un módulo nace de un dolor validado** (regla §9 PLAN-BASE-NEXUS): no se crean módulos de listas imaginadas. Hoy existen: Gym (Zona Rosa) y Caja Menor (Casa Museo Pozón).
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

Demo: `laura@zonarosa.com / Admin123` (Zona Rosa, módulo Gym ACTIVO) · `profe@casamuseopozon.com / Admin123` (Casa Museo Pozón, Caja Menor ACTIVA — email del profe PENDIENTE confirmar con el CEO).

## Próximo paso natural

✅ **Caja Menor como módulo** (2026-09-16) — valida que un segundo módulo cuelga del núcleo sin tocarlo. Marcó el primer extracto a componente compartido por repetición real (`lib/rango.ts`, regla §9).
✅ **Refactor de niveles** (2026-09-16) — apps verticales basura fuera (`nexus-finance`, `nexus-services`), gym → `/plantillas/gym` (PLANTILLA), caja-menor → `/modulos/caja-menor` (MÓDULO), lib/core|shared|plantillas|modulos, componentes core|shared|modulos, `acciones-gym.ts` partido en 4 módulos. Type-check y build en verde.

Siguientes movimientos naturales (por iterar con el CEO, en este orden):
1. **Rediseñar el catálogo en la DB**: tabla `Plantilla` + `PlantillaModulo`, y `Module` reales por cada módulo de la gym (clientes, planes, pagos, gastos). Hoy el guard valida el slug `gym` a la vieja.
2. Que el profe pruebe el flujo real de Caja Menor (movimientos + categorías) y ajustar categorías/copy con su feedback.
3. **Solicitudes de fondos** (reposición): pedido → aprobado/rechazado (es el flujo que separa caja menor de un simple libro).
4. **Arqueos**: conteo físico vs sistema con diferencias.
5. **Reporte mensual por categoría** (CSV/PDF) — el dueño exporta y audita.
6. Ordenar ramas: borrar `demo/gym` (superada por el refactor); `gym/prototipo` queda como referencia de la demo Zona Rosa.