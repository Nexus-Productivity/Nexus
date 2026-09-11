# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📋 Overview
Nexus es un monorepo que utiliza pnpm y Turborepo para gestionar un ecosistema de soluciones modulares. Actualmente contiene una aplicación financiera (nexus-finance) con un módulo inicial de caja menor.

## 🏗️ Arquitectura
- **apps/**: Aplicaciones independientes, cada una representa un módulo validado del ecosistema
  - `apps/nexus-finance/`: Aplicación financiera principal
    - `caja-menor/`: Primera aplicación Next.js (módulo de caja menor para negocios)
    - `shared/`: Código compartido específico del dominio Finance
- **packages/**: Bibliotecas y configuraciones compartidas entre aplicaciones
  - `@nexus/config`: Presets compartidos (ESLint, Tailwind, TypeScript)
  - `@nexus/prisma`: Schema y cliente Prisma singleton
  - `@nexus/ui`: Componentes UI compartidos (futuro hogar de Storybook)
  - `@nexus/utils`: Helpers tipados (validación Zod, schemas base)
- **tooling/**: Configuraciones de desarrollo de bajo nivel
  - `eslint-config/`: Configuración base de ESLint
  - `tsconfig/`: Configuración base de TypeScript
- **infraestructura**: 
  - `docker-compose.yml`: PostgreSQL 16 local para desarrollo
  - `.env.example`: Variables de entorno de referencia

## ⚙️ Comandos esenciales

### Instalación y setup inicial
```bash
pnpm install          # instala todas las dependencias del workspace
docker compose up -d  # levanta PostgreSQL local (requerido para desarrollo)
```

### Desarrollo
```bash
pnpm dev              # levanta todas las apps en modo desarrollo con cache deshabilitado
pnpm --filter <package> dev  # desarrollar una específica (ej: @nexus/prisma)
```

### Construcción y calidad
```bash
pnpm build            # build de todas las apps y packages
pnpm lint             # ejecuta ESLint en todo el monorepo
pnpm type-check       # verifica tipos de TypeScript en todo el workspace
pnpm test             # ejecuta pruebas (si existen)
```

### Base de datos (Prisma)
```bash
pnpm --filter @nexus/prisma generate   # genera el cliente Prisma desde schema.prisma
pnpm --filter @nexus/prisma migrate dev # ejecuta migraciones contra la base de datos local
pnpm --filter @nexus/prisma migrate deploy # aplica migraciones en producción
pnpm --filter @nexus/prisma studio     # abre Prisma Studio para inspeccionar datos
```

### Trabajar con paquetes específicos
```bash
# Ejecutar comandos en un package específico
pnpm --filter @nexus/ui lint
pnpm --filter @nexus/utils type-check

# Ver dependencias de un package
pnpm ls --filter @nexus/prisma
```

## 🧪 Testing
Los tests se ejecutan mediante Turborepo con cache basado en build:
```bash
pnpm test              # ejecuta tests en todos los packages que los tengan
pnpm --filter @nexus/prisma test  # tests específicos de un package
```

## 🔧 Notas de desarrollo
- El monorepo usa pnpm como gestor de paquetes
- Turborepo optimiza builds mediante cache y ejecución paralela
- Nunca commitear `.env` - usar solo `.env.example` como referencia
- Las apps Next.js siguen la estructura estándar de páginas y componentes
- Los packages usan exports definidos en su package.json para API clara
- TypeScript está configurado en modo estricto en todo el workspace

## 📚 Convenciones
- Sigue la estructura `apps/<campo>/<módulo>/` para nuevas aplicaciones
- El código reutilizable entre apps va en `packages/`
- La configuración compartida vive en `packages/config` y `tooling/`
- Los nombres de paquetes usan el scope `@nexus/`