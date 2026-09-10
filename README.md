# Nexus

Monorepo del ecosistema Nexus: soluciones simples y precisas, construidas de a módulos validados.

## Stack

- **pnpm** + **Turborepo** (monorepo)
- **Next.js 14** + **React 18** (apps web)
- **TypeScript** estricto
- **Tailwind CSS** (preset compartido con estética Nexus)
- **Prisma** + **PostgreSQL** (datos)
- **Zod** (validación en el borde)

## Estructura

```
Nexus/
├── apps/
│   └── nexus-finance/
│       ├── caja-menor/     ← app Next.js (primer módulo: caja menor para negocios)
│       └── shared/         ← código compartido del campo Finance (próximamente)
├── packages/
│   ├── config/             ← presets compartidos (eslint, tailwind, tsconfig)
│   ├── prisma/             ← schema + cliente Prisma singleton
│   ├── ui/                 ← componentes UI compartidos (futuro hogar de Storybook)
│   └── utils/              ← helpers tipados (validación Zod, schemas base)
├── tooling/
│   ├── eslint-config/      ← config base de ESLint
│   └── tsconfig/           ← tsconfig base
├── docker-compose.yml      ← PostgreSQL 16 local
└── .env.example            ← DATABASE_URL de referencia
```

## Comandos

```bash
pnpm install          # instala todo el workspace
pnpm dev              # levanta todas las apps en dev
pnpm build            # build de todas las apps/packages
pnpm type-check       # typecheck en todo el monorepo
pnpm lint             # lint en todo el monorepo

docker compose up -d  # levanta PostgreSQL local
pnpm --filter @nexus/prisma generate   # genera el cliente Prisma
pnpm --filter @nexus/prisma migrate dev # corre migraciones
```

## Convenciones

- Una app por módulo validado → `apps/<campo>/<modulo>/`
- Código reutilizable entre apps → `packages/`
- Config compartida → `packages/config` y `tooling/`
- Nunca commitear `.env` (solo `.env.example`)