# Session: Corrección de errores en contract.prisma Prisma 8

**Created:** 2026-10-06 14:54:19

---

## Conversation

### 🤖 Assistant
*2026-10-06 15:00:02*

Necesito que resuelvas EXCLUSIVAMENTE el problema actual de Prisma 8 en este proyecto. No hagas refactors adicionales, no cambies la arquitectura de NEXUS, no implementes Clerk, multi-tenancy ni nuevas funcionalidades.

Contexto:

* Proyecto: Next.js 16.3.8 + TypeScript + pnpm.
* Prisma CLI: 8.0.0-rc.20
* @prisma/orm-postgres: 8.0.0-rc.14
* @prisma/client NO es una dependencia directa del proyecto.
* PostgreSQL local.
* El proyecto está migrando de un schema Prisma tradicional a Prisma ORM 8 Contract.
* `prisma skills sync` ya fue ejecutado correctamente.
* `@prisma/orm-postgres@8.0.0-rc.20` NO existe publicado en npm, por lo que NO intentes instalarlo.
* Actualmente existen:

  * `prisma/contract.prisma`
  * `prisma/db.ts`
  * `prisma.config.ts`
  * `generated/prisma/contract.d.ts`
  * `generated/prisma/contract.json`

El contrato ya tiene:

```prisma
// use prisma-8
```

El problema actual aparece al ejecutar:

```bash
npx prisma contract emit
```

y devuelve errores como:

```text
PSL_INVALID_MODEL_MEMBER:
Expected a type after field "temporal"

PSL_INVALID_MODEL_MEMBER:
Invalid model member declaration "."

PSL_INVALID_ATTRIBUTE_ARGUMENT:
Field "Payment.amount" constructor "Decimal" accepts at most 0 argument(s), received 2.

PSL_UNSUPPORTED_FIELD_TYPE:
Field "Tenant.temporal" type "" is not supported in SQL PSL provider v1
```

El contrato contiene actualmente modelos Tenant, User, Customer, Payment y Expense, además de los enums Role, PaymentStatus y PaymentProvider.

IMPORTANTE:

1. Lee primero el contenido real de:

   * `prisma/contract.prisma`
   * `prisma/db.ts`
   * `prisma.config.ts`
   * `package.json`
   * `.agents/skills/prisma-8/SKILL.md` (si existe)
2. Consulta/usa la skill oficial de Prisma 8 instalada para determinar la sintaxis correcta.
3. NO inventes sintaxis.
4. NO actualices paquetes a versiones inexistentes.
5. NO cambies `prisma` de `8.0.0-rc.20`.
6. NO intentes instalar `@prisma/orm-postgres@8.0.0-rc.20`, porque esa versión no está publicada.
7. Mantén el modelo de datos actual de NEXUS; solamente adapta su sintaxis al formato correcto de Prisma ORM 8.
8. No borres datos ni ejecutes comandos destructivos contra PostgreSQL.
9. No implementes todavía multi-tenancy, Clerk, auth, repositories, services ni `$extends`.
10. No hagas cambios fuera de lo estrictamente necesario para que el contrato Prisma 8 sea válido y `contract emit` funcione.

Objetivo único:

Hacer que:

```bash
npx prisma contract emit
```

termine correctamente y genere los artifacts correspondientes.

Después de modificar lo necesario, ejecuta:

```bash
npx prisma contract emit
```

y verifica el resultado.

Si también es necesario corregir `prisma.config.ts` o `prisma/db.ts` para que sean compatibles con el contrato Prisma 8, hazlo únicamente si es estrictamente necesario.

Al terminar, dime únicamente:

* qué archivos modificaste,
* qué cambiaste,
* qué comando ejecutaste,
* y si `npx prisma contract emit` terminó correctamente.

No hagas ninguna otra modificación del proyecto.

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

Let me start by reading the relevant files.

</details>

#### 🔧 Tool: read
**Status:** completed
**Title:** prisma/contract.prisma

**Input:**
```json
{
  "filePath": "/home/craxker/github/nexus-thrive/prisma/contract.prisma"
}
```

**Output:**
```
<path>/home/craxker/github/nexus-thrive/prisma/contract.prisma</path>
<type>file</type>
<content>
1: // use prisma-8
2: 
3: enum Role {
4:   SUPERADMIN
5:   ONWNER
6:   STAFF
7: }
8: 
9: enum PaymentStatus {
10:   PENDING
11:   APPROVED
12:   DECLINED
13:   VOIDED
14: }
15: 
16: enum PaymentProvider {
17:   WOMPI
18:   NEQUI
19:   CASH
20:   TRANSFER
21: }
22: 
23: model Tenant {
24:   id           String   @id @default(uuid())
25:   name         String
26:   slug         String   @unique
27:   customDomain String?  @unique
28:   active       Boolean  @default(true)
29:   createdAt    DateTime @default(now())
30:   updatedAt    DateTime temporal.updatedAt()
31: 
32:   users     User[]
33:   customers Customer[]
34:   payments  Payment[]
35:   expenses  Expense[]
36: 
37:   @@index([slug])
38: }
39: 
40: model User {
41:   id          String   @id @default(uuid())
42:   clerkUserId String   @unique
43:   email       String
44:   name        String?
45:   role        Role     @default(STAFF)
46:   tenantId    String
47:   tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
48:   createdAt   DateTime @default(now())
49:   updatedAt   DateTime temporal.updatedAt()
50: 
51:   @@index([tenantId])
52:   @@index([clerkUserId])
53: }
54: 
55: model Customer {
56:   id        String   @id @default(uuid())
57:   tenantId  String
58:   tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
59:   name      String
60:   email     String?
61:   phone     String?
62:   active    Boolean  @default(true)
63:   createdAt DateTime @default(now())
64:   updatedAt DateTime temporal.updatedAt()
65: 
66:   payments Payment[]
67: 
68:   @@index([tenantId])
69: }
70: 
71: model Payment {
72:   id            String          @id @default(uuid())
73:   tenantId      String
74:   tenant        Tenant          @relation(fields: [tenantId], references: [id], onDelete: Cascade)
75:   customerId    String?
76:   customer      Customer?       @relation(fields: [customerId], references: [id], onDelete: SetNull)
77:   amount        Decimal(12, 2)
78:   status        PaymentStatus   @default(PENDING)
79:   provider      PaymentProvider @default(CASH)
80:   providerRefId String?         @unique
81:   description   String?
82:   createdAt     DateTime        @default(now())
83:   updatedAt     DateTime        temporal.updatedAt()
84: 
85:   @@index([tenantId])
86:   @@index([providerRefId])
87: }
88: 
89: model Expense {
90:   id          String   @id @default(uuid())
91:   tenantId    String
92:   tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
93:   amount      Decimal(12, 2)
94:   category    String
95:   description String
96:   date        DateTime @default(now())
97:   createdAt   DateTime @default(now())
98:   updatedAt   DateTime temporal.updatedAt()
99: 
100:   @@index([tenantId])
101: }

(End of file - total 101 lines)
</content>
```

#### 🔧 Tool: read
**Status:** completed
**Title:** prisma/db.ts

**Input:**
```json
{
  "filePath": "/home/craxker/github/nexus-thrive/prisma/db.ts"
}
```

**Output:**
```
<path>/home/craxker/github/nexus-thrive/prisma/db.ts</path>
<type>file</type>
<content>
1: import "dotenv/config";
2: import postgres from "@prisma/orm-postgres/runtime";
3: import type { Contract } from "./contract.d";
4: import contractJson from "./contract.json" with { type: "json" };
5: 
6: export const db = postgres<Contract>({
7:   contractJson,
8:   url: process.env.DATABASE_URL!,
9: });

(End of file - total 9 lines)
</content>
```

#### 🔧 Tool: read
**Status:** completed
**Title:** prisma.config.ts

**Input:**
```json
{
  "filePath": "/home/craxker/github/nexus-thrive/prisma.config.ts"
}
```

**Output:**
```
<path>/home/craxker/github/nexus-thrive/prisma.config.ts</path>
<type>file</type>
<content>
1: import "dotenv/config";
2: import { definePrismaConfig } from "prisma/config";
3: import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";
4: 
5: export default definePrismaConfig({
6:   orm: ormConfig({
7:     contract: "prisma/contract.prisma",
8:     db: {
9:       connection: process.env["DATABASE_URL"]!,
10:     },
11:   }),
12: });

(End of file - total 12 lines)
</content>
```

#### 🔧 Tool: read
**Status:** completed
**Title:** package.json

**Input:**
```json
{
  "filePath": "/home/craxker/github/nexus-thrive/package.json"
}
```

**Output:**
```
<path>/home/craxker/github/nexus-thrive/package.json</path>
<type>file</type>
<content>
1: {
2:   "name": "nexus-thrive",
3:   "version": "0.1.0",
4:   "private": true,
5:   "scripts": {
6:     "dev": "next dev",
7:     "build": "next build",
8:     "start": "next start",
9:     "lint": "eslint",
10:     "postinstall": "prisma skills sync || exit 0"
11:   },
12:   "dependencies": {
13:     "@prisma/orm-postgres": "8.0.0-rc.14",
14:     "dotenv": "^18.0.5",
15:     "next": "16.3.8",
16:     "react": "19.2.8",
17:     "react-dom": "19.2.8"
18:   },
19:   "devDependencies": {
20:     "@tailwindcss/postcss": "^4",
21:     "@types/node": "^20",
22:     "@types/react": "^19",
23:     "@types/react-dom": "^19",
24:     "eslint": "^9",
25:     "eslint-config-next": "16.3.8",
26:     "prisma": "8.0.0-rc.20",
27:     "tailwindcss": "^4",
28:     "typescript": "^5"
29:   },
30:   "packageManager": "pnpm@12.3.4"
31: }

(End of file - total 31 lines)
</content>
```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

Now let's read the skill for Prisma 8.

</details>

#### 🔧 Tool: read
**Status:** completed
**Title:** .claude/skills/prisma-8/SKILL.md

**Input:**
```json
{
  "filePath": "/home/craxker/github/nexus-thrive/.claude/skills/prisma-8/SKILL.md"
}
```

**Output:**
```
<path>/home/craxker/github/nexus-thrive/.claude/skills/prisma-8/SKILL.md</path>
<type>file</type>
<content>
1: ---
2: name: prisma-8
3: description: >-
4:   Use when working in a project that depends on @prisma/orm-postgres,
5:   @prisma/orm-sqlite, or @prisma/orm-mongo (Prisma 8, formerly Prisma Next): editing
6:   contract.prisma or a contract.ts builder, running `prisma contract emit`,
7:   planning or applying migrations, editing migration.ts, writing db.orm /
8:   db.sql / db.query queries, wiring db.ts or middleware, integrating a build
9:   tool, using the Supabase extension or RLS, or reading a dotted error code
10:   such as MIGRATION.HASH_MISMATCH. Use when the user asks "what is Prisma
11:   8", "where do I start", or compares it to another ORM. Use when the user
12:   asks to upgrade or bump Prisma 8 in an app or an extension package. Use when
13:   you see @internal/* or @prisma/orm-* imports, prisma.config.ts with
14:   definePrismaConfig, or contract.json / contract.d.ts. Do not use for Prisma
15:   ORM 7 or earlier (schema.prisma + @prisma/client).
16: metadata:
17:   library: '@prisma/orm-postgres'
18:   library_version: '8.0.0-rc.14'
19:   version: '2026-09-12'
20: ---
21: 
22: # Prisma 8 (Prisma 8)
23: 
24: > **Edit your data contract. Prisma handles the rest.**
25: 
26: Prisma 8 moves fast, and your training data about it is very likely outdated. This skill ships inside the installed Prisma packages, so it describes the exact version this project has — treat it and its reference files as the source of truth, over anything you remember about Prisma.
27: 
28: ## Pre-conditions
29: 
30: Check these before acting on anything below. Halt on the first one that fails and tell the user what is missing.
31: 
32: 1. **The project is on Prisma 8.** `prisma.config.ts` exports `definePrismaConfig({ orm: ... })`, and `package.json` depends on `@prisma/orm-postgres`, `@prisma/orm-sqlite`, or `@prisma/orm-mongo`. A project with `schema.prisma` and `@prisma/client` is Prisma 7 or earlier; this skill does not apply to it, and its instructions will break such a project.
33: 2. **The skill matches the installed version.** Compare `metadata.library_version` in this file's frontmatter with the installed `@prisma/orm-*` version in `package.json`. If they differ, run `prisma skills sync` and re-read this file before continuing.
34: 3. **The contract artefacts exist.** `contract.json` and `contract.d.ts` sit next to the contract source named by `prisma.config.ts`. If they are missing or older than the source, run `prisma contract emit` first; every query and migration instruction below assumes current artefacts.
35: 
36: **Import paths in the references.** The reference files spell façade imports as `@internal/<target>/<subpath>` and `@internal/extension-<name>/<subpath>`. In an application those packages are published as `@prisma/orm-<target>/<subpath>` (`@prisma/orm-postgres/runtime`, `@prisma/orm-mongo/config`, `@prisma/orm-sqlite/runtime`) and `@prisma/orm-extension-<name>/<subpath>` (`@prisma/orm-extension-pgvector/control`). Write the `@prisma/orm-*` name in user code; the two spellings are the same package. Paths already written as `@prisma/orm-*` in the references are exact. The `metadata.library_version` in this file's frontmatter is the version it was published with; if it does not match the project's installed Prisma packages, run `prisma skills sync` and re-read.
37: 
38: Prisma 8 is a contract-first data layer. This skill routes every Prisma 8 task to the right reference file — open the reference before writing code; do not answer from this file alone.
39: 
40: ## The canonical model (one paragraph)
41: 
42: You author a **data contract** (a `contract.prisma` file, or a TypeScript builder). The framework emits machine-readable artifacts (`contract.json`, `contract.d.ts`) and gives you two runtime surfaces on SQL targets: a typed SQL query builder (`db.sql.<ns>.<table>`) and a typed ORM client (`db.orm.<ns>.<Model>`). On MongoDB targets only the ORM lane exists, and its keys are collection storage names (`db.orm.users`) rather than PSL model names — [`references/queries.md`](references/queries.md) § *MongoDB ORM addressing* covers the rule. Migrations are planned from the contract diff; you review them, optionally edit the `migration.ts` for data transforms, and apply.
43: 
44: Three steps the user does:
45: 
46: 1. **Edit your data contract.** ([`references/contract.md`](references/contract.md))
47: 2. **The system plans the migrations for you.** ([`references/migrations.md`](references/migrations.md))
48: 3. **If you need data migrations, you edit `migration.ts` and execute it.** ([`references/migrations.md`](references/migrations.md))
49: 
50: Everything else — queries, runtime wiring, build integration, debugging, feedback — sits on top of those three.
51: 
52: One cross-cutting migration fact: `migration plan` does **not** chain from the newest migration on disk. Its origin is `--from`, else the `db` ref, else an empty database — so a project with no ref keeps planning from scratch. Over existing migrations the CLI refuses that (`MIGRATION.PLAN_ORIGIN_UNKNOWN`) instead of writing a full-create package; choose the exit that matches your intent rather than reflexively passing `--from @empty`. [`references/migration-model.md`](references/migration-model.md) § *The trap* explains which to choose.
53: 
54: ## Routing table
55: 
56: Open the reference whose triggers match the task. If more than one matches, open each — they are written to compose.
57: 
58: | Task | Reference | Triggers |
59: | --- | --- | --- |
60: | Adopt / set up / first steps | [`references/quickstart.md`](references/quickstart.md) | new project, existing database, "what can I do with Prisma 8", "where do I start", "just ran createprisma", `npx create-prisma`, first steps, first query, `prisma orm init` greenfield setup, `contract infer` + `db sign` brownfield adoption, connect-write-read first arc, day-to-day commands (`contract emit`, `db init`, `db update`, `migration plan`, `db migrate`, `db schema`, `db verify`), flags `--target` / `--authoring` / `--schema-path` / `--probe-db` / `--output` |
61: | Edit the data contract | [`references/contract.md`](references/contract.md) | schema, models, fields, attributes, relations, indexes, enums, value objects (composite types), type aliases, namespaces (Postgres schemas), cross-contract foreign keys (cross-space FK), polymorphic types (`@@discriminator` / `@@base`), extension namespaces (`pgvector.Vector(...)`, `postgis.Geometry(...)`), `prisma.config.ts` / `definePrismaConfig` / `ormConfig`, `prisma contract emit`, PSL, `contract.prisma`, `contract.ts`, `contract.json`, `contract.d.ts`, `@internal/postgres/config`, `@internal/postgres/contract-builder`, `@internal/mongo/config`, `extensions:`, pgvector, postgis, paradedb, Temporal / `temporal-polyfill` / `RUNTIME.TEMPORAL_UNAVAILABLE`, `@@control`, control policy (managed / tolerated / external / observed), soft delete, validations, callbacks |
62: | Author migrations | [`references/migrations.md`](references/migrations.md) | `db update` vs `migration plan`, `db migrate`, `migration new`, `migration show`, `db update --dry-run`, `db verify`, `db sign`, data migration, `dataTransform`, placeholder sentinels in framework-rendered `migration.ts`, `MIGRATION.HASH_MISMATCH`, `MIGRATION.UNFILLED_PLACEHOLDER`, `MIGRATION.DESTRUCTIVE_CHANGES` / `--confirm <database>`, schema drift |
63: | Migration graph, refs, plan origin | [`references/migration-model.md`](references/migration-model.md) | migration graph, refs, `migration ref set` / `list` / `delete`, the `db` ref, `--advance-ref`, `--no-advance-ref`, `migration plan --from`, `from: (baseline)` in plan output, greenfield / from-scratch plan, baseline, first migration before deploy (Composer / CD-managed databases), chaining migrations, retrofitting migrations onto an existing database, `MIGRATION.HASH_NOT_IN_GRAPH`, `MIGRATION.PATH_UNREACHABLE` at plan/chain time |
64: | Review migrations on deploy | [`references/migration-review.md`](references/migration-review.md) | "what migrations are going to run", "what runs on deploy / merge", merge conflict, diamond convergence, concurrent migrations, migration status, ref management for CI, staging / production environment refs, `MIGRATION.MARKER_NOT_IN_HISTORY`, `MIGRATION.MISSING_INVARIANTS`, `db migrate --show` |
65: | Write queries | [`references/queries.md`](references/queries.md) | query, where, select, project, orderBy, limit, offset, take, skip, include, lookup, first, all, count, aggregate, groupBy, create, update, delete, upsert, returning, transaction, `db.orm`, `db.sql`, `runtime.query(plan)` vs `runtime.execute(plan)`, `db.prepare` / prepared statements, streaming / `for await`, many-to-many `include` and nested `connect`, `and` / `or` / `not` from `@prisma/orm-postgres/orm-client`, `db.query.from(...)` (Mongo pipeline), namespace-aware accessors, `.all()` Thenable, single-use iterators (`RUNTIME.ITERATOR_CONSUMED`), target-declared aggregate types (`count`, integer `sum`, and integer `avg` are `number`; `count` and integer `sum` throw outside ±(2^53 − 1) rather than round, while `avg` is a fraction already and carries no guard; `countBigInt` / `sumBigInt` / `avgDecimal` are the lossless forms, `avgDecimal` on PostgreSQL only), drizzle-style, kysely-style. Naming types (§ *Naming model and result types*): "type of my model", "return type of a query", `ResultType`, `Scalars`, `Shape`, `models` / `Models` namespace in `contract.d.ts`, `Models.public_User`, Prisma 7 `Prisma.User` / `GetPayload` / `UserGetPayload` equivalents. Postgres/SQLite specifics: [`references/queries-postgres.md`](references/queries-postgres.md); Mongo specifics: [`references/queries-mongo.md`](references/queries-mongo.md) |
66: | Wire the runtime | [`references/runtime.md`](references/runtime.md) | `db.ts`, `postgres<Contract>(...)` / `sqlite<Contract>(...)` / `mongo<Contract>(...)` façades, middleware composition (lints, budgets, cache via `@prisma/orm-extension-middleware-cache`, custom `afterQuery` middleware, `@prisma/orm-postgres/family-runtime`), `DATABASE_URL`, `.env`, connection pool / `poolOptions`, dev vs prod config, transactions, read replicas, multi-database, script won't exit / hangs, `db.close` / `pool.end`, `await using` / `[Symbol.asyncDispose]` |
67: | Build-tool integration | [`references/build.md`](references/build.md) | Vite plugin (`@internal/vite-plugin-contract-emit`, Vite 7/8), `vite.config.ts`, contract emit on save, HMR / dev server, Next.js / Webpack / esbuild / Rollup / Turbopack (named gaps, not fabricated) |
68: | Supabase | [`references/supabase.md`](references/supabase.md) | `@internal/extension-supabase`, RLS, row level security, policies (`policy_select` / `policy_update` / `@@rls`, `auth.uid()`), role binding (`asUser(jwt)` / `asAnon()` / `asServiceRole()`), `auth.users`, cross-space FKs to `supabase:auth.AuthUser`, JWT / JWKS (`SUPABASE_JWKS_URL`, `SUPABASE_JWT_SECRET`), `SUPABASE.JWT_INVALID`, `SUPABASE.CONFIG_INVALID`, `RoleBoundDb`, session pooler |
69: | Debug an error | [`references/debug.md`](references/debug.md) | any structured error envelope (code, severity, why, fix, nextActions, meta), emit failed, query won't typecheck, query crashed, migration won't apply, `MIGRATION.HASH_MISMATCH`, `MIGRATION.RUNNER_FAILED`, `BUDGET.ROWS_EXCEEDED`, `BUDGET.TIME_EXCEEDED`, `RUNTIME.ABORTED`, `RUNTIME.TEMPORAL_UNAVAILABLE`, `PLAN.HASH_MISMATCH`, `CONTRACT.MARKER_MISSING`, `CONFIG.*` / `CLI.*` / `CONTRACT.*` / `MIGRATION.*` / `ORM.*` / `RUNTIME.*` codes, legacy `PN-*` codes, exit code 4 findings, drift, capability missing, planner conflict, EXPLAIN, query log, script won't exit / close connection |
70: | Upgrade Prisma in an app | [`references/upgrade-app.md`](references/upgrade-app.md) | "upgrade Prisma", "upgrade Prisma 8", "bump Prisma 8", "move to Prisma 8 X.Y", `@internal/*` version bump in an application, per-transition upgrade instructions in [`upgrading/app/upgrades/`](upgrading/app/upgrades/), extension-pin pre-flight, `PN-UPGRADE-*` |
71: | Upgrade Prisma in an extension | [`references/upgrade-extension.md`](references/upgrade-extension.md) | the same request in a package that *is* a Prisma extension (`@internal/contract` / SPI dependency, `^@.*/extension-` name), `prisma-8-check-pins`, exact-pin rule, per-transition instructions in [`upgrading/extension/upgrades/`](upgrading/extension/upgrades/) |
72: | File feedback / ask the team | [`references/feedback.md`](references/feedback.md) | bug report, file an issue, feature request, missing feature, capability gap, "this is broken", surprising behaviour, Q&A / design discussion, ask the Prisma team, Prisma Discord (pris.ly/discord), extension-author questions |
73: 
74: ## Routing rules
75: 
76: If the task clearly matches a row, open that reference directly without asking.
77: 
78: For a vague prompt, ask **one** disambiguating question. Pick from:
79: 
80: - *"Are you new to Prisma 8 and asking what you can do with it, or where to start?"* → [`references/quickstart.md`](references/quickstart.md) (first-touch orientation path).
81: - *"Do you want to set up a new Prisma 8 project, or wire it into an existing database?"* → [`references/quickstart.md`](references/quickstart.md).
82: - *"Do you want to edit your data contract (add a model / field / relation), or work with the database (migrations, queries)?"* → [`references/contract.md`](references/contract.md) vs the others.
83: - *"Is this about authoring a migration, or about reviewing what's going to run on deploy?"* → [`references/migrations.md`](references/migrations.md) vs [`references/migration-review.md`](references/migration-review.md). If it's about where a plan starts, refs, or an unexpected from-scratch plan → [`references/migration-model.md`](references/migration-model.md).
84: - *"Is this about wiring Prisma 8 into your build tool (Vite / Next.js / …), or about wiring `db.ts` and middleware at runtime?"* → [`references/build.md`](references/build.md) vs [`references/runtime.md`](references/runtime.md).
85: - *"What error or symptom are you seeing?"* → [`references/debug.md`](references/debug.md).
86: - *"Do you want to report this as a bug to the Prisma 8 team, or is this a feature request?"* → [`references/feedback.md`](references/feedback.md).
87: - *"Is the project you want to upgrade an application, or a Prisma extension package?"* → [`references/upgrade-app.md`](references/upgrade-app.md) vs [`references/upgrade-extension.md`](references/upgrade-extension.md).
88: 
89: If you still can't tell which reference applies, ask the user what they want to do. Do not guess.
90: 
91: ## Checklist
92: 
93: - [ ] If the task matches a routing-table row, open that reference before writing code.
94: - [ ] If the prompt is vague, ask one disambiguating question.
95: - [ ] Do not attempt to answer from this file alone — the references carry the verified tool surface.
96: - [ ] If the user describes a missing feature or a misbehaviour they want fixed, open [`references/feedback.md`](references/feedback.md).

(End of file - total 96 lines)
</content>
```

#### 🔧 Tool: glob
**Status:** completed

**Input:**
```json
{
  "pattern": ".agents/skills/prisma-8/**"
}
```

**Output:**
```
No files found
```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

Now let's read references/contract.md for the correct syntax.

</details>

#### 🔧 Tool: bash
**Status:** completed
**Title:** rtk ls .claude/skills/prisma-8/ && rtk ls .claude/skills/prisma-8/references/ 2>/dev/null

**Input:**
```json
{
  "command": "rtk ls .claude/skills/prisma-8/ && rtk ls .claude/skills/prisma-8/references/ 2>/dev/null"
}
```

**Output:**
```
references/
upgrading/
SKILL.md  14.4K
build.md  9.1K
contract.md  38.7K
debug.md  18.2K
feedback.md  16.5K
migration-model.md  18.9K
migration-review.md  20.0K
migrations.md  46.2K
queries-mongo.md  12.7K
queries-postgres.md  32.0K
queries.md  21.7K
quickstart.md  31.3K
runtime.md  33.1K
supabase.md  20.1K
upgrade-app.md  9.3K
upgrade-extension.md  9.1K

```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

Let's read contract.md, focusing on scalar types, Decimal, and updatedAt / temporal.

</details>

#### 🔧 Tool: grep
**Status:** completed
**Title:** Decimal|temporal|updatedAt

**Input:**
```json
{
  "path": "/home/craxker/github/nexus-thrive/.claude/skills/prisma-8/references/contract.md",
  "pattern": "Decimal|temporal|updatedAt"
}
```

**Output:**
```
Found 13 matches
/home/craxker/github/nexus-thrive/.claude/skills/prisma-8/references/queries-postgres.md:
  Line 223: **Reduce a to-many relation to a scalar.** A refinement callback may return a *reducer* — `count()`, `sum(field)`, `avg(field)`, `min(field)`, `max(field)`, plus the lossless `countBigInt()`, `sumBigInt(field)`, and `avgDecimal(field)` — instead of a collection. The parent's relation field then carries that one value rather than an array. Reducers exist only inside an `include(...)` callback; calling one elsewhere throws.

  Line 310: `aggregate` exposes `.count()`, `.sum(field)`, `.avg(field)`, `.min(field)`, `.max(field)`, and the lossless `.countBigInt()`, `.sumBigInt(field)`, `.avgDecimal(field)`. Project the aggregates into named result keys; the result type narrows accordingly.

  Line 324: | `avgDecimal(field)` over any integer or `numeric` | decimal `string \| null` | `null` |

  Line 330: **Float and Decimal columns keep their own family.** `sum` over `numeric` is still a decimal string, and `sum` over `float8` still a `number` — the defaults policy is about integers, and a column whose author chose `numeric` already chose its representation.

  Line 332: **SQLite states the same policy.** `count`, `sum` over integers, and `avg` all read as `number`; `countBigInt` and `sumBigInt` are there too. There is no `avgDecimal` — SQLite has no exact decimal type, so the method does not exist on a SQLite contract.

  Line 487: - [ ] Reached for `countBigInt` / `sumBigInt` / `avgDecimal` where the value can outgrow a JS number or the exact decimal matters — `count()` and `sum` over an integer column throw `RUNTIME.DECODE_FAILED` outside ±(2^53 − 1) rather than rounding, and `avg` rounds as any double does.


/home/craxker/github/nexus-thrive/.claude/skills/prisma-8/references/debug.md:
  Line 108: | `RUNTIME.TEMPORAL_UNAVAILABLE` | Runtime, first read or write touching a Temporal-backed column (`Date`, `Timestamp(p)`, `Timestamptz(p)`, `Time(p)`) or a `temporal.updatedAt()` clock | No global `Temporal`. Node.js 26.8.2 and later ship `globalThis.Temporal`; 26.8.1 and earlier — including every 22 and 24 — do not. Either `import 'temporal-polyfill/full/global'` before the first query, or author the column as `DateString` / `TimestampString(p)` / `TimestamptzString(p)` / `TimeString(p)` to read PostgreSQL's own text. |


/home/craxker/github/nexus-thrive/.claude/skills/prisma-8/references/contract.md:
  Line 119: **Temporal columns.** On PostgreSQL, `Date`, `Timestamp(p)`, `Timestamptz(p)` and `Time(p)` read and write `Temporal` values (`Temporal.PlainDate`, `PlainDateTime`, `Instant`, `PlainTime`), never JavaScript `Date`. They need a global `Temporal` at query time: Node.js 26.8.2 and later ship `globalThis.Temporal`; 26.8.1 and earlier — including every 22 and 24 release — do not, and the first read or write of such a column throws `RUNTIME.TEMPORAL_UNAVAILABLE`. On those runtimes either `import 'temporal-polyfill/full/global'` before the first query (add `temporal-polyfill` as a dependency) or author the column as `DateString` / `TimestampString(p)` / `TimestamptzString(p)` / `TimeString(p)`, which carry PostgreSQL's own text and need no `Temporal`. `prisma contract emit`, `prisma db init` and the other commands need no global `Temporal`: the Postgres target loads `temporal-polyfill` as a fallback `Temporal` for the control plane, and sets no global. `temporal-polyfill` is a required peer dependency of `@prisma/orm-postgres`. npm, pnpm and bun install it automatically. With Yarn, add `temporal-polyfill` (`^1.0.4`) to the project's dependencies, or the commands fail because Node.js cannot find the package. That fallback is held once per process. An application that loads control-plane code in its own process, such as server code under `vite dev` with the Prisma Vite plugin or a script that calls the control client, decodes dates without its own `Temporal`, and then fails in production. An application that uses the Temporal codecs must load its own `Temporal`. A TypeScript contract file that constructs a `Temporal` value must load an implementation too.

  Line 157: The concept: same model, different authoring surface. The façade re-exports `defineContract`, `field`, `model`, `rel`, plus the `family`/`target` packs as default exports of `@internal/postgres/family` and `@internal/postgres/target`. Use the callback overload (`defineContract({...}, ({ field, model, rel, type }) => ({...}))`) to get the higher-level helpers (`field.text()`, `field.id.uuidv7String()`, `field.temporal.createdAt()`, `type.sql.String(35)`).

  Line 175:           createdAt: field.temporal.createdAt(),

  Line 187: Mongo scalar types, as PSL name / TS builder / application type: `String` / `field.string()` / `string`; `Int32` / `field.int32()` / `number`; `Int64` / `field.int64()` / `bigint`; `Double` / `field.double()` / `number`; `Decimal128` / `field.decimal128()` / decimal text as a `string`; `Bool` / `field.bool()` / `boolean`; `Date` / `field.date()` / `Date`; `ObjectId` / `field.objectId()` / `string`; `Binary` / `field.binary()` / `Uint8Array`; `Json` / `field.json()` / `JsonValue`; `Bson` / `field.bson()` / `BsonValue`. `Json` holds a JSON value only, validated as the JSON-representable BSON types; `Bson` holds any BSON value, unconstrained by the validator. The full table, with codec ids and storage types, is [Scalar types](https://github.com/prisma/orm/blob/main/docs/reference/scalar-types.md).

  Line 189: Mongo timestamps the ORM fills: in PSL, type the field `temporal.createdAt()` (set on create), `temporal.updatedAt()` (set on create and on every update with a non-empty payload), or `temporal.timestamp(onCreate: now, onUpdate: now)` with either option; in TS, use `field.temporal.createdAt()` and the rest inside the callback overload. They store a BSON date read back as `Date`, one value per ORM operation, and an explicit value in the write wins. The fields are optional on create. A preset field cannot be optional (`?`), a list, `@id`, or a field of a composite type.

  Line 315:   total Decimal

```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

Let's read contract.md in full to understand scalar types and attributes in PSL for Prisma 8.

</details>

#### 🔧 Tool: read
**Status:** completed
**Title:** .claude/skills/prisma-8/references/contract.md

**Input:**
```json
{
  "filePath": "/home/craxker/github/nexus-thrive/.claude/skills/prisma-8/references/contract.md"
}
```

**Output:**
```
<path>/home/craxker/github/nexus-thrive/.claude/skills/prisma-8/references/contract.md</path>
<type>file</type>
<content>
1: 
2: # Prisma 8 — Contract Authoring
3: 
4: > **Edit your data contract. Prisma handles the rest.**
5: 
6: The data contract is the single source of truth for your data layer. You edit a contract source — `contract.prisma` (PSL, the canonical surface) or `contract.ts` (TypeScript builder) — and the framework derives types, migrations, and runtime configuration from it. The three-step user model:
7: 
8: 1. **You edit your data contract.**
9: 2. **The system plans the migrations for you.** (`references/migrations.md`)
10: 3. **If you need data migrations, you edit `migration.ts` and execute it.** (`references/migrations.md`)
11: 
12: Behind step 1 the agent runs `prisma contract emit` after every contract edit (or installs the Vite plugin so the bundler runs it on save — see `references/build.md`). Emit reads the contract source through the provider the façade picks based on the file extension of `contract:` in `prisma.config.ts`, then writes two artefacts colocated with the source:
13: 
14: - `contract.json` — the canonical, content-hashed Contract IR. Read by the planner, the runtime, and `db verify`.
15: - `contract.d.ts` — the precise TypeScript types the runtime + lanes propagate when you import `Contract` from it.
16: 
17: Both files are **emitted artefacts**. Edit the source; never the JSON or `.d.ts`.
18: 
19: ## When to Use
20: 
21: - User wants to add, change, or remove a model / field / relation.
22: - User wants to add an index, unique constraint, check constraint, enum, or value object (composite type).
23: - User wants to add a namespace block (Postgres schema) or a cross-contract foreign key.
24: - User wants to set `@@control` on a model or configure `defaultControlPolicy`.
25: - User wants to use a custom type from an extension (`pgvector.Vector(length: 1536)`, `postgis.Geometry(...)`).
26: - User wants to install or configure an extension via `extensions: [...]` in `prisma.config.ts`, including `@internal/extension-supabase`.
27: - User is migrating between authoring sources (PSL ↔ TypeScript builder).
28: - User received `CONFIG.CONTRACT_MISSING`, `CONTRACT.VALIDATION_FAILED`, or `CONFIG.MISSING_EXTENSION_PACKS` from `contract emit`.
29: - User mentions: *schema, fields, models, attributes, prisma schema, PSL, contract.prisma, contract.ts, contract.json, contract.d.ts, contract emit, façade imports, `@internal/postgres/config`, `@internal/postgres/contract-builder`, extensions, pgvector, postgis, paradedb, supabase, namespaces, cross-space FK, `@@control`, enums, check constraints, `@@check`, value objects, validations, callbacks, soft delete, paranoid, scopes*. (The last cluster routes to *What Prisma 8 doesn't do yet* below.)
30: 
31: ## When Not to Use
32: 
33: - User wants to apply a contract change to the DB → `references/migrations.md`.
34: - User wants to write a query against the contract → `references/queries.md`.
35: - User wants to wire `db.ts` (runtime entry point, middleware, env config) → `references/runtime.md`.
36: - User wants the Vite / bundler integration → `references/build.md`.
37: - User wants to set up Prisma 8 for the first time → `references/quickstart.md`.
38: - User wants a deeper read of a single structured error envelope → `references/debug.md`.
39: - User wants to file a missing-feature request → `references/feedback.md`.
40: 
41: ## Key Concepts
42: 
43: - **The `@internal/<target>` façade is the only surface user-authored code imports from.** For a Postgres app: `@internal/postgres/config`, `@internal/postgres/contract-builder`, `@internal/postgres/control`, `@internal/postgres/runtime`. Mongo has the same layout (`@internal/mongo/config`, `@internal/mongo/contract-builder`, `@internal/mongo/runtime`). Each extension publishes its own façade — `@internal/extension-pgvector/control`, `@internal/extension-postgis/control`, `@internal/extension-paradedb/control`. **Never reach into `@internal/cli/*`, `@internal/family-*`, `@internal/target-*`, `@internal/adapter-*`, `@internal/driver-*`, or `@internal/sql-contract-*` from user code.** The façade bakes the family / target / adapter / driver wiring in. See *Common Pitfalls* #4.
44: - **Contract source.** A file the framework reads and lowers to the canonical Contract IR. Two flavours, both first-class:
45:   - **`contract.prisma` (PSL)** — schema-flavoured DSL. Canonical for typical apps and brownfield Prisma users. Wired by `contract: './<path>/contract.prisma'` — the target config (`ormConfig`, below) detects the `.prisma` extension and routes through the PSL provider. The first line of every `.prisma` file is `// use prisma-8`; `orm init` and `contract infer` write it, and the language server only serves diagnostics, completion, and formatting on files that carry it (it still recognises the header earlier releases wrote and rewrites it on Format).
46:   - **`contract.ts` (TypeScript builder)** — programmatic authoring with `defineContract({...}, ({ field, model, rel, type }) => ({...}))` from `@internal/postgres/contract-builder` (or `@internal/mongo/contract-builder`). Wired by `contract: './<path>/contract.ts'` — the façade detects the `.ts` extension and routes through the TS provider. Use when you need programmatic composition (per-tenant variants, generated fields) or constructs PSL doesn't yet express (e.g. registering a parameterised extension type — see pgvector's contract).
47:   - **An existing Prisma schema, during adoption.** A project that still runs an earlier Prisma can point `contract:` at its current `schema.prisma` instead of writing a Prisma 8 contract: `contract: prisma6Schema('prisma/schema.prisma')` from `@internal/mongo/config` reads a Prisma 6 MongoDB schema, and `prisma7Schema` from `@internal/postgres/config` reads a Prisma 7 Postgres schema. The earlier Prisma keeps owning the database; after each change there, run `contract emit` and `db sign`. A construct Prisma 8 cannot express fails `contract emit` with a `PSL.PRISMA6_MONGO_*` or `PSL.PRISMA7_*` diagnostic. See the façade READMEs for the details.
48: - **`prisma.config.ts`.** Wires the contract source, the database connection, the migrations directory, and any installed extensions. The file is an *envelope*: the unified CLI's `definePrismaConfig({...})` from `@prisma/cli-engine` wraps an `orm:` section built by the target's `defineConfig` — conventionally imported as `ormConfig` from `@internal/postgres/config` (or `@internal/mongo/config`). There is no flat form; a bare `defineConfig({ contract, ... })` default export fails with `CONFIG.VERSION_MARKER_MISSING`.
49: 
50:   ```typescript
51:   // prisma.config.ts — what `prisma orm init` scaffolds
52:   import 'dotenv/config';
53:   import { definePrismaConfig } from '@prisma/cli-engine';
54:   import { defineConfig as ormConfig } from '@internal/postgres/config';
55: 
56:   export default definePrismaConfig({
57:     orm: ormConfig({
58:       contract: './src/prisma/contract.prisma',
59:       db: { connection: process.env['DATABASE_URL']! },
60:     }),
61:   });
62:   ```
63: 
64:   The fields `ormConfig` accepts: `contract` (path string — `.prisma` or `.ts`), `output` (optional override for where `contract.json` lands), `db` (`{ connection?: string }`), `extensions` (array of control descriptors), `migrations` (`{ dir?: string }`). Without `output`, the path for `contract.json` is derived from `contract` (e.g. `./src/prisma/contract.prisma` → `./src/prisma/contract.json`). Keep `import 'dotenv/config'` when the config reads `process.env`.
65: - **Emit pipeline.** `prisma contract emit --config <path>?` reads `prisma.config.ts`, calls the provider the façade picked, validates the resulting Contract, then atomically writes `contract.json` + `contract.d.ts` colocated with the source.
66: - **Extension namespaces.** Extensions contribute namespaced constructors (`pgvector.Vector(length: 1536)`, `postgis.Geometry(...)`) and helper presets. Install them by adding the descriptor to **two** places — both fields are named `extensions`, but the two surfaces consume two different descriptor types and shapes:
67:   - **In the config (façade and core):** `extensions: [pgvector]` — array of *control* descriptors imported from `@internal/extension-<name>/control`.
68:   - **In the TS builder's `defineContract` (only when authoring `contract.ts`):** `extensions: { pgvector }` — record of *pack* descriptors imported from `@internal/extension-<name>/pack`.
69: - **Contract space.** Every package that emits a contract owns its own *contract space* — a `prisma.config.ts` at package root, a contract source, the colocated emitted artefacts, and a `migrations/` directory. **There are two intentional on-disk layouts**, picked by whether the contract space is the consuming application or a contract-space package (an extension, an internal aggregate-root package, etc.):
70:   - **Application layout** (what you use when building an *app*). `prisma.config.ts` at repo root; `src/prisma/contract.{prisma,ts}`; `src/prisma/contract.{json,d.ts}` colocated; `src/prisma/db.ts` colocated; migrations under `migrations/app/<timestamp>_<slug>/`. The `app/` segment is the consuming application's space-id; extension space-ids land in sibling `migrations/<extension-space-id>/` directories that the extension packages manage. This is what `examples/prisma-8-demo` uses and what `prisma orm init` scaffolds by default (`src/prisma/contract.prisma` with `db.ts` beside it).
71:   - **Contract-space-package layout** (what you use when *publishing* a contract-space package — extensions, internal monorepo packages). `prisma.config.ts` at package root; `src/contract.{prisma,ts}` directly (no `prisma/` subdir); `src/contract.{json,d.ts}` colocated; `migrations/<timestamp>_<slug>/` directly under `migrations/` (no `<space-id>` segment — the package *is* a single space). Documented in `.cursor/rules/contract-space-package-layout.mdc` and ADR 212.
72: 
73:   Both layouts let `ormConfig`'s `contract:` path point at the source; the framework derives everything else (emit output, migration root) from there. Pick the layout that matches what you're building and stick with it — don't mix.
74: 
75: ## Diagnostic codes you route on
76: 
77: `prisma contract emit` surfaces structured errors with stable codes; branch on `code` rather than message text.
78: 
79: | Code | Meaning | Next move |
80: |---|---|---|
81: | `CONFIG.CONTRACT_MISSING` | `contract` not set in `prisma.config.ts`. | Add `contract: './src/prisma/contract.prisma'` (app layout) or `'./src/contract.prisma'` (contract-space-package layout) — likewise for `.ts` sources — to the `ormConfig({...})` section. |
82: | `CONFIG.VERSION_MARKER_MISSING` | The default export was not produced by `definePrismaConfig` / `ormConfig` (a flat `defineConfig({...})`, a plain object, or a Prisma 7 config). | Rewrite to the envelope form in *Key Concepts* above. |
83: | `CONTRACT.VALIDATION_FAILED` | Source loaded but the Contract IR failed structural validation. | Read `meta.errors` for the offending model/field, fix the source, re-emit. |
84: | `CONFIG.MISSING_EXTENSION_PACKS` | The contract uses a namespaced constructor (e.g. `pgvector.Vector(...)`) but `extensions` in the config does not list a matching descriptor. `meta.missingExtensionPacks` names them. | Install the package, import its control descriptor (`import pgvector from '@internal/extension-pgvector/control'`), add it to `extensions: [...]` in `ormConfig({...})`. |
85: 
86: ## Workflow — Read the contract source of truth
87: 
88: The concept: every contract change starts by locating the source file. The config is authoritative — read `prisma.config.ts`, find the `contract:` field (a path string under the façade), and open the file it points at. The same field tells you the installed `extensions: [...]`.
89: 
90: ```bash
91: cat prisma.config.ts
92: ```
93: 
94: If `contract:` ends in `.prisma`, the source is PSL; if it ends in `.ts`, the source is the TS builder. If `prisma.config.ts` is missing, route to `references/quickstart.md`.
95: 
96: ## Workflow — Edit a model / field / relation (PSL)
97: 
98: The concept: PSL models lower to tables (or collections, on Mongo); fields lower to columns; `@relation(...)` declares the FK side. Add the relation only on the owning side — the framework derives the back-reference automatically.
99: 
100: ```prisma
101: model User {
102:   id    Int    @id @default(autoincrement())
103:   email String @unique
104: }
105: 
106: model Post {
107:   id       Int    @id @default(autoincrement())
108:   title    String
109:   authorId Int
110:   author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
111: 
112:   @@unique([title, authorId])
113:   @@index([authorId])
114: }
115: ```
116: 
117: Then run `pnpm prisma contract emit` (or rely on the Vite plugin — see `references/build.md`). Specify cascade behaviour explicitly with `onDelete` / `onUpdate`; the default is `Restrict`.
118: 
119: **Temporal columns.** On PostgreSQL, `Date`, `Timestamp(p)`, `Timestamptz(p)` and `Time(p)` read and write `Temporal` values (`Temporal.PlainDate`, `PlainDateTime`, `Instant`, `PlainTime`), never JavaScript `Date`. They need a global `Temporal` at query time: Node.js 26.8.2 and later ship `globalThis.Temporal`; 26.8.1 and earlier — including every 22 and 24 release — do not, and the first read or write of such a column throws `RUNTIME.TEMPORAL_UNAVAILABLE`. On those runtimes either `import 'temporal-polyfill/full/global'` before the first query (add `temporal-polyfill` as a dependency) or author the column as `DateString` / `TimestampString(p)` / `TimestamptzString(p)` / `TimeString(p)`, which carry PostgreSQL's own text and need no `Temporal`. `prisma contract emit`, `prisma db init` and the other commands need no global `Temporal`: the Postgres target loads `temporal-polyfill` as a fallback `Temporal` for the control plane, and sets no global. `temporal-polyfill` is a required peer dependency of `@prisma/orm-postgres`. npm, pnpm and bun install it automatically. With Yarn, add `temporal-polyfill` (`^1.0.4`) to the project's dependencies, or the commands fail because Node.js cannot find the package. That fallback is held once per process. An application that loads control-plane code in its own process, such as server code under `vite dev` with the Prisma Vite plugin or a script that calls the control client, decodes dates without its own `Temporal`, and then fails in production. An application that uses the Temporal codecs must load its own `Temporal`. A TypeScript contract file that constructs a `Temporal` value must load an implementation too.
120: 
121: `@@index` also accepts `expression:` (instead of a fields list), `where:` (partial-index predicate), `unique:`, `type:`/`options:` (target-registered access method), and `name:` xor `map:`:
122: 
123: ```prisma
124: @@index(expression: "lower(email)", name: "users_email_lower")
125: @@index([authorId], where: "(archived_at IS NULL)", name: "posts_author_active")
126: ```
127: 
128: `name:` declares a wire-named index (physical name `<name>_<8-hex hash>`, renames plan as `ALTER INDEX … RENAME`); `map:` adopts an exact physical name verbatim (for infer-captured objects — combining it with a SQL body warns, because drift detection byte-compares the authored text against Postgres's reprint). An `expression:` requires `name:` or `map:`. The TS builder mirrors this via `constraints.index([cols.x], {...})` / `constraints.index({ expression, ... })` — see `packages/2-sql/2-authoring/contract-ts/README.md`.
129: 
130: **Full-text search indexes (PostgreSQL).** Do not hand-write the `to_tsvector` expression — Postgres only uses the index when it is the same `to_tsvector` over the same configuration literal and the same column as the query. Declare `@@fullTextIndex`, which renders the same expression `fullTextMatches` / `fullTextRank` / `fullTextHeadline` lower to (see `references/queries-postgres.md`):
131: 
132: ```prisma
133: @@fullTextIndex([text], name: "message_text_search")
134: @@fullTextIndex([summary], language: "german", name: "message_summary_search_de")
135: @@fullTextIndex([text], where: "archived_at IS NULL", name: "message_text_search_live")
136: ```
137: 
138: The TS builder has the same helper: `fullTextIndex(cols.text, { name: 'message_text_search' })`, from `@prisma/orm-postgres/contract-builder`, inside the model's `sql({ indexes: [...] })`. It takes exactly one field, an optional `language` (default `english`, from the same allowlist the operations accept), an optional `where:` for a partial index, and `name:` xor `map:` like any expression index. It is repeatable, so a model may index several columns. Give the index and the operation the same `language` — a mismatch is silent, costing the index and falling back to a sequential scan. The parser that builds the query (`websearchToTsquery` and the others) takes its own `language` for the query side; it does not affect index use. It lowers to a GIN index over `to_tsvector('<language>', "<column>")` — the column name resolved through `@map` — so `@@index(expression: …)` remains only for expressions this attribute does not cover.
139: 
140: PSL alias surface for repeated types lives in a top-level `types {}` block:
141: 
142: ```prisma
143: types {
144:   Email = String
145: }
146: 
147: model User {
148:   id    Int    @id @default(autoincrement())
149:   email Email  @unique
150: }
151: ```
152: 
153: Note: scalar lists (e.g. `String[]`) are gated on the target's `sql.scalarList` capability — PostgreSQL declares it, so `tags String[]` lowers to an array column (with a generated no-NULL-elements check, see `@noCheck` under *Enums*); SQLite does not, and rejects the field with `PSL_SCALAR_LIST_UNSUPPORTED_TARGET`. Implicit Prisma-ORM many-to-many (list navigation on both sides without a join model) is rejected by the SQL interpreter — declare the join model explicitly and the ORM traverses it for you (`references/queries.md`). Composite/embeddable types (`type Address { ... }` with `address Address` on a model) are supported: the interpreter lowers them to `valueObjects` in the domain and stores them as `jsonb` columns. See *Workflow — Value objects* below.
154: 
155: ## Workflow — Edit a model / field / relation (TS builder)
156: 
157: The concept: same model, different authoring surface. The façade re-exports `defineContract`, `field`, `model`, `rel`, plus the `family`/`target` packs as default exports of `@internal/postgres/family` and `@internal/postgres/target`. Use the callback overload (`defineContract({...}, ({ field, model, rel, type }) => ({...}))`) to get the higher-level helpers (`field.text()`, `field.id.uuidv7String()`, `field.temporal.createdAt()`, `type.sql.String(35)`).
158: 
159: ```typescript
160: import sqlFamily from '@internal/postgres/family';
161: import { defineContract } from '@internal/postgres/contract-builder';
162: import postgresPack from '@internal/postgres/target';
163: 
164: export const contract = defineContract(
165:   {
166:     family: sqlFamily,
167:     target: postgresPack,
168:   },
169:   ({ field, model }) => ({
170:     models: {
171:       User: model('User', {
172:         fields: {
173:           id: field.id.uuidv7String(),
174:           email: field.text().unique(),
175:           createdAt: field.temporal.createdAt(),
176:         },
177:       }).sql({ table: 'app_user' }),
178:     },
179:   }),
180: );
181: ```
182: 
183: Then `pnpm prisma contract emit`. The `field.<scalar>()` helpers are only available inside the callback overload; outside the callback only `field.column(...)`, `field.generated(...)`, `field.namedType(...)` exist.
184: 
185: For Mongo, swap every `@internal/postgres/*` import for `@internal/mongo/*`. The Mongo builder also exposes `index` and `valueObject`.
186: 
187: Mongo scalar types, as PSL name / TS builder / application type: `String` / `field.string()` / `string`; `Int32` / `field.int32()` / `number`; `Int64` / `field.int64()` / `bigint`; `Double` / `field.double()` / `number`; `Decimal128` / `field.decimal128()` / decimal text as a `string`; `Bool` / `field.bool()` / `boolean`; `Date` / `field.date()` / `Date`; `ObjectId` / `field.objectId()` / `string`; `Binary` / `field.binary()` / `Uint8Array`; `Json` / `field.json()` / `JsonValue`; `Bson` / `field.bson()` / `BsonValue`. `Json` holds a JSON value only, validated as the JSON-representable BSON types; `Bson` holds any BSON value, unconstrained by the validator. The full table, with codec ids and storage types, is [Scalar types](https://github.com/prisma/orm/blob/main/docs/reference/scalar-types.md).
188: 
189: Mongo timestamps the ORM fills: in PSL, type the field `temporal.createdAt()` (set on create), `temporal.updatedAt()` (set on create and on every update with a non-empty payload), or `temporal.timestamp(onCreate: now, onUpdate: now)` with either option; in TS, use `field.temporal.createdAt()` and the rest inside the callback overload. They store a BSON date read back as `Date`, one value per ORM operation, and an explicit value in the write wins. The fields are optional on create. A preset field cannot be optional (`?`), a list, `@id`, or a field of a composite type.
190: 
191: ## Workflow — Add an extension-typed scalar (pgvector)
192: 
193: The concept: an extension contributes a namespace (`pgvector.*`) plus two descriptor flavours — a *control* descriptor for the config and a *pack* descriptor for the TS builder. Register the control descriptor in `ormConfig`'s `extensions` (array form). If you're authoring with the TS builder, also register the pack descriptor in `defineContract.extensions` (record form). Then reference the namespaced constructor from the contract.
194: 
195: `prisma.config.ts`:
196: 
197: ```typescript
198: import 'dotenv/config';
199: import { definePrismaConfig } from '@prisma/cli-engine';
200: import pgvector from '@internal/extension-pgvector/control';
201: import { defineConfig as ormConfig } from '@internal/postgres/config';
202: 
203: export default definePrismaConfig({
204:   orm: ormConfig({
205:     contract: './src/prisma/contract.prisma',
206:     extensions: [pgvector],
207:     db: { connection: process.env['DATABASE_URL']! },
208:   }),
209: });
210: ```
211: 
212: `src/prisma/contract.prisma`:
213: 
214: ```prisma
215: model Document {
216:   id        Int                          @id @default(autoincrement())
217:   content   String
218:   embedding pgvector.Vector(length: 1536)
219: }
220: ```
221: 
222: Emit. The named-type lowering puts `vector(1536)` on the column and the type map in `contract.d.ts` carries the right TS type.
223: 
224: If you reference `pgvector.*` without registering the descriptor in the config, emit fails with `CONFIG.MISSING_EXTENSION_PACKS` and `meta.missingExtensionPacks: ['pgvector']`. The envelope's `fix` text says *"Add the missing extension descriptors to `extensions` in prisma.config.ts"* — that field name matches `ormConfig`.
225: 
226: For canonical worked examples covering single and multi-extension setups, read `examples/prisma-8-demo/prisma.config.ts`, `examples/multi-extension-monorepo/app/prisma.config.ts` and `examples/prisma-8-postgis-demo/prisma.config.ts`.
227: 
228: ## Workflow — Polymorphism (`@@discriminator` / `@@base`)
229: 
230: The concept (SQL targets): one base model declares the discriminator field; each variant model declares its base + discriminator value. The variant chooses STI vs MTI by **whether it sets `@@map(...)`**: no `@@map` means the variant inherits the base's table (single-table inheritance); `@@map("variant_table")` means the variant gets its own table joined 1:1 by primary key (multi-table inheritance).
231: 
232: ```prisma
233: model Task {
234:   id    Int    @id @default(autoincrement())
235:   title String
236:   type  String
237: 
238:   @@discriminator(type)
239:   @@map("tasks")
240: }
241: 
242: // STI variant — shares the `tasks` table.
243: model Bug {
244:   severity String
245: 
246:   @@base(Task, "bug")
247: }
248: 
249: // MTI variant — joins to `tasks` via PK; carries its own `features` table.
250: model Feature {
251:   priority Int
252: 
253:   @@base(Task, "feature")
254:   @@map("features")
255: }
256: ```
257: 
258: Verify the polymorphism syntax against the interpreter tests if in doubt: `packages/2-sql/2-authoring/contract-psl/test/interpreter.polymorphism.test.ts`.
259: 
260: Mongo PSL takes the same `@@discriminator(field)` / `@@base(Base, "value")` attributes (the Mongo interpreter implements both; `examples/mongo-demo/src/contract.prisma` declares `Post` with `@@discriminator(kind)` and `Article` / `Tutorial` variants via `@@base(Post, "article")`). Variants share the base's collection — there is no `@@map` on a Mongo variant, since there is no second table to join. The TS builder's `discriminator` option on the model is the programmatic equivalent.
261: 
262: Querying the variants is a runtime concern — see `references/queries.md`.
263: 
264: ## Workflow — Value objects (composite types)
265: 
266: The concept: `type Foo { ... }` blocks declare value-object shapes. The interpreter lowers them to `valueObjects` in the contract domain and stores them as `jsonb` columns. Nested value-object references are supported.
267: 
268: ```prisma
269: type Address {
270:   street  String
271:   city    String
272:   zip     String?
273:   country String
274: }
275: 
276: model User {
277:   id      String   @id @default(uuid())
278:   email   String
279:   address Address?
280: }
281: ```
282: 
283: Emitted `contract.json` carries `domain.namespaces.<ns>.valueObjects.Address` with its field descriptors, and the `address` column lands as `codecId: "pg/jsonb@1"` / `nativeType: "jsonb"` in `storage`.
284: 
285: Canonical worked example: `examples/prisma-8-demo/src/prisma/contract.prisma`.
286: 
287: ## Workflow — Enums
288: 
289: The concept: PSL `enum` blocks declare a domain enum: a named value-set stored through a declared codec (`@@type("pg/text@1")` → a `text` column) and enforced by a planner-generated CHECK constraint. Each member maps to its database value with `Name = "value"`. Use the enum name as a field type on any model in the same contract.
290: 
291: ```prisma
292: enum user_type {
293:   @@type("pg/text@1")
294:   admin = "admin"
295:   user  = "user"
296: }
297: 
298: model User {
299:   id   String    @id @default(uuid())
300:   kind user_type
301: }
302: ```
303: 
304: **Waiving enforcement (`@noCheck`).** A field can decline the generated CHECK constraints for its column: bare `@noCheck` waives every kind the column's shape derives; `@noCheck(membership)` and `@noCheck(elementNotNull)` waive one kind (`membership` is the enum value-set check; `elementNotNull` is the no-NULL-elements check every list column gets). The TS authoring equivalent is `.noCheck(...)` on the field builder. Declared types do not change: the field still types as the enum union, and a list still types with non-null elements — once enforcement is waived, runtime values may diverge from what the types claim. That divergence is the author's accepted risk, and it is scoped to the kinds actually waived: waiving `membership` stops the database rejecting out-of-set values, waiving `elementNotNull` stops it rejecting NULL elements. A list that waives only `membership` still rejects NULL elements. `contract infer` emits `@noCheck(elementNotNull)` automatically for list columns whose source database does not carry the generated check.
305: 
306: Canonical worked example: `examples/prisma-8-demo/src/prisma/contract.prisma`.
307: 
308: ## Workflow — CHECK constraints (`@@check`)
309: 
310: The concept: `@@check` declares a hand-written CHECK constraint on a model — a rule you want the database to enforce, on top of whatever generated checks the model's enums and list columns already get (see *Workflow — Enums* above). Without it, a constraint you added by hand had no way into the contract, so it looked like an undeclared extra a destructive migration could drop.
311: 
312: ```prisma
313: model Order {
314:   id    Int     @id
315:   total Decimal
316: 
317:   // name: is a prefix — the physical constraint becomes order_total_positive_<8-hex hash>.
318:   @@check(expression: "total > 0", name: "order_total_positive")
319: }
320: ```
321: 
322: `expression` is the raw predicate — the text that goes inside `CHECK (...)` — and it is never parsed, so get it right; Prisma 8 does not validate SQL syntax. Exactly one of `name:` or `map:` is required, and they're mutually exclusive:
323: 
324: - **`name:`** — declaring a new rule. Prisma 8 picks the physical constraint name and future plans compare by that name, so Postgres's own reprint of your predicate (which rarely matches what you typed byte-for-byte) never causes false drift.
325: - **`map:`** — adopting a rule that already exists. Give the constraint's exact physical name and Prisma 8 compares the predicate byte-for-byte against what's live. This is the form `contract infer` writes for you (see *Workflow — Brownfield introspection* below) when it finds a hand-written check in the database. Every `map:` body warns at emit time (`PN_EXACT_NAME_BODY_COMPARISON`) — the warning fires on the text, not on who wrote it, so the check `contract infer` just wrote warns again on your next `contract emit` too. That is expected, not a defect: the comparison is still sound because both sides are Postgres's own reprint. Prefer `name:` for anything you're authoring fresh: your text and Postgres's reprint of it rarely match character-for-character, and a byte comparison reports that as drift even when both mean exactly the same thing. Reserve `map:` for adopting what's already there, where both sides are the database's own reprint and so do match.
326: 
327: A model can carry any number of `@@check` attributes. The TS builder mirrors this with `check({ expression, name })` / `check({ expression, map })` on a model's `.sql({ checks: [...] })`, next to `index()`.
328: 
329: Check constraints need the target's `checkConstraint` capability. Postgres has it; SQLite does not. `@@check` on a SQLite contract is rejected at authoring time; `check()` on a SQLite contract isn't caught until migration DDL is rendered, but either way you get a refusal, never a silently-dropped constraint.
330: 
331: ## Workflow — Namespaces (Postgres schemas)
332: 
333: The concept: wrap models in a `namespace <name> { ... }` block to place them in a non-default Postgres schema. Models outside any block go into the implicit default namespace.
334: 
335: ```prisma
336: namespace public {
337:   model Profile {
338:     id       String @id @default(uuid())
339:     username String
340:     userId   String @unique
341:     @@map("profile")
342:   }
343: }
344: ```
345: 
346: Canonical worked example: `examples/supabase/src/contract.prisma`.
347: 
348: ## Workflow — Cross-contract foreign keys
349: 
350: The concept: a relation field can reference a model in another contract space using the `<space>:<namespace>.<Model>` form. The contract also supports top-level named-type aliases in a `types {}` block, backed by the same bare type-position constructors used by fields. The `@db.X(args)` channel is removed: rewrite `@db.X` as `X` and `@db.X(args)` as `X(args)`; remaining uses fail with an actionable diagnostic naming the replacement.
351: 
352: ```prisma
353: types {
354:   AuthUserId = Uuid
355: }
356: 
357: namespace public {
358:   model Profile {
359:     id       String     @id @default(uuid())
360:     username String
361:     userId   AuthUserId @unique
362:     user     supabase:auth.AuthUser @relation(fields: [userId], references: [id], onDelete: Cascade)
363:     @@map("profile")
364:   }
365: }
366: ```
367: 
368: `supabase:auth.AuthUser` means: model `AuthUser` in namespace `auth` of contract space `supabase`. The target space is provided by a registered extension pack (here `@internal/extension-supabase/pack`).
369: 
370: Canonical worked example: `examples/supabase/src/contract.prisma`.
371: 
372: ## Workflow — `@@control` (control policy)
373: 
374: The concept: `@@control(<policy>)` on a model sets whether Prisma manages that table's DDL in migrations. The argument is a positional lowercase literal — one of `managed`, `tolerated`, `external`, or `observed`.
375: 
376: ```prisma
377: model AuditLog {
378:   id        Int    @id
379:   message   String
380: 
381:   @@control(observed)
382: }
383: ```
384: 
385: A contract-level default can be set via `defaultControlPolicy` on `prismaContract(path, { defaultControlPolicy })`. See `references/migrations.md` for how control policies affect DDL planning.
386: 
387: ## Workflow — `@internal/extension-supabase`
388: 
389: The concept: the Supabase extension provides the `supabase` contract space (the `auth` / `storage` schemas as `external` tables, plus the platform roles) and its own role-first runtime factory. Its descriptor is the `pack` export, and it goes into the same `extensions` array as any other extension. See `examples/supabase` for the full working pattern.
390: 
391: `prisma.config.ts` (mirrors `examples/supabase/prisma.config.ts`):
392: 
393: ```typescript
394: import { definePrismaConfig } from '@prisma/cli-engine';
395: import supabasePack from '@internal/extension-supabase/pack';
396: import { defineConfig as ormConfig } from '@internal/postgres/config';
397: 
398: export default definePrismaConfig({
399:   orm: ormConfig({
400:     contract: './src/contract.prisma',
401:     extensions: [supabasePack],
402:     migrations: { dir: 'migrations' },
403:   }),
404: });
405: ```
406: 
407: `db.ts` does **not** use the stock `postgres()` factory — a Supabase app builds its client with the `supabase()` factory from `@internal/extension-supabase/runtime` (role-first: `asUser(jwt)` / `asAnon()` / `asServiceRole()`, JWT validation, RLS). That runtime — and RLS policy authoring (`policy_select` / `@@rls`) — is covered by **`references/supabase.md`**; load it for anything past the config wiring.
408: 
409: Export subpaths: `@internal/extension-supabase/pack`, `@internal/extension-supabase/runtime`, `@internal/extension-supabase/contract`. Canonical worked example: `examples/supabase`.
410: 
411: ## Workflow — Brownfield introspection
412: 
413: The concept: pull a contract source out of an existing database and continue from there. `prisma contract infer --db <url>` reads the live schema and writes a `contract.prisma` file. It stops there — follow it with `contract emit` and (when the schema matches a pinned hash) `db sign` as separate steps.
414: 
415: ```bash
416: pnpm prisma contract infer --db $DATABASE_URL --output ./src/prisma/contract.prisma
417: pnpm prisma contract emit
418: ```
419: 
420: Infer captures indexes at full fidelity — expression, partial (`where:`), unique non-constraint, `type:`/`options:` — adopting each under `map:` with the live name, except that a name shaped like a wire name whose hash recomputes from the content re-detects as wire-named and emits `name:` with the prefix. RLS surfaces too: `@@rls` on RLS-enabled models, and every policy as a `policy_<operation>` block with `@@map("<live name>")`, verbatim predicate reprints, and `permissive = false` for RESTRICTIVE rows (a policy whose role name can't be spelled as a PSL identifier is skipped with a comment note). Replacing an adopted `map:` with the plain wire spelling later converges via a single rename migration.
421: 
422: ## Common Pitfalls
423: 
424: 1. **Forgetting to re-emit after an edit.** `contract.json` and `contract.d.ts` go stale; downstream typecheck and `migration plan` see the old shape. Re-emit, or install the Vite plugin (`references/build.md`).
425: 2. **Editing the emitted artefacts.** `contract.json` and `contract.d.ts` are emitted; edits there round-trip away on the next emit. Edit the source.
426: 3. **Wrong factory/import path for the TS builder.** `defineContract`, `field`, `model`, `rel` come from `@internal/postgres/contract-builder` (or `@internal/mongo/contract-builder`). Outside the callback overload, the available field constructors are `field.column(...)`, `field.generated(...)`, `field.namedType(...)`.
427: 4. **Reaching into internal packages from user code.** User-authored files (`prisma.config.ts`, `contract.ts`, `db.ts`, control clients) import only from `@internal/<target>/<subpath>` and `@internal/extension-<name>/<subpath>`. Imports from `@internal/cli/*`, `@internal/family-*`, `@internal/target-*`, `@internal/adapter-*`, `@internal/driver-*`, or `@internal/sql-contract-*` are framework-internal — the façade composes them for you. If a façade subpath you need is missing for your target, see *What Prisma 8 doesn't do yet* and route to `references/feedback.md`. The canonical worked examples are `examples/multi-extension-monorepo/app/prisma.config.ts` and `examples/prisma-8-postgis-demo/prisma.config.ts`.
428: 5. **Confusing the config `extensions` with the TS builder's `extensions`.** Same packs, two surfaces, one field name but two shapes: `ormConfig({ extensions: [pgvector] })` (array of *control* descriptors from `@internal/extension-<name>/control`) versus `defineContract({ extensions: { pgvector } })` (record of *pack* descriptors from `@internal/extension-<name>/pack`).
429: 6. **Writing a flat `prisma.config.ts`.** `export default defineConfig({ contract, extensions })` from the target config alone is the pre-rc.4 shape and fails with `CONFIG.VERSION_MARKER_MISSING`. Wrap it: `definePrismaConfig({ orm: ormConfig({...}) })`.
430: 7. **Renaming a field and expecting the planner to detect it.** Prisma 8 has no in-contract rename hint; the planner sees a destructive drop+add. Hand-edit `migration.ts` after `migration plan` (see `references/migrations.md`), or use the keep-then-drop two-migration pattern.
431: 
432: ## What Prisma 8 doesn't do yet
433: 
434: - **In-contract rename hint.** No `@@rename(old: ..., new: ...)` or similar. Use the workarounds in *Common Pitfalls* #7. To request first-class rename, file via `references/feedback.md`.
435: - **Model validations.** No declarative `@validates(...)` surface. Validate in application code (arktype). To request declarative validations in the contract, file via `references/feedback.md`.
436: - **Lifecycle callbacks** (`beforeSave`, `afterCreate`, etc.). Not supported. Use middleware (`references/runtime.md`) or app code. To request lifecycle callbacks, file via `references/feedback.md`.
437: - **Soft delete / `paranoid: true`.** No built-in soft-delete column. Add a nullable `deletedAt DateTime?` and filter explicitly in queries (or in middleware). To request built-in soft delete, file via `references/feedback.md`.
438: - **Scopes / default filters.** No ActiveRecord-style scopes. Compose query helpers yourself. To request scopes, file via `references/feedback.md`.
439: - **Implicit Prisma-ORM many-to-many.** List navigation on both sides without an explicit join model is rejected. Author the join model explicitly. To request implicit M2M, file via `references/feedback.md`.
440: 
441: ## Reference
442: 
443: - Run `pnpm prisma contract --help` for the live command surface.
444: - PSL feature surface and what the interpreter accepts: `packages/2-sql/2-authoring/contract-psl/README.md`.
445: - TS builder surface and the callback-helper vocabulary: `packages/2-sql/2-authoring/contract-ts/README.md`.
446: - Layouts (where `contract.prisma`, `contract.json`, `contract.d.ts`, and `migrations/` live):
447:   - **App layout** (`src/prisma/...` + `migrations/app/...`) — what `examples/prisma-8-demo` demonstrates; the canonical shape consuming applications use.
448:   - **Contract-space-package layout** (`src/contract.{prisma,ts}` directly, `migrations/<timestamp>_<slug>/` without a space-id segment) — for extensions and aggregate-root packages, documented in `.cursor/rules/contract-space-package-layout.mdc` and ADR 212.
449: 
450: ## Checklist
451: 
452: - [ ] Read `prisma.config.ts` and identified the contract source (path string ending in `.prisma` or `.ts`) and the installed `extensions: [...]`.
453: - [ ] All user-authored imports resolve to `@internal/<target>/<subpath>` (e.g. `@internal/postgres/config`) or `@internal/extension-<name>/<subpath>`. No imports from `@internal/cli/*`, `@internal/family-*`, `@internal/target-*`, `@internal/adapter-*`, `@internal/driver-*`, or `@internal/sql-contract-*` in user files.
454: - [ ] Edited the contract source (`contract.prisma` or `contract.ts`), not an emitted artefact.
455: - [ ] For new extension namespaces: added the package, imported its control descriptor (`@internal/extension-<name>/control`), added it to `extensions: [...]` in `ormConfig({...})` (and the matching pack descriptor to `defineContract({extensions: {...}})` if using the TS builder).
456: - [ ] `prisma.config.ts` is the envelope form — `definePrismaConfig({ orm: ormConfig({...}) })` — not a flat `defineConfig({...})`.
457: - [ ] For renames: hand-edited `migration.ts` after `migration plan` (or used the keep-then-drop two-migration pattern) — Prisma 8 has no rename hint today.
458: - [ ] Ran `pnpm prisma contract emit` after the edit (or let the Vite plugin re-emit on save).
459: - [ ] Confirmed `contract.json` and `contract.d.ts` updated next to the source.
460: - [ ] Did **not** hand-edit `contract.json` / `contract.d.ts`.
461: - [ ] Did **not** confabulate a missing feature (validations, callbacks, soft delete, scopes, in-contract rename hint) — referred the user to *What Prisma 8 doesn't do yet* + `references/feedback.md`.

(End of file - total 461 lines)
</content>
```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

Now let's understand the errors:

1. `PSL_INVALID_MODEL_MEMBER: Expected a type after field "temporal"` — `updatedAt DateTime temporal.updatedAt()` — this is Mongo syntax per line 189: "in PSL, type the field `temporal.createdAt()`". Hmm, wait — line 189 is about Mongo. For SQL/Postgres, what's the updatedAt syntax? The error says "Expected a type after field temporal" — meaning `temporal.updatedAt()` isn't valid as a type in SQL PSL. So the SQL PSL probably uses `@updatedAt` attribute (classic Prisma).

Actually the error `PSL_UNSUPPORTED_FIELD_TYPE: Field "Tenant.temporal" type "" is not supported in SQL PSL provider v1` suggests the parser read `temporal` as a field name. So for SQL PSL, updatedAt is `@updatedAt`.

2. `PSL_INVALID_ATTRIBUTE_ARGUMENT: Field "Payment.amount" constructor "Decimal" accepts at most 0 argument(s), received 2.` — so `Decimal(12, 2)` isn't valid; SQL PSL in Prisma 8 dropped `@db.Decimal(p,s)`? Actually per contract.md line 350: "The `@db.X(args)` channel is removed: rewrite `@db.X` as `X` and `@db.X(args)` as `X(args)`". So `Decimal(12,2)` → `Decimal` with0 args. So precision args are not supported → use plain `Decimal`.

Hmm, but is `Decimal(12,2)` in SQL PSL v1 unsupported? The error says the constructor accepts at most 0 args. So just `Decimal`.

Let me check the reference docs for scalar types in SQL PSL. Let's look at quickstart.md and any example contract.prisma to see `updatedAt` syntax.

Let me check the installed package examples. Is there an examples dir? Probably not in node_modules. Let's grep the skill references for "@updatedAt".

</details>

#### 🔧 Tool: grep
**Status:** completed
**Title:** @updatedAt|@default\(updatedAt|updatedAt

**Input:**
```json
{
  "path": "/home/craxker/github/nexus-thrive/.claude/skills/prisma-8",
  "pattern": "@updatedAt|@default\\(updatedAt|updatedAt"
}
```

**Output:**
```
Found 12 matches
/home/craxker/github/nexus-thrive/.claude/skills/prisma-8/upgrading/app/upgrades/8.0.0-rc.8-to-8.0.0-rc.9/instructions.md:
  Line 30:       MongoDB Prisma schema files must not carry `@default(...)`, `@updatedAt`, or `@db.*` attributes; the Mongo interpreter never lowered them and now rejects them.

  Line 34:         - '@(?:default\(|updatedAt\b|db\.)'

  Line 63: For every matched MongoDB schema, delete each `@default(...)`, `@updatedAt`, and `@db.<Type>` attribute from the field that carries it, leaving the field's type and its other attributes in place. For example, change `status ProductStatus @default(Active)` to `status ProductStatus` and `updatedAt DateTime @updatedAt` to `updatedAt DateTime`. The Mongo interpreter never lowered these attributes into the contract, so the emitted `contract.json` does not change; defaults and timestamps stay the responsibility of application code, as they already were. `prisma contract emit` now fails with `PSL_UNSUPPORTED_FIELD_ATTRIBUTE` while any of them remain.


/home/craxker/github/nexus-thrive/.claude/skills/prisma-8/upgrading/extension/upgrades/8.0.0-rc.12-to-8.0.0-rc.13/instructions.md:
  Line 178: A contract with generated defaults (`temporal.createdAt()`, `temporal.updatedAt()`, `@default(uuid())` and the like) carries them under `execution.mutations.defaults`. Each entry's `ref` changes keys; the values do not:

  Line 456: Mongo contracts can now carry execution defaults (`temporal.createdAt()`, `temporal.updatedAt()`), and the execution context applies them. The ORM calls `context.applyMutationDefaults(...)` on every create and update, so `MongoExecutionContext` has a new required method.


/home/craxker/github/nexus-thrive/.claude/skills/prisma-8/upgrading/app/upgrades/8.0.0-rc.13-to-8.0.0-rc.14/instructions.md:
  Line 116:       When `create` sets a field that has an update default (`@updatedAt`,

  Line 117:       `temporal.updatedAt()`, `temporal.timestamp(onUpdate: now)`), `upsert()` now inserts the

  Line 136:         - '\btemporal\.(?:createdAt|updatedAt|timestamp)\([^)]*\)\s*\.(?:optional|many)\('


/home/craxker/github/nexus-thrive/.claude/skills/prisma-8/upgrading/app/upgrades/8.0.0-rc.12-to-8.0.0-rc.13/instructions.md:
  Line 113: A contract with generated defaults (`temporal.createdAt()`, `temporal.updatedAt()`, `@default(uuid())` and the like) carries them under `execution.mutations.defaults`. Each entry's `ref` changes keys; the values do not:


/home/craxker/github/nexus-thrive/.claude/skills/prisma-8/upgrading/app/upgrades/8.0.0-rc.5-to-8.0.0-rc.6/instructions.md:
  Line 44:          table carrying `temporal.updatedAt()`, whose generated value is a `Temporal.Instant`.


/home/craxker/github/nexus-thrive/.claude/skills/prisma-8/references/contract.md:
  Line 189: Mongo timestamps the ORM fills: in PSL, type the field `temporal.createdAt()` (set on create), `temporal.updatedAt()` (set on create and on every update with a non-empty payload), or `temporal.timestamp(onCreate: now, onUpdate: now)` with either option; in TS, use `field.temporal.createdAt()` and the rest inside the callback overload. They store a BSON date read back as `Date`, one value per ORM operation, and an explicit value in the write wins. The fields are optional on create. A preset field cannot be optional (`?`), a list, `@id`, or a field of a composite type.


/home/craxker/github/nexus-thrive/.claude/skills/prisma-8/references/debug.md:
  Line 108: | `RUNTIME.TEMPORAL_UNAVAILABLE` | Runtime, first read or write touching a Temporal-backed column (`Date`, `Timestamp(p)`, `Timestamptz(p)`, `Time(p)`) or a `temporal.updatedAt()` clock | No global `Temporal`. Node.js 26.8.2 and later ship `globalThis.Temporal`; 26.8.1 and earlier — including every 22 and 24 — do not. Either `import 'temporal-polyfill/full/global'` before the first query, or author the column as `DateString` / `TimestampString(p)` / `TimestamptzString(p)` / `TimeString(p)` to read PostgreSQL's own text. |

```

#### 🔧 Tool: grep
**Status:** completed
**Title:** Decimal\(|numeric|@db\.

**Input:**
```json
{
  "path": "/home/craxker/github/nexus-thrive/.claude/skills/prisma-8/references",
  "pattern": "Decimal\\(|numeric|@db\\."
}
```

**Output:**
```
Found 9 matches
/home/craxker/github/nexus-thrive/.claude/skills/prisma-8/references/supabase.md:
  Line 93: The `Uuid` constructor selects native UUID storage in type position. The legacy `@db.Uuid` spelling is removed; rewrite any `String @db.Uuid` alias or field as `Uuid` before emitting.


/home/craxker/github/nexus-thrive/.claude/skills/prisma-8/references/queries-postgres.md:
  Line 223: **Reduce a to-many relation to a scalar.** A refinement callback may return a *reducer* — `count()`, `sum(field)`, `avg(field)`, `min(field)`, `max(field)`, plus the lossless `countBigInt()`, `sumBigInt(field)`, and `avgDecimal(field)` — instead of a collection. The parent's relation field then carries that one value rather than an array. Reducers exist only inside an `include(...)` callback; calling one elsewhere throws.

  Line 310: `aggregate` exposes `.count()`, `.sum(field)`, `.avg(field)`, `.min(field)`, `.max(field)`, and the lossless `.countBigInt()`, `.sumBigInt(field)`, `.avgDecimal(field)`. Project the aggregates into named result keys; the result type narrows accordingly.

  Line 321: | `sum(field)` over `numeric` | decimal `string \| null` | `null` |

  Line 324: | `avgDecimal(field)` over any integer or `numeric` | decimal `string \| null` | `null` |

  Line 328: **`count()`, and `sum` over an integer column, throw outside ±(2^53 − 1) — they never round.** Those two are the results a guarded integer codec produces. The rows above the guard does not reach: `sum` over `numeric`, `UnboundedInt`, or a float column, and every `avg`, which is a fraction already. The error is `RUNTIME.DECODE_FAILED` (`… value must be an integer within the safe integer range, got …`), and it fires on the include path too. That is the trade the defaults make: a `number` you can compare, serialise, and do arithmetic with, and a loud failure instead of a quietly wrong total. Switch that one call to `sumBigInt` / `countBigInt` where the magnitude is real.

  Line 330: **Float and Decimal columns keep their own family.** `sum` over `numeric` is still a decimal string, and `sum` over `float8` still a `number` — the defaults policy is about integers, and a column whose author chose `numeric` already chose its representation.


/home/craxker/github/nexus-thrive/.claude/skills/prisma-8/references/debug.md:
  Line 12: - User mentions a stable code (`CONFIG.*`, `CLI.*`, `CONTRACT.*`, `MIGRATION.*`, `ORM.*`, `RUNTIME.*`, `DRIVER.*`, `LINT.*`, `BUDGET.*`, `PLAN.*`). A `PN-CLI-4001`-style numeric code is from a pre-0.17 release; the crosswalk to the dotted name is in ADR 239 and `docs/reference/error-reference.md`.


/home/craxker/github/nexus-thrive/.claude/skills/prisma-8/references/contract.md:
  Line 350: The concept: a relation field can reference a model in another contract space using the `<space>:<namespace>.<Model>` form. The contract also supports top-level named-type aliases in a `types {}` block, backed by the same bare type-position constructors used by fields. The `@db.X(args)` channel is removed: rewrite `@db.X` as `X` and `@db.X(args)` as `X(args)`; remaining uses fail with an actionable diagnostic naming the replacement.

```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

So for SQL PSL: `@updatedAt` is presumably still valid (upgrade instructions say Mongo must not carry `@default(...)`, `@updatedAt`, or `@db.*` — implying SQL still does).

Wait, but the error said `PSL_INVALID_MODEL_MEMBER: Expected a type after field "temporal"`. The current line is `updatedAt DateTime temporal.updatedAt()`. Right — `temporal.updatedAt()` is a *type-position* constructor for Mongo... Actually for Mongo, "type the field `temporal.updatedAt()`" — hmm, in Mongo PSL you write `updatedAt temporal.updatedAt()` (replacing `DateTime` type entirely). For SQL, the equivalent is `DateTime @default(now()) @updatedAt`.

Let me check whether SQL PSL supports `@updatedAt`. Let's find the actual PSL interpreter in node_modules to confirm. Let's grep for "updatedAt" in node_modules prisma packages.

Actually better: check the contract-psl package docs or test files if shipped. Let's look at node_modules for prisma packages.

</details>

#### 🔧 Tool: bash
**Status:** completed
**Title:** rtk ls node_modules/.pnpm | rg -i "contract-psl|prisma" | head -50

**Input:**
```json
{
  "command": "rtk ls node_modules/.pnpm | rg -i \"contract-psl|prisma\" | head -50"
}
```

**Output:**
```
@distilled.cloud+prisma@1.0.0-rc.12_effect@4.0.0-rc.115/
@mrleebo+prisma-ast@0.13.1/
@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@1.80.0_magicast@0.5.5/
@prisma+client-runtime-utils@7.10.0/
@prisma+client@7.10.0_typescript@5.9.3/
@prisma+composer-cli@0.26.0_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@1.80.0__9b97a2400035eb3265067fe19eb46a43/
@prisma+composer-cli@0.26.0_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@1.80.0__cc66071030d2310c7038d92d373403ab/
@prisma+composer@0.26.0_@types+node@20.19.43_@types+react@19.3.0_@vercel+nft@1.11.0_sup_3adda6d6ac431d945d96ea1913cfa3ac/
@prisma+composer@0.26.0_@types+node@20.19.43_@types+react@19.3.0_@vercel+nft@1.11.0_sup_69ba10db0e0131c29623335bede34b11/
@prisma+compute-sdk@0.43.0_@prisma+management-api-sdk@1.80.0_supports-color@7.2.0/
@prisma+debug@7.2.0/
@prisma+dev@0.20.0_typescript@5.9.3/
@prisma+get-platform@7.2.0/
@prisma+management-api-sdk@1.80.0/
@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/
@prisma+orm-framework@8.0.0-rc.14_typescript@5.9.3/
@prisma+orm-postgres@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@1._a89fbbb244cb137b3a78b10e900fa864/
@prisma+orm-target-postgres@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api_a0d150f910b4231f91635333d934767d/
@prisma+orm-toolchain@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@1_c9d738a1592ec0cb62ee0be9b1ec57eb/
@prisma+query-plan-executor@7.2.0/
prisma@8.0.0-rc.20_@types+node@20.19.43_@types+react@19.3.0_@vercel+nft@1.11.0_supports_23c78adf2160ad88627531cb0813d72c/
prisma@8.0.0-rc.20_@types+node@20.19.43_@types+react@19.3.0_@vercel+nft@1.11.0_supports_418f6889106002edea343a78ddd96c3d/

```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

Let's search for PSL diagnostics strings in node_modules to understand supported attributes for SQL PSL. Search for "PSL_INVALID_MODEL_MEMBER" and "updatedAt" in the orm packages.

Actually simpler: search the framework for how SQL PSL handles `@updatedAt`.

</details>

#### 🔧 Tool: bash
**Status:** completed
**Title:** rtk rg -l "updatedAt" node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14*/node_modules/@prisma/orm-family-sql/ 2>/dev/null | head -20

**Input:**
```json
{
  "command": "rtk rg -l \"updatedAt\" node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14*/node_modules/@prisma/orm-family-sql/ 2>/dev/null | head -20"
}
```

**Output:**
```
node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/runtime-Z3nD7ix1.mjs
node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/runtime-Z3nD7ix1.mjs.map
node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/interpreter-IKKTyZNv-D12J5Dcx.mjs.map
node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/interpreter-IKKTyZNv-D12J5Dcx.mjs
node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/contract-prisma7__provider.mjs
node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/verify-BVk5bjdH-BXgGLM2U.mjs
node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/control-DOGYQMFH.mjs.map
node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/contract-prisma7__provider.mjs.map
node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/control-kbS8DWF0.d.mts
node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/contract-prisma7__provider.d.mts
node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/verify-BVk5bjdH-BXgGLM2U.mjs.map
node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/runtime-DgOeosYa.d.mts
node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/control-DOGYQMFH.mjs

```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

Let's grep the interpreter for attribute names supported in SQL PSL, e.g. "updatedAt" occurrences in interpreter file.

</details>

#### 🔧 Tool: bash
**Status:** completed
**Title:** rtk rg -o "\"updatedAt\"|'updatedAt'|@updatedAt" "node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/interpreter-IKKTyZNv-D12J5Dcx.mjs" | sort | uniq -c

**Input:**
```json
{
  "command": "rtk rg -o \"\\\"updatedAt\\\"|'updatedAt'|@updatedAt\" \"node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/interpreter-IKKTyZNv-D12J5Dcx.mjs\" | sort | uniq -c"
}
```

**Output:**
```
      2 "updatedAt"

```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

Let's see the context around "updatedAt" in that file.

</details>

#### 🔧 Tool: bash
**Status:** completed
**Title:** rtk rg -o ".{300}\"updatedAt\".{300}" "node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/interpreter-IKKTyZNv-D12J5Dcx.mjs"

**Input:**
```json
{
  "command": "rtk rg -o \".{300}\\\"updatedAt\\\".{300}\" \"node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/interpreter-IKKTyZNv-D12J5Dcx.mjs\""
}
```

**Output:**
```
(no output)
```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

The file might be huge single-line; rg -o with .{300} might not match across... it should. Maybe the match spans. Let's use python.

</details>

#### 🔧 Tool: bash
**Status:** completed
**Title:** rtk python3 -c "
import re
p='node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/interpreter-IKKTyZNv-D12J5Dcx.mjs'
s=open(p,encoding='utf8',errors='replace').read()
print(len(s))
for m in re.finditer('updatedAt',s):
    print('---')
    print(s[m.start()-400:m.end()+400])
"

**Input:**
```json
{
  "command": "rtk python3 -c \"\nimport re\np='node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/interpreter-IKKTyZNv-D12J5Dcx.mjs'\ns=open(p,encoding='utf8',errors='replace').read()\nprint(len(s))\nfor m in re.finditer('updatedAt',s):\n    print('---')\n    print(s[m.start()-400:m.end()+400])\n\""
}
```

**Output:**
```
140313
---
ry.`,
				...source.at(value.span)
			});
			return {};
		}
		if (generatorDescriptor.applicableCodecIds === void 0) {
			input.diagnostics.push({
				code: "PSL_INVALID_DEFAULT_APPLICABILITY",
				message: `Default generator "${generatorDescriptor.id}" is not applicable to "@default(...)" lowering. Use the corresponding field preset (e.g. \`temporal.${generatorDescriptor.id === "timestampNow" ? "updatedAt" : generatorDescriptor.id}()\`) instead.`,
				...source.at(value.span)
			});
			return {};
		}
		if (!generatorDescriptor.applicableCodecIds.includes(input.columnDescriptor.codecId)) {
			input.diagnostics.push({
				code: "PSL_INVALID_DEFAULT_APPLICABILITY",
				message: `Default generator "${generatorDescriptor.id}" is not applicable to "${input.modelName}.${input.fieldName}" with codecId "${
---
onst match = enumHandle.enumMembers.find((m) => m.name === member);
	if (!match) return {};
	return { defaultValue: {
		kind: "literal",
		value: blindCast(match.value)
	} };
}
const MODEL_COORDINATE_SEPARATOR = "\0";
function modelCoordinateKey(namespaceId, modelName) {
	return `${namespaceId}${MODEL_COORDINATE_SEPARATOR}${modelName}`;
}
const REMOVED_ATTRIBUTE_RULES = /* @__PURE__ */ new Map([["updatedAt", {
	hint: "Use `temporal.updatedAt()` as a field-preset call instead.",
	suppressWhen: (field) => field.typeConstructor?.path[0] === "temporal"
}]]);
{
	const overlap = [...REMOVED_ATTRIBUTE_RULES.keys()].filter((name) => Object.hasOwn(sqlAttributeSpecs.field, name));
	if (overlap.length > 0) throw new InternalError(`Registered SQL field attributes and REMOVED_ATTRIBUTE_RULES must not overlap. N
---
find((m) => m.name === member);
	if (!match) return {};
	return { defaultValue: {
		kind: "literal",
		value: blindCast(match.value)
	} };
}
const MODEL_COORDINATE_SEPARATOR = "\0";
function modelCoordinateKey(namespaceId, modelName) {
	return `${namespaceId}${MODEL_COORDINATE_SEPARATOR}${modelName}`;
}
const REMOVED_ATTRIBUTE_RULES = /* @__PURE__ */ new Map([["updatedAt", {
	hint: "Use `temporal.updatedAt()` as a field-preset call instead.",
	suppressWhen: (field) => field.typeConstructor?.path[0] === "temporal"
}]]);
{
	const overlap = [...REMOVED_ATTRIBUTE_RULES.keys()].filter((name) => Object.hasOwn(sqlAttributeSpecs.field, name));
	if (overlap.length > 0) throw new InternalError(`Registered SQL field attributes and REMOVED_ATTRIBUTE_RULES must not overlap. Names in both: ${overlap.join(", ")}`

```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

So `@updatedAt` is REMOVED in SQL PSL, and the hint is "Use `temporal.updatedAt()` as a field-preset call instead."

But our error is `PSL_INVALID_MODEL_MEMBER: Expected a type after field "temporal"`. Hmm — that suggests the parser parsed `updatedAt DateTime temporal.updatedAt()` as: field name `updatedAt`, type `DateTime`, then `temporal` as... a new field name, then expected a type after `temporal` and found `.`.

Wait: `updatedAt DateTime temporal.updatedAt()` → field `updatedAt` type `DateTime`; then next token `temporal` starts a new field, then `.` → error "Expected a type after field temporal".

So correct form is: `updatedAt temporal.updatedAt()` — i.e. the field-preset call REPLACES the type. Similar to Mongo: "type the field `temporal.createdAt()`".

So the SQL PSL field preset: `updatedAt temporal.updatedAt()`. Let's confirm by finding field preset registration for SQL — look for "temporal" path presets in the SQL interpreter / target-postgres.

Also for createdAt: `createdAt temporal.createdAt()` presumably. Currently it's `DateTime @default(now())`. Does `@default(now())` still work in SQL? The message above: "Default generator ... not applicable ... Use the corresponding field preset (e.g. `temporal.updatedAt()`)". So `@default(now())` may still be applicable if generatorDescriptor.applicableCodecIds includes the codec. Let's check what `now` generator applies to. Search for "timestampNow" / "now" in target-postgres.

Let's look at presets: search for "temporal." in SQL interpreter.

</details>

#### 🔧 Tool: bash
**Status:** completed
**Title:** rtk python3 -c "
import re,glob
p='node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/interpreter-IKKTyZNv-D12J5Dcx.mjs'
s=open(p,encoding='utf8',errors='replace').read()
for m in re.finditer('fieldPreset|field preset|presets',s):
    print('---',m.group())
    print(s[max(0,m.start()-300):m.end()+500])
" | head -120

**Input:**
```json
{
  "command": "rtk python3 -c \"\nimport re,glob\np='node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/interpreter-IKKTyZNv-D12J5Dcx.mjs'\ns=open(p,encoding='utf8',errors='replace').read()\nfor m in re.finditer('fieldPreset|field preset|presets',s):\n    print('---',m.group())\n    print(s[max(0,m.start()-300):m.end()+500])\n\" | head -120"
}
```

**Output:**
```
--- field preset
value.span)
			});
			return {};
		}
		if (generatorDescriptor.applicableCodecIds === void 0) {
			input.diagnostics.push({
				code: "PSL_INVALID_DEFAULT_APPLICABILITY",
				message: `Default generator "${generatorDescriptor.id}" is not applicable to "@default(...)" lowering. Use the corresponding field preset (e.g. \`temporal.${generatorDescriptor.id === "timestampNow" ? "updatedAt" : generatorDescriptor.id}()\`) instead.`,
				...source.at(value.span)
			});
			return {};
		}
		if (!generatorDescriptor.applicableCodecIds.includes(input.columnDescriptor.codecId)) {
			input.diagnostics.push({
				code: "PSL_INVALID_DEFAULT_APPLICABILITY",
				message: `Default generator "${generatorDescriptor.id}" is not applicable to "${input.modelName}.${input.fieldName}" with codecId "${input.columnDescriptor.cod

```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

The field presets for SQL are probably defined in the target package (@prisma/orm-target-postgres) or family. Let's search for "temporal.updatedAt" strings across packages.

</details>

#### 🔧 Tool: bash
**Status:** completed
**Title:** rtk rg -o --no-filename ".{200}temporal\.updatedAt.{200}" node_modules/.pnpm/@prisma+orm-target-postgres@8.0.0-rc.14*/node_modules/@prisma/orm-target-postgres/dist/*.mjs node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14*/node_modules/@prisma/orm-family-sql/dist/*.mjs 2>/dev/null | head -20

**Input:**
```json
{
  "command": "rtk rg -o --no-filename \".{200}temporal\\.updatedAt.{200}\" node_modules/.pnpm/@prisma+orm-target-postgres@8.0.0-rc.14*/node_modules/@prisma/orm-target-postgres/dist/*.mjs node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14*/node_modules/@prisma/orm-family-sql/dist/*.mjs 2>/dev/null | head -20"
}
```

**Output:**
```
(no output)
```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

Let's search for "fieldPresets" or "updatedAt" in target-postgres.

</details>

#### 🔧 Tool: bash
**Status:** completed
**Title:** rtk rg -c "updatedAt" node_modules/.pnpm/@prisma+orm-target-postgres@8.0.0-rc.14*/node_modules/@prisma/orm-target-postgres/dist/*.mjs node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14*/node_modules/@prisma/orm-family-sql/dist/*.mjs 2>/dev/null

**Input:**
```json
{
  "command": "rtk rg -c \"updatedAt\" node_modules/.pnpm/@prisma+orm-target-postgres@8.0.0-rc.14*/node_modules/@prisma/orm-target-postgres/dist/*.mjs node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14*/node_modules/@prisma/orm-family-sql/dist/*.mjs 2>/dev/null"
}
```

**Output:**
```
node_modules/.pnpm/@prisma+orm-target-postgres@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api_a0d150f910b4231f91635333d934767d/node_modules/@prisma/orm-target-postgres/dist/authoring-BmQxOggr-CK871YR4.mjs:2
node_modules/.pnpm/@prisma+orm-target-postgres@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api_a0d150f910b4231f91635333d934767d/node_modules/@prisma/orm-target-postgres/dist/errors-DYyzTYzE-39CV_aMo.mjs:1
node_modules/.pnpm/@prisma+orm-target-postgres@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api_a0d150f910b4231f91635333d934767d/node_modules/@prisma/orm-target-postgres/dist/prisma7-binding-BXzUH7xo.mjs:1
node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/contract-prisma7__provider.mjs:14
node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/interpreter-IKKTyZNv-D12J5Dcx.mjs:3
node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/verify-BVk5bjdH-BXgGLM2U.mjs:2
node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/control-DOGYQMFH.mjs:1
node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/runtime-Z3nD7ix1.mjs:1

```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

Let's look at authoring-BmQxOggr in target-postgres for the field presets (temporal.updatedAt) definitions.

</details>

#### 🔧 Tool: bash
**Status:** completed
**Title:** rtk python3 -c "
import re
p='node_modules/.pnpm/@prisma+orm-target-postgres@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api_a0d150f910b4231f91635333d934767d/node_modules/@prisma/orm-target-postgres/dist/authoring-BmQxOggr-CK871YR4.mjs'
s=open(p,encoding='utf8',errors='replace').read()
for m in re.finditer('updatedAt',s):
    print('---')
    print(s[max(0,m.start()-500):m.end()+500])
"

**Input:**
```json
{
  "command": "rtk python3 -c \"\nimport re\np='node_modules/.pnpm/@prisma+orm-target-postgres@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api_a0d150f910b4231f91635333d934767d/node_modules/@prisma/orm-target-postgres/dist/authoring-BmQxOggr-CK871YR4.mjs'\ns=open(p,encoding='utf8',errors='replace').read()\nfor m in re.finditer('updatedAt',s):\n    print('---')\n    print(s[max(0,m.start()-500):m.end()+500])\n\""
}
```

**Output:**
```
---
1",
			nativeType: "jsonb"
		}
	},
	bytes: {
		kind: "fieldPreset",
		output: {
			codecId: "pg/bytea@1",
			nativeType: "bytea"
		}
	},
	dateTime: {
		kind: "fieldPreset",
		output: {
			codecId: "pg/timestamptz-temporal@1",
			nativeType: "timestamptz"
		}
	},
	temporal: {
		createdAtJsDate: (/* @__PURE__ */ temporalAuthoringPresets({
			codecId: PG_TIMESTAMPTZ_DATE_CODEC_ID,
			nativeType: "timestamptz",
			generatorId: postgresNowGeneratorIds[PG_TIMESTAMPTZ_DATE_CODEC_ID]
		})).createdAt,
		updatedAtJsDate: (/* @__PURE__ */ temporalAuthoringPresets({
			codecId: PG_TIMESTAMPTZ_DATE_CODEC_ID,
			nativeType: "timestamptz",
			generatorId: postgresNowGeneratorIds[PG_TIMESTAMPTZ_DATE_CODEC_ID]
		})).updatedAt,
		timestamptzJsDate: /* @__PURE__ */ temporalCodecPresetWithPrecision({
			codecId: PG_TIMESTAMPTZ_DATE_CODEC_ID,
			nativeType: "timestamptz",
			generatorId: postgresNowGeneratorIds[PG_TIMESTAMPTZ_DATE_CODEC_ID]
		}),
		.../* @__PURE__ */ temporalAuthoringPresets({
			codecId: PG_TIMEST
---
ptz-temporal@1",
			nativeType: "timestamptz"
		}
	},
	temporal: {
		createdAtJsDate: (/* @__PURE__ */ temporalAuthoringPresets({
			codecId: PG_TIMESTAMPTZ_DATE_CODEC_ID,
			nativeType: "timestamptz",
			generatorId: postgresNowGeneratorIds[PG_TIMESTAMPTZ_DATE_CODEC_ID]
		})).createdAt,
		updatedAtJsDate: (/* @__PURE__ */ temporalAuthoringPresets({
			codecId: PG_TIMESTAMPTZ_DATE_CODEC_ID,
			nativeType: "timestamptz",
			generatorId: postgresNowGeneratorIds[PG_TIMESTAMPTZ_DATE_CODEC_ID]
		})).updatedAt,
		timestamptzJsDate: /* @__PURE__ */ temporalCodecPresetWithPrecision({
			codecId: PG_TIMESTAMPTZ_DATE_CODEC_ID,
			nativeType: "timestamptz",
			generatorId: postgresNowGeneratorIds[PG_TIMESTAMPTZ_DATE_CODEC_ID]
		}),
		.../* @__PURE__ */ temporalAuthoringPresets({
			codecId: PG_TIMESTAMPTZ_TEMPORAL_CODEC_ID,
			nativeType: "timestamptz",
			generatorId: postgresNowGeneratorIds[PG_TIMESTAMPTZ_TEMPORAL_CODEC_ID]
		}),
		.../* @__PURE__ */ temporalStringAuthoringPresets({
			codecId: PG_TIMES

```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

Let's see `temporalAuthoringPresets` output keys — createdAt, updatedAt, timestamp? Let's find its definition.

</details>

#### 🔧 Tool: bash
**Status:** completed
**Title:** rtk rg -o --no-filename "function temporalAuthoringPresets.{1200}" node_modules/.pnpm/@prisma+orm-target-postgres@8.0.0-rc.14*/node_modules/@prisma/orm-target-postgres/dist/*.mjs | head -5; rtk rg -o --no-filename "temporalAuthoringPresets = .{1200}" node_modules/.pnpm/@prisma+orm-target-postgres@8.0.0-rc.14*/node_modules/@prisma/orm-target-postgres/dist/*.mjs | head -5

**Input:**
```json
{
  "command": "rtk rg -o --no-filename \"function temporalAuthoringPresets.{1200}\" node_modules/.pnpm/@prisma+orm-target-postgres@8.0.0-rc.14*/node_modules/@prisma/orm-target-postgres/dist/*.mjs | head -5; rtk rg -o --no-filename \"temporalAuthoringPresets = .{1200}\" node_modules/.pnpm/@prisma+orm-target-postgres@8.0.0-rc.14*/node_modules/@prisma/orm-target-postgres/dist/*.mjs | head -5"
}
```

**Output:**
```
(no output)
```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

Not defined there; maybe in family-sql or framework. Let's search across all for "temporalAuthoringPresets".

</details>

#### 🔧 Tool: bash
**Status:** completed
**Title:** rtk rg -l "temporalAuthoringPresets" node_modules/.pnpm/*/node_modules/@prisma/*/dist/*.mjs 2>/dev/null | head

**Input:**
```json
{
  "command": "rtk rg -l \"temporalAuthoringPresets\" node_modules/.pnpm/*/node_modules/@prisma/*/dist/*.mjs 2>/dev/null | head"
}
```

**Output:**
```
node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-framework/dist/temporal-presets-MavBeaJC-BcqWVoBB.mjs
node_modules/.pnpm/@prisma+orm-postgres@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@1._a89fbbb244cb137b3a78b10e900fa864/node_modules/@prisma/orm-family-sql/dist/control-DOGYQMFH.mjs
node_modules/.pnpm/@prisma+orm-framework@8.0.0-rc.14_typescript@5.9.3/node_modules/@prisma/orm-framework/dist/temporal-presets-MavBeaJC-BcqWVoBB.mjs
node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-family-sql/dist/control-DOGYQMFH.mjs
node_modules/.pnpm/@prisma+orm-target-postgres@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api_a0d150f910b4231f91635333d934767d/node_modules/@prisma/orm-family-sql/dist/control-DOGYQMFH.mjs
node_modules/.pnpm/@prisma+orm-framework@8.0.0-rc.14_typescript@5.9.3/node_modules/@prisma/orm-framework/dist/components__authoring.mjs
node_modules/.pnpm/@prisma+orm-postgres@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@1._a89fbbb244cb137b3a78b10e900fa864/node_modules/@prisma/orm-framework/dist/components__authoring.mjs
node_modules/.pnpm/@prisma+orm-family-sql@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@_1e96dacafeb4ab2e5340c6d25f48f42e/node_modules/@prisma/orm-framework/dist/components__authoring.mjs
node_modules/.pnpm/@prisma+orm-target-postgres@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api_a0d150f910b4231f91635333d934767d/node_modules/@prisma/orm-framework/dist/components__authoring.mjs
node_modules/.pnpm/@prisma+orm-postgres@8.0.0-rc.14_@prisma+cli-engine@0.6.2_@prisma+management-api-sdk@1._a89fbbb244cb137b3a78b10e900fa864/node_modules/@prisma/orm-framework/dist/components.mjs

```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

Rather than reverse-engineering deeply, maybe simplest: run `npx prisma contract emit` first to see current errors, then make minimal fixes and iterate.

But also I should check the PSL parser: is `temporal.updatedAt()` accepted as a field type in SQL PSL? The REMOVED_ATTRIBUTE_RULES hint says so. Also error `PSL_INVALID_MODEL_MEMBER: Invalid model member declaration "."` comes from `DateTime temporal.updatedAt()`.

Also, what about `createdAt DateTime @default(now())`? The generator `now` — is it applicable? The `@default(now())` on DateTime with codec timestamptz-temporal — but wait, in Prisma 8 SQL, `DateTime` type — what codec does it map to? `dateTime: { kind: fieldPreset, output: { codecId: "pg/timestamptz-temporal@1" ...}}` hmm that was in a different context (mongo?). Actually the first match showed `dateTime: { kind: "fieldPreset", output: {codecId: "pg/timestamptz-temporal@1", nativeType:"timestamptz"} }` — that's the SQL target preset for `DateTime`.

And `temporal: { createdAtJsDate, updatedAtJsDate, timestamptzJsDate, ...temporalAuthoringPresets(...) }`.

So in SQL PSL you can write `DateTime` (maps to timestamptz with Temporal), `Date`? etc. And presets `temporal.createdAt()`, `temporal.updatedAt()`.

Let's look at temporalAuthoringPresets to see keys: probably createdAt, updatedAt, timestamp.

</details>

#### 🔧 Tool: bash
**Status:** completed
**Title:** rtk python3 -c "
p='node_modules/.pnpm/@prisma+orm-framework@8.0.0-rc.14_typescript@5.9.3/node_modules/@prisma/orm-framework/dist/temporal-presets-MavBeaJC-BcqWVoBB.mjs'
s=open(p,encoding='utf8',errors='replace').read()
print(len(s)); print(s[:4000])
"

**Input:**
```json
{
  "command": "rtk python3 -c \"\np='node_modules/.pnpm/@prisma+orm-framework@8.0.0-rc.14_typescript@5.9.3/node_modules/@prisma/orm-framework/dist/temporal-presets-MavBeaJC-BcqWVoBB.mjs'\ns=open(p,encoding='utf8',errors='replace').read()\nprint(len(s)); print(s[:4000])\n\""
}
```

**Output:**
```
45547
import { t as blindCast } from "./casts-DpaahrlC-Bd5n2coI.mjs";
import { t as ifDefined } from "./defined-BQWA85QH-BRSBMULx.mjs";
import { d as isExecutionMutationDefaultValue, u as isColumnDefaultLiteralInputValue } from "./types-QyibIZST.mjs";
import { t as InternalError } from "./internal-error-ChGYPVpq-DhUD05u0.mjs";
import { n as invariant } from "./assertions-Dw1lZz_Q.mjs";
import { n as runtimeError } from "./runtime-error-BA9d7XjZ-BlT8t6LB.mjs";
//#region ../../../1-framework/1-core/framework-components/dist/temporal-presets-MavBeaJC.mjs
const AUTHORING_WARNING_BATCH_THRESHOLD = 5;
/**
* Emits collected authoring warnings once per build, grouped by `code`:
* a group at or below the threshold itemizes every `message`; above it,
* one summary — `"<count> <summary>"` followed by the `item` lines — so
* a build with many hits of one kind does not wall-of-text, and warnings
* of different codes never batch into each other's summary.
*/
function flushAuthoringWarnings(warnings) {
	const groups = /* @__PURE__ */ new Map();
	for (const warning of warnings) {
		const key = JSON.stringify([warning.code, warning.summary]);
		const group = groups.get(key) ?? [];
		group.push(warning);
		groups.set(key, group);
	}
	for (const group of groups.values()) {
		const first = group[0];
		if (first === void 0) continue;
		if (group.length <= AUTHORING_WARNING_BATCH_THRESHOLD) {
			for (const warning of group) process.emitWarning(warning.message, { code: warning.code });
			continue;
		}
		process.emitWarning(`${group.length} ${first.summary}\n${group.map((w) => `  - ${w.item}`).join("\n")}`, { code: first.code });
	}
}
function classifyEnumMemberType(values) {
	let sawText = false;
	let sawInt = false;
	for (const key of Object.keys(values)) {
		const value = values[key];
		if (value === void 0 || typeof value === "string") sawText = true;
		else if (typeof value === "number" && Number.isInteger(value)) sawInt = true;
		else return null;
	}
	if (sawText && sawInt) return null;
	if (sawText) return "text";
	if (sawInt) return "int";
	return null;
}
/**
* Resolves the codec id for an `enum` block. When `@@type` is absent, the codec
* is inferred from the members via {@link classifyEnumMemberType}; otherwise the
* explicit `@@type("codec")` argument is parsed. Pushes the appropriate
* diagnostic and returns `undefined` when neither yields a codec. `codecSpan` is
* the span downstream codec-validation diagnostics should anchor to. Shared by
* every family's enum factory so inference and the explicit path stay identical.
*/
function resolveEnumCodecId(block, ctx) {
	const sourceId = ctx.sourceId ?? "unknown";
	const typeAttr = block.attributes["type"];
	if (typeAttr === void 0) {
		const inferredKind = classifyEnumMemberType(block.values);
		if (inferredKind === null || ctx.enumInferenceCodecs === void 0) {
			ctx.diagnostics?.push({
				code: "PSL_ENUM_CANNOT_INFER_TYPE",
				message: `cannot infer @@type for enum "${block.name}"; add an explicit @@type(...)`,
				sourceId,
				span: block.span
			});
			return;
		}
		return {
			codecId: ctx.enumInferenceCodecs[inferredKind],
			codecSpan: block.span
		};
	}
	const codecId = typeAttr.args["codecId"];
	invariant(typeof codecId === "string", "@@type on an enum block parses one string argument");
	return {
		codecId,
		codecSpan: typeAttr.argSpans?.["codecId"] ?? typeAttr.span
	};
}
const LOWERING_ENTRY_PREFIX = "lowering:";
/**
* The key a lowering entry sits under. A data type id is `owner/name`, so a key carrying this
* prefix can never collide with one.
*/
function loweringEntryKey(tag) {
	return `${LOWERING_ENTRY_PREFIX}${tag}`;
}
function isLoweringEntryKey(key) {
	return key.startsWith(LOWERING_ENTRY_PREFIX);
}
/** Which of the two kinds of entry this is; the only place the discriminating key is named. */
function isDataTypeLoweringEntry(entry) {
	return "lower" in entry && entry.lower !== void 0;
}
function isAuthoringArgRef(value) {
	if (typeof value !== "object" || value === null || va

```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

This is deep. Let's take an empirical approach: just run the emit and iterate.

Plan of minimal changes:
1. `updatedAt DateTime temporal.updatedAt()` → `updatedAt temporal.updatedAt()`
2. `Decimal(12, 2)` → `Decimal` (since constructor accepts 0 args)

Wait but `@default(now())` on createdAt and `date DateTime @default(now())` — need to check if `now` generator is applicable to `DateTime` codec. The generator error message says "Use the corresponding field preset (e.g. temporal.updatedAt())" when generatorDescriptor.applicableCodecIds is undefined. For `now` generator in postgres, there is `postgresNowGeneratorIds` mapping — so likely `@default(now())` works with DateTime (timestamptz). Let's verify: search for postgresNowGeneratorIds.

Let's just run it.

Also enums: `enum Role { SUPERADMIN ... }` — does SQL PSL require `@@type("pg/text@1")`? The contract.md says: "PSL `enum` blocks declare a domain enum: a named value-set stored through a declared codec (`@@type("pg/text@1")` → a `text` column) and enforced by a planner-generated CHECK constraint." And `resolveEnumCodecId` infers from members when `@@type` absent — all-text members → "text". So inference works for all-text enums. Good, no change needed.

Let's run emit now to see the current state of errors.

</details>

#### 🔧 Tool: bash
**Status:** completed
**Title:** rtk npx prisma contract emit 2>&1 | tail -60

**Input:**
```json
{
  "command": "rtk npx prisma contract emit 2>&1 | tail -60"
}
```

**Output:**
```
{"kind":"step-started","step":"Resolving contract source...","id":"resolveSource","commandId":"contract.emit","timestamp":"2026-10-06T19:57:37.812Z"}
{"kind":"step-finished","step":"Resolving contract source...","id":"resolveSource","outcome":"failed","commandId":"contract.emit","timestamp":"2026-10-06T19:57:37.901Z"}
{"kind":"result","envelope":{"ok":false,"commandId":"contract.emit","error":{"code":"CONTRACT.SOURCE_LOAD_FAILED","severity":"error","summary":"Failed to resolve contract source","why":"Schema has 17 errors","nextActions":[{"kind":"user-choice","label":"Edit the source where each finding points, then run the command again."}],"meta":{"diagnostics":[{"code":"PSL_INVALID_MODEL_MEMBER","message":"Expected a type after field \"temporal\"","sourceId":"/home/craxker/github/nexus-thrive/prisma/contract.prisma","span":{"start":{"offset":436,"line":30,"column":25},"end":{"offset":444,"line":30,"column":33}}},{"code":"PSL_INVALID_MODEL_MEMBER","message":"Invalid model member declaration \".\"","sourceId":"/home/craxker/github/nexus-thrive/prisma/contract.prisma","span":{"start":{"offset":444,"line":30,"column":33},"end":{"offset":445,"line":30,"column":34}}},{"code":"PSL_INVALID_MODEL_MEMBER","message":"Expected a type after field \"temporal\"","sourceId":"/home/craxker/github/nexus-thrive/prisma/contract.prisma","span":{"start":{"offset":909,"line":49,"column":24},"end":{"offset":917,"line":49,"column":32}}},{"code":"PSL_INVALID_MODEL_MEMBER","message":"Invalid model member declaration \".\"","sourceId":"/home/craxker/github/nexus-thrive/prisma/contract.prisma","span":{"start":{"offset":917,"line":49,"column":32},"end":{"offset":918,"line":49,"column":33}}},{"code":"PSL_INVALID_MODEL_MEMBER","message":"Expected a type after field \"temporal\"","sourceId":"/home/craxker/github/nexus-thrive/prisma/contract.prisma","span":{"start":{"offset":1300,"line":64,"column":22},"end":{"offset":1308,"line":64,"column":30}}},{"code":"PSL_INVALID_MODEL_MEMBER","message":"Invalid model member declaration \".\"","sourceId":"/home/craxker/github/nexus-thrive/prisma/contract.prisma","span":{"start":{"offset":1308,"line":64,"column":30},"end":{"offset":1309,"line":64,"column":31}}},{"code":"PSL_INVALID_MODEL_MEMBER","message":"Expected a type after field \"temporal\"","sourceId":"/home/craxker/github/nexus-thrive/prisma/contract.prisma","span":{"start":{"offset":1957,"line":83,"column":33},"end":{"offset":1965,"line":83,"column":41}}},{"code":"PSL_INVALID_MODEL_MEMBER","message":"Invalid model member declaration \".\"","sourceId":"/home/craxker/github/nexus-thrive/prisma/contract.prisma","span":{"start":{"offset":1965,"line":83,"column":41},"end":{"offset":1966,"line":83,"column":42}}},{"code":"PSL_INVALID_MODEL_MEMBER","message":"Expected a type after field \"temporal\"","sourceId":"/home/craxker/github/nexus-thrive/prisma/contract.prisma","span":{"start":{"offset":2374,"line":98,"column":24},"end":{"offset":2382,"line":98,"column":32}}},{"code":"PSL_INVALID_MODEL_MEMBER","message":"Invalid model member declaration \".\"","sourceId":"/home/craxker/github/nexus-thrive/prisma/contract.prisma","span":{"start":{"offset":2382,"line":98,"column":32},"end":{"offset":2383,"line":98,"column":33}}},{"code":"PSL_UNSUPPORTED_FIELD_TYPE","message":"Field \"Tenant.temporal\" type \"\" is not supported in SQL PSL provider v1","sourceId":"/home/craxker/github/nexus-thrive/prisma/contract.prisma","span":{"start":{"offset":436,"line":30,"column":25},"end":{"offset":444,"line":30,"column":33}}},{"code":"PSL_UNSUPPORTED_FIELD_TYPE","message":"Field \"User.temporal\" type \"\" is not supported in SQL PSL provider v1","sourceId":"/home/craxker/github/nexus-thrive/prisma/contract.prisma","span":{"start":{"offset":909,"line":49,"column":24},"end":{"offset":917,"line":49,"column":32}}},{"code":"PSL_UNSUPPORTED_FIELD_TYPE","message":"Field \"Customer.temporal\" type \"\" is not supported in SQL PSL provider v1","sourceId":"/home/craxker/github/nexus-thrive/prisma/contract.prisma","span":{"start":{"offset":1300,"line":64,"column":22},"end":{"offset":1308,"line":64,"column":30}}},{"code":"PSL_INVALID_ATTRIBUTE_ARGUMENT","message":"Field \"Payment.amount\" constructor \"Decimal\" accepts at most 0 argument(s), received 2.","sourceId":"/home/craxker/github/nexus-thrive/prisma/contract.prisma","span":{"start":{"offset":1701,"line":77,"column":17},"end":{"offset":1715,"line":77,"column":31}}},{"code":"PSL_UNSUPPORTED_FIELD_TYPE","message":"Field \"Payment.temporal\" type \"\" is not supported in SQL PSL provider v1","sourceId":"/home/craxker/github/nexus-thrive/prisma/contract.prisma","span":{"start":{"offset":1957,"line":83,"column":33},"end":{"offset":1965,"line":83,"column":41}}},{"code":"PSL_INVALID_ATTRIBUTE_ARGUMENT","message":"Field \"Expense.amount\" constructor \"Decimal\" accepts at most 0 argument(s), received 2.","sourceId":"/home/craxker/github/nexus-thrive/prisma/contract.prisma","span":{"start":{"offset":2216,"line":93,"column":15},"end":{"offset":2230,"line":93,"column":29}}},{"code":"PSL_UNSUPPORTED_FIELD_TYPE","message":"Field \"Expense.temporal\" type \"\" is not supported in SQL PSL provider v1","sourceId":"/home/craxker/github/nexus-thrive/prisma/contract.prisma","span":{"start":{"offset":2374,"line":98,"column":24},"end":{"offset":2382,"line":98,"column":32}}}],"issues":[{"kind":"PSL_INVALID_MODEL_MEMBER","message":"Expected a type after field \"temporal\" (/home/craxker/github/nexus-thrive/prisma/contract.prisma:30:25)"},{"kind":"PSL_INVALID_MODEL_MEMBER","message":"Invalid model member declaration \".\" (/home/craxker/github/nexus-thrive/prisma/contract.prisma:30:33)"},{"kind":"PSL_INVALID_MODEL_MEMBER","message":"Expected a type after field \"temporal\" (/home/craxker/github/nexus-thrive/prisma/contract.prisma:49:24)"},{"kind":"PSL_INVALID_MODEL_MEMBER","message":"Invalid model member declaration \".\" (/home/craxker/github/nexus-thrive/prisma/contract.prisma:49:32)"},{"kind":"PSL_INVALID_MODEL_MEMBER","message":"Expected a type after field \"temporal\" (/home/craxker/github/nexus-thrive/prisma/contract.prisma:64:22)"},{"kind":"PSL_INVALID_MODEL_MEMBER","message":"Invalid model member declaration \".\" (/home/craxker/github/nexus-thrive/prisma/contract.prisma:64:30)"},{"kind":"PSL_INVALID_MODEL_MEMBER","message":"Expected a type after field \"temporal\" (/home/craxker/github/nexus-thrive/prisma/contract.prisma:83:33)"},{"kind":"PSL_INVALID_MODEL_MEMBER","message":"Invalid model member declaration \".\" (/home/craxker/github/nexus-thrive/prisma/contract.prisma:83:41)"},{"kind":"PSL_INVALID_MODEL_MEMBER","message":"Expected a type after field \"temporal\" (/home/craxker/github/nexus-thrive/prisma/contract.prisma:98:24)"},{"kind":"PSL_INVALID_MODEL_MEMBER","message":"Invalid model member declaration \".\" (/home/craxker/github/nexus-thrive/prisma/contract.prisma:98:32)"},{"kind":"PSL_UNSUPPORTED_FIELD_TYPE","message":"Field \"Tenant.temporal\" type \"\" is not supported in SQL PSL provider v1 (/home/craxker/github/nexus-thrive/prisma/contract.prisma:30:25)"},{"kind":"PSL_UNSUPPORTED_FIELD_TYPE","message":"Field \"User.temporal\" type \"\" is not supported in SQL PSL provider v1 (/home/craxker/github/nexus-thrive/prisma/contract.prisma:49:24)"},{"kind":"PSL_UNSUPPORTED_FIELD_TYPE","message":"Field \"Customer.temporal\" type \"\" is not supported in SQL PSL provider v1 (/home/craxker/github/nexus-thrive/prisma/contract.prisma:64:22)"},{"kind":"PSL_INVALID_ATTRIBUTE_ARGUMENT","message":"Field \"Payment.amount\" constructor \"Decimal\" accepts at most 0 argument(s), received 2. (/home/craxker/github/nexus-thrive/prisma/contract.prisma:77:17)"},{"kind":"PSL_UNSUPPORTED_FIELD_TYPE","message":"Field \"Payment.temporal\" type \"\" is not supported in SQL PSL provider v1 (/home/craxker/github/nexus-thrive/prisma/contract.prisma:83:33)"},{"kind":"PSL_INVALID_ATTRIBUTE_ARGUMENT","message":"Field \"Expense.amount\" constructor \"Decimal\" accepts at most 0 argument(s), received 2. (/home/craxker/github/nexus-thrive/prisma/contract.prisma:93:15)"},{"kind":"PSL_UNSUPPORTED_FIELD_TYPE","message":"Field \"Expense.temporal\" type \"\" is not supported in SQL PSL provider v1 (/home/craxker/github/nexus-thrive/prisma/contract.prisma:98:24)"}]},"docsUrl":"https://docs.prisma.io/docs/orm/v8/reference/error-reference/CONTRACT.SOURCE_LOAD_FAILED"},"diagnostics":[{"code":"CONTRACT.SOURCE_DIAGNOSTIC","summary":"prisma/contract.prisma:30:25 PSL_INVALID_MODEL_MEMBER: Expected a type after field \"temporal\"","severity":"error","nextActions":[],"where":{"path":"prisma/contract.prisma","line":30},"meta":{"code":"PSL_INVALID_MODEL_MEMBER"},"docsUrl":"https://docs.prisma.io/docs/orm/v8/reference/error-reference/CONTRACT.SOURCE_DIAGNOSTIC"},{"code":"CONTRACT.SOURCE_DIAGNOSTIC","summary":"prisma/contract.prisma:30:33 PSL_INVALID_MODEL_MEMBER: Invalid model member declaration \".\"","severity":"error","nextActions":[],"where":{"path":"prisma/contract.prisma","line":30},"meta":{"code":"PSL_INVALID_MODEL_MEMBER"},"docsUrl":"https://docs.prisma.io/docs/orm/v8/reference/error-reference/CONTRACT.SOURCE_DIAGNOSTIC"},{"code":"CONTRACT.SOURCE_DIAGNOSTIC","summary":"prisma/contract.prisma:49:24 PSL_INVALID_MODEL_MEMBER: Expected a type after field \"temporal\"","severity":"error","nextActions":[],"where":{"path":"prisma/contract.prisma","line":49},"meta":{"code":"PSL_INVALID_MODEL_MEMBER"},"docsUrl":"https://docs.prisma.io/docs/orm/v8/reference/error-reference/CONTRACT.SOURCE_DIAGNOSTIC"},{"code":"CONTRACT.SOURCE_DIAGNOSTIC","summary":"prisma/contract.prisma:49:32 PSL_INVALID_MODEL_MEMBER: Invalid model member declaration \".\"","severity":"error","nextActions":[],"where":{"path":"prisma/contract.prisma","line":49},"meta":{"code":"PSL_INVALID_MODEL_MEMBER"},"docsUrl":"https://docs.prisma.io/docs/orm/v8/reference/error-reference/CONTRACT.SOURCE_DIAGNOSTIC"},{"code":"CONTRACT.SOURCE_DIAGNOSTIC","summary":"prisma/contract.prisma:64:22 PSL_INVALID_MODEL_MEMBER: Expected a type after field \"temporal\"","severity":"error","nextActions":[],"where":{"path":"prisma/contract.prisma","line":64},"meta":{"code":"PSL_INVALID_MODEL_MEMBER"},"docsUrl":"https://docs.prisma.io/docs/orm/v8/reference/error-reference/CONTRACT.SOURCE_DIAGNOSTIC"},{"code":"CONTRACT.SOURCE_DIAGNOSTIC","summary":"prisma/contract.prisma:64:30 PSL_INVALID_MODEL_MEMBER: Invalid model member declaration \".\"","severity":"error","nextActions":[],"where":{"path":"prisma/contract.prisma","line":64},"meta":{"code":"PSL_INVALID_MODEL_MEMBER"},"docsUrl":"https://docs.prisma.io/docs/orm/v8/reference/error-reference/CONTRACT.SOURCE_DIAGNOSTIC"},{"code":"CONTRACT.SOURCE_DIAGNOSTIC","summary":"prisma/contract.prisma:83:33 PSL_INVALID_MODEL_MEMBER: Expected a type after field \"temporal\"","severity":"error","nextActions":[],"where":{"path":"prisma/contract.prisma","line":83},"meta":{"code":"PSL_INVALID_MODEL_MEMBER"},"docsUrl":"https://docs.prisma.io/docs/orm/v8/reference/error-reference/CONTRACT.SOURCE_DIAGNOSTIC"},{"code":"CONTRACT.SOURCE_DIAGNOSTIC","summary":"prisma/contract.prisma:83:41 PSL_INVALID_MODEL_MEMBER: Invalid model member declaration \".\"","severity":"error","nextActions":[],"where":{"path":"prisma/contract.prisma","line":83},"meta":{"code":"PSL_INVALID_MODEL_MEMBER"},"docsUrl":"https://docs.prisma.io/docs/orm/v8/reference/error-reference/CONTRACT.SOURCE_DIAGNOSTIC"},{"code":"CONTRACT.SOURCE_DIAGNOSTIC","summary":"prisma/contract.prisma:98:24 PSL_INVALID_MODEL_MEMBER: Expected a type after field \"temporal\"","severity":"error","nextActions":[],"where":{"path":"prisma/contract.prisma","line":98},"meta":{"code":"PSL_INVALID_MODEL_MEMBER"},"docsUrl":"https://docs.prisma.io/docs/orm/v8/reference/error-reference/CONTRACT.SOURCE_DIAGNOSTIC"},{"code":"CONTRACT.SOURCE_DIAGNOSTIC","summary":"prisma/contract.prisma:98:32 PSL_INVALID_MODEL_MEMBER: Invalid model member declaration \".\"","severity":"error","nextActions":[],"where":{"path":"prisma/contract.prisma","line":98},"meta":{"code":"PSL_INVALID_MODEL_MEMBER"},"docsUrl":"https://docs.prisma.io/docs/orm/v8/reference/error-reference/CONTRACT.SOURCE_DIAGNOSTIC"},{"code":"CONTRACT.SOURCE_DIAGNOSTIC","summary":"prisma/contract.prisma:30:25 PSL_UNSUPPORTED_FIELD_TYPE: Field \"Tenant.temporal\" type \"\" is not supported in SQL PSL provider v1","severity":"error","nextActions":[],"where":{"path":"prisma/contract.prisma","line":30},"meta":{"code":"PSL_UNSUPPORTED_FIELD_TYPE"},"docsUrl":"https://docs.prisma.io/docs/orm/v8/reference/error-reference/CONTRACT.SOURCE_DIAGNOSTIC"},{"code":"CONTRACT.SOURCE_DIAGNOSTIC","summary":"prisma/contract.prisma:49:24 PSL_UNSUPPORTED_FIELD_TYPE: Field \"User.temporal\" type \"\" is not supported in SQL PSL provider v1","severity":"error","nextActions":[],"where":{"path":"prisma/contract.prisma","line":49},"meta":{"code":"PSL_UNSUPPORTED_FIELD_TYPE"},"docsUrl":"https://docs.prisma.io/docs/orm/v8/reference/error-reference/CONTRACT.SOURCE_DIAGNOSTIC"},{"code":"CONTRACT.SOURCE_DIAGNOSTIC","summary":"prisma/contract.prisma:64:22 PSL_UNSUPPORTED_FIELD_TYPE: Field \"Customer.temporal\" type \"\" is not supported in SQL PSL provider v1","severity":"error","nextActions":[],"where":{"path":"prisma/contract.prisma","line":64},"meta":{"code":"PSL_UNSUPPORTED_FIELD_TYPE"},"docsUrl":"https://docs.prisma.io/docs/orm/v8/reference/error-reference/CONTRACT.SOURCE_DIAGNOSTIC"},{"code":"CONTRACT.SOURCE_DIAGNOSTIC","summary":"prisma/contract.prisma:77:17 PSL_INVALID_ATTRIBUTE_ARGUMENT: Field \"Payment.amount\" constructor \"Decimal\" accepts at most 0 argument(s), received 2.","severity":"error","nextActions":[],"where":{"path":"prisma/contract.prisma","line":77},"meta":{"code":"PSL_INVALID_ATTRIBUTE_ARGUMENT"},"docsUrl":"https://docs.prisma.io/docs/orm/v8/reference/error-reference/CONTRACT.SOURCE_DIAGNOSTIC"},{"code":"CONTRACT.SOURCE_DIAGNOSTIC","summary":"prisma/contract.prisma:83:33 PSL_UNSUPPORTED_FIELD_TYPE: Field \"Payment.temporal\" type \"\" is not supported in SQL PSL provider v1","severity":"error","nextActions":[],"where":{"path":"prisma/contract.prisma","line":83},"meta":{"code":"PSL_UNSUPPORTED_FIELD_TYPE"},"docsUrl":"https://docs.prisma.io/docs/orm/v8/reference/error-reference/CONTRACT.SOURCE_DIAGNOSTIC"},{"code":"CONTRACT.SOURCE_DIAGNOSTIC","summary":"prisma/contract.prisma:93:15 PSL_INVALID_ATTRIBUTE_ARGUMENT: Field \"Expense.amount\" constructor \"Decimal\" accepts at most 0 argument(s), received 2.","severity":"error","nextActions":[],"where":{"path":"prisma/contract.prisma","line":93},"meta":{"code":"PSL_INVALID_ATTRIBUTE_ARGUMENT"},"docsUrl":"https://docs.prisma.io/docs/orm/v8/reference/error-reference/CONTRACT.SOURCE_DIAGNOSTIC"},{"code":"CONTRACT.SOURCE_DIAGNOSTIC","summary":"prisma/contract.prisma:98:24 PSL_UNSUPPORTED_FIELD_TYPE: Field \"Expense.temporal\" type \"\" is not supported in SQL PSL provider v1","severity":"error","nextActions":[],"where":{"path":"prisma/contract.prisma","line":98},"meta":{"code":"PSL_UNSUPPORTED_FIELD_TYPE"},"docsUrl":"https://docs.prisma.io/docs/orm/v8/reference/error-reference/CONTRACT.SOURCE_DIAGNOSTIC"}],"nextActions":[{"kind":"user-choice","label":"Edit the source where each finding points, then run the command again."}]},"commandId":"contract.emit","timestamp":"2026-10-06T19:57:37.903Z"}

```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

17 errors as expected. Now apply fixes:

1. `updatedAt    DateTime temporal.updatedAt()` → `updatedAt temporal.updatedAt()`
2. `Decimal(12, 2)` → `Decimal`

Question: is `temporal.updatedAt()` valid in SQL PSL type position? The REMOVED_ATTRIBUTE_RULES hint for `@updatedAt` says "Use `temporal.updatedAt()` as a field-preset call instead." and suppressWhen field.typeConstructor?.path[0] === "temporal". So yes, SQL PSL supports `temporal.updatedAt()` as type constructor. Also the target preset map includes `temporal: { createdAt, updatedAt, ... }`.

Note the presets output codec `pg/timestamptz-temporal@1` for temporal — meaning it stores Temporal values. Alternative is `temporal.updatedAtJsDate()`? Actually keys listed: createdAtJsDate, updatedAtJsDate, timestamptzJsDate, plus temporalAuthoringPresets spread (createdAt, updatedAt, ...). Hmm which to choose? Minimal change: `temporal.updatedAt()`.

But consider the rest of the contract uses `DateTime` for createdAt → codec `pg/timestamptz-temporal@1`? Let's check what `DateTime` maps to in SQL PSL preset: from earlier snippet `dateTime: { kind: "fieldPreset", output: {codecId: "pg/timestamptz-temporal@1", nativeType: "timestamptz"} }` — hmm that snippet had "bytes: ... bytea, dateTime: ... timestamptz-temporal" — that looks like the SQL family preset map. Actually wait, `pg/timestamptz-temporal@1` implies Temporal. Hmm but there's also `timestamptzJsDate` preset which uses PG_TIMESTAMPTZ_DATE_CODEC_ID (Date).

Anyway — for consistency with createdAt (`DateTime @default(now())`), updatedAt as `temporal.updatedAt()` uses PG_TIMESTAMPTZ_TEMPORAL_CODEC_ID (from the spread temporalAuthoringPresets with PG_TIMESTAMPTZ_TEMPORAL_CODEC_ID) which likely matches `DateTime` codec. Good.

Also consider: should I also change `createdAt DateTime @default(now())`? Not necessary if it emits. Keep minimal. But is `@default(now())` valid? Let's check: generator `now` for postgres — `postgresNowGeneratorIds[codecId]`. It might work. We'll see after the fix.

Let's apply edits.

</details>

#### 🔧 Tool: edit
**Status:** completed
**Title:** prisma/contract.prisma

**Input:**
```json
{
  "filePath": "/home/craxker/github/nexus-thrive/prisma/contract.prisma",
  "oldString": "  updatedAt    DateTime temporal.updatedAt()\n\n  users     User[]",
  "newString": "  updatedAt    temporal.updatedAt()\n\n  users     User[]"
}
```

**Output:**
```
Edit applied successfully.
```

#### 🔧 Tool: edit
**Status:** completed
**Title:** prisma/contract.prisma

**Input:**
```json
{
  "filePath": "/home/craxker/github/nexus-thrive/prisma/contract.prisma",
  "oldString": "  updatedAt   DateTime temporal.updatedAt()\n\n  @@index([tenantId])\n  @@index([clerkUserId])",
  "newString": "  updatedAt   temporal.updatedAt()\n\n  @@index([tenantId])\n  @@index([clerkUserId])"
}
```

**Output:**
```
Edit applied successfully.
```

#### 🔧 Tool: edit
**Status:** completed
**Title:** prisma/contract.prisma

**Input:**
```json
{
  "filePath": "/home/craxker/github/nexus-thrive/prisma/contract.prisma",
  "oldString": "  updatedAt DateTime temporal.updatedAt()\n\n  payments Payment[]",
  "newString": "  updatedAt temporal.updatedAt()\n\n  payments Payment[]"
}
```

**Output:**
```
Edit applied successfully.
```

#### 🔧 Tool: edit
**Status:** completed
**Title:** prisma/contract.prisma

**Input:**
```json
{
  "filePath": "/home/craxker/github/nexus-thrive/prisma/contract.prisma",
  "oldString": "  amount        Decimal(12, 2)\n  status        PaymentStatus   @default(PENDING)\n  provider      PaymentProvider @default(CASH)\n  providerRefId String?         @unique\n  description   String?\n  createdAt     DateTime        @default(now())\n  updatedAt     DateTime        temporal.updatedAt()",
  "newString": "  amount        Decimal\n  status        PaymentStatus   @default(PENDING)\n  provider      PaymentProvider @default(CASH)\n  providerRefId String?         @unique\n  description   String?\n  createdAt     DateTime        @default(now())\n  updatedAt     temporal.updatedAt()"
}
```

**Output:**
```
Edit applied successfully.
```

#### 🔧 Tool: edit
**Status:** completed
**Title:** prisma/contract.prisma

**Input:**
```json
{
  "filePath": "/home/craxker/github/nexus-thrive/prisma/contract.prisma",
  "oldString": "  amount      Decimal(12, 2)\n  category    String\n  description String\n  date        DateTime @default(now())\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime temporal.updatedAt()",
  "newString": "  amount      Decimal\n  category    String\n  description String\n  date        DateTime @default(now())\n  createdAt   DateTime @default(now())\n  updatedAt   temporal.updatedAt()"
}
```

**Output:**
```
Edit applied successfully.
```

*[step-finish part]*

*[patch part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

Also alignment: in Tenant, `updatedAt    temporal.updatedAt()` — alignment fine.

Now run emit.

</details>

#### 🔧 Tool: bash
**Status:** completed
**Title:** rtk npx prisma contract emit 2>&1 | tail -30

**Input:**
```json
{
  "command": "rtk npx prisma contract emit 2>&1 | tail -30"
}
```

**Output:**
```
{"kind":"step-started","step":"Resolving contract source...","id":"resolveSource","commandId":"contract.emit","timestamp":"2026-10-06T19:58:28.181Z"}
{"kind":"step-finished","step":"Resolving contract source...","id":"resolveSource","outcome":"ok","commandId":"contract.emit","timestamp":"2026-10-06T19:58:28.306Z"}
{"kind":"step-started","step":"Emitting contract...","id":"emit","commandId":"contract.emit","timestamp":"2026-10-06T19:58:28.306Z"}
{"kind":"step-finished","step":"Emitting contract...","id":"emit","outcome":"ok","commandId":"contract.emit","timestamp":"2026-10-06T19:58:28.890Z"}
{"kind":"result","envelope":{"ok":true,"commandId":"contract.emit","result":{"ok":true,"storageHash":"fe702cd236167c2dc8a64eb0b76f67c65de3c4427dd114cda5e9bb399de6324b","executionHash":"96b7ee81bbfae0c619e58d4e7fb11c721f3eac68df6a046fbd980c3089a012dc","profileHash":"3916f444a8a17ad749191acf9e08dad97d1a327b88c2f1d45d12f240296aa8b2","outDir":"/home/craxker/github/nexus-thrive/prisma","files":{"json":"/home/craxker/github/nexus-thrive/prisma/contract.json","dts":"/home/craxker/github/nexus-thrive/prisma/contract.d.ts"},"timings":{"total":721}},"exitCode":0,"diagnostics":[],"nextActions":[]},"commandId":"contract.emit","timestamp":"2026-10-06T19:58:28.901Z"}

```

*[step-finish part]*

*[patch part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

Emit succeeded: exitCode 0, wrote prisma/contract.json and prisma/contract.d.ts.

Note: db.ts imports `./contract.d` and `./contract.json` — those exist (previously at prisma/contract.d.ts? The user said `generated/prisma/contract.d.ts` exists). Let's check: emitted outDir is `/home/craxker/github/nexus-thrive/prisma`. The user said artifacts exist at `generated/prisma/`. Let's check where files are now.

Let's check git status to see what changed and where files were emitted.

</details>

#### 🔧 Tool: bash
**Status:** completed
**Title:** rtk git status --short && rtk ls prisma generated/prisma 2>/dev/null

**Input:**
```json
{
  "command": "rtk git status --short && rtk ls prisma generated/prisma 2>/dev/null"
}
```

**Output:**
```
?? .agents/
?? .claude/
?? .cursor/
?? .devin/
?? .gitignore
?? AGENTS.md
?? CLAUDE.md
?? README.md
?? app/
?? eslint.config.mjs
?? generated/
?? next.config.ts
?? package.json
?? pnpm-lock.yaml
?? pnpm-workspace.yaml
?? postcss.config.mjs
?? prisma.config.ts
?? prisma/
?? public/
?? tsconfig.jsoncontract.d.ts  67.1K
contract.json  41.8K
contract.d.ts  66.3K
contract.json  41.0K
contract.prisma  2.3K
db.ts  283B

```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

Interesting: git status shows everything untracked (no commits? or repo has no commits... whatever).

Files:
- `prisma/contract.d.ts` 67.1K, `prisma/contract.json` 41.8K — newly emitted- `generated/prisma/contract.d.ts` 66.3K, `contract.json` 41.0K — old artifacts (from a previous emit presumably with output override).

Wait, actually `rtk ls prisma generated/prisma` output combined. Let me disambiguate: it printed files of both dirs in sequence. So prisma/ has contract.d.ts, contract.json, contract.prisma, db.ts. generated/prisma/ has contract.d.ts, contract.json.

Hmm — which are which sizes? Order: first dir listing then second. Likely prisma/: contract.d.ts 67.1K, contract.json 41.8K, contract.prisma 2.3K, db.ts 283B; generated/prisma/: contract.d.ts 66.3K, contract.json 41.0K.

So prisma/ artifacts are freshly emitted (newer/larger). generated/prisma/ is stale from before.

db.ts imports `./contract.d` and `./contract.json` relative to prisma/ → resolves to prisma/contract.d.ts and prisma/contract.json. Wait, `./contract.d` → contract.d.ts. Yes, those exist now in prisma/.

Hmm, but did prisma/contract.json and prisma/contract.d.ts exist before my emit? The user listed existing files: `generated/prisma/contract.d.ts` and `generated/prisma/contract.json` — but not prisma/contract.json. So possibly they didn't exist before, or existed. Since git status shows prisma/ untracked entirely, I can't tell. Either way, emit now produced them at prisma/ (derived from contract path). Good — that matches db.ts imports.

Now, is anything else broken? The user said only goal is `contract emit` succeeding. It does.

Should I verify the generated contract contains the 5 models and3 enums? Quick check of contract.d.ts for models.

Also should I check whether prisma.config.ts/db.ts need changes? No — emit worked without changes.

Let's quickly verify artifacts contain expected models.

</details>

#### 🔧 Tool: bash
**Status:** completed
**Title:** rtk rg -o "export type (Tenant|User|Customer|Payment|Expense)\b|enum (Role|PaymentStatus|PaymentProvider)" prisma/contract.d.ts | sort -u; rtk rg -o "\"(Tenant|User|Customer|Payment|Expense|Role|PaymentStatus|PaymentProvider)\"" prisma/contract.json | sort -u

**Input:**
```json
{
  "command": "rtk rg -o \"export type (Tenant|User|Customer|Payment|Expense)\\b|enum (Role|PaymentStatus|PaymentProvider)\" prisma/contract.d.ts | sort -u; rtk rg -o \"\\\"(Tenant|User|Customer|Payment|Expense|Role|PaymentStatus|PaymentProvider)\\\"\" prisma/contract.json | sort -u"
}
```

**Output:**
```
"Customer"
"Expense"
"Payment"
"PaymentProvider"
"PaymentStatus"
"Role"
"Tenant"
"User"

```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

contract.d.ts doesn't match my regex — maybe types named differently (e.g. `Models.Tenant`). Let's check quickly.

</details>

#### 🔧 Tool: bash
**Status:** completed
**Title:** rtk rg -n "Tenant" prisma/contract.d.ts | head -10; rtk rg -n "amount" prisma/contract.d.ts | head -5

**Input:**
```json
{
  "command": "rtk rg -n \"Tenant\" prisma/contract.d.ts | head -10; rtk rg -n \"amount\" prisma/contract.d.ts | head -5"
}
```

**Output:**
```
26 matches in 1 files:

285:readonly Tenant: {
340:readonly Tenant: {
395:readonly Tenant: {
450:readonly Tenant: {
483:tenant: public_Tenant;
495:tenant: public_Tenant;
510:tenant: public_Tenant;
513:export type public_Tenant = {
264:      readonly amount: CodecTypes['pg/numeric@1']['output'];
274:      readonly amount: CodecTypes['pg/numeric@1']['output'];
319:      readonly amount: CodecTypes['pg/numeric@1']['input'];
329:      readonly amount: CodecTypes['pg/numeric@1']['input'];
374:      readonly amount: CodecTypes['pg/numeric@1']['output'];

```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

Artifacts are correct: models, enums, numeric columns.

One thing: `Decimal` without precision → `pg/numeric@1` (unbounded numeric). The original intent was numeric(12,2). The user said keep the data model, only adapt syntax. Prisma 8 SQL PSL's `Decimal` accepts 0 args — so precision isn't expressible as `Decimal(12,2)`. Is there an alternative? Maybe `Decimal` constructor with args is unsupported in v1, but perhaps there's a `@db.Decimal(12,2)`-like channel? contract.md says `@db.X(args)` channel is removed → `X(args)`. But `Decimal` accepts 0 args. So precision isn't supported by this version. Could use a type alias `types { Money = Decimal }` — still no args.

Hmm, maybe there's a `numeric(12,2)` native type support somewhere... Let's check if there's any constructor accepting precision, e.g. `Decimal(precision: 12, scale: 2)`. The error message: "constructor Decimal accepts at most 0 argument(s)". So no.

Let's check the target's type constructors for anything with precision. Quick grep in authoring mjs for "precision".

</details>

#### 🔧 Tool: bash
**Status:** completed
**Title:** rtk rg -o --no-filename "maxArgs: *[0-9]+|precision[^,;]{0,60}" node_modules/.pnpm/@prisma+orm-target-postgres@8.0.0-rc.14*/node_modules/@prisma/orm-target-postgres/dist/authoring-BmQxOggr-CK871YR4.mjs | sort -u | head -30

**Input:**
```json
{
  "command": "rtk rg -o --no-filename \"maxArgs: *[0-9]+|precision[^,;]{0,60}\" node_modules/.pnpm/@prisma+orm-target-postgres@8.0.0-rc.14*/node_modules/@prisma/orm-target-postgres/dist/authoring-BmQxOggr-CK871YR4.mjs | sort -u | head -30"
}
```

**Output:**
```
precision integer stored as PostgreSQL numeric and represented as big

```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

No precision-argument constructors. So `Decimal` unbounded is the only spelling available in this version — acceptable adaptation of syntax; the column remains numeric.

Actually wait — maybe there's `Decimal` variant with precision via `types {}` alias? No, aliases just reference types.

Also check: does the emitted numeric carry precision? `pg/numeric@1` without precision → numeric without precision. That's a data-model nuance but the user's constraint #7 says keep the data model, adapt syntax. Since precision isn't expressible, `Decimal` is correct.

Let's double check the diff of contract.prisma and confirm no other file changed. Also check if `generated/prisma` artifacts are now stale — should I regenerate them? User said don't do anything beyond what's necessary. db.ts imports from `./contract.d` and `./contract.json` in prisma/ → fresh. generated/ is a leftover. Leave it.

Actually wait: does db.ts's import `./contract.d` resolve? `prisma/contract.d.ts` exists → TS resolves `./contract.d` to `contract.d.ts`? Import specifier "./contract.d" → looks for ./contract.d.ts, ./contract.d.tsx, ./contract.d.d.ts... yes `contract.d.ts` matches `./contract.d` + `.ts`. Fine. Not my concern anyway.

Let's show the final contract.prisma diff-ish and verify final run once more cleanly.

Also confirm prisma.config.ts and db.ts unchanged (I didn't touch them).

Let me run emit one final time and report exit code.

</details>

#### 🔧 Tool: bash
**Status:** completed
**Title:** rtk npx prisma contract emit >/tmp/opencode/emit.log 2>&1; echo "exit=$?"; rtk rg -o '"ok":(true|false)|"exitCode":[0-9]+|"storageHash":"[a-f0-9]+"' /tmp/opencode/emit.log | tail -5; rtk rg -n "updatedAt|amount" prisma/contract.prisma

**Input:**
```json
{
  "command": "rtk npx prisma contract emit >/tmp/opencode/emit.log 2>&1; echo \"exit=$?\"; rtk rg -o '\"ok\":(true|false)|\"exitCode\":[0-9]+|\"storageHash\":\"[a-f0-9]+\"' /tmp/opencode/emit.log | tail -5; rtk rg -n \"updatedAt|amount\" prisma/contract.prisma"
}
```

**Output:**
```
exit=0
"ok":true
"ok":true
"storageHash":"fe702cd236167c2dc8a64eb0b76f67c65de3c4427dd114cda5e9bb399de6324b"
"exitCode":0
30:  updatedAt    temporal.updatedAt()
49:  updatedAt   temporal.updatedAt()
64:  updatedAt temporal.updatedAt()
77:  amount        Decimal
83:  updatedAt     temporal.updatedAt()
93:  amount      Decimal
98:  updatedAt   temporal.updatedAt()

```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

Done. Report concisely.

Files modified: only `prisma/contract.prisma`.
Command: `npx prisma contract emit` → succeeded, exit 0, artifacts at prisma/contract.json + prisma/contract.d.ts.
prisma.config.ts and prisma/db.ts unchanged (not necessary).

Note: I should save memory per protocol? The Engram MCP tools aren't listed in my available functions here... Actually the system prompt mentions mem_save etc., but the function list doesn't include them. Only engram_mem_* tools exist (engram_mem_save, etc.). Let me consider saving a short observation. The instructions say to call mem_save proactively; the actual tool is `engram_mem_save`. I'll save one observation — but user said "No hagas ninguna otra modificación del proyecto" — memory save isn't project modification. I'll do it quickly and keep the final answer to the requested4 items.

Actually the user asked: "Al terminar, dime únicamente: qué archivos modificaste, qué cambiaste, qué comando ejecutaste, y si contract emit terminó correctamente." Keep it to that. I'll do a memory save silently.

</details>

#### 🔧 Tool: engram_mem_save
**Status:** completed

**Input:**
```json
{
  "content": "**What**: Corregida la sintaxis del contrato Prisma 8 (`prisma/contract.prisma`) para que `npx prisma contract emit` termine OK.\n**Why**: El contrato migraba de schema tradicional con sintaxis inválida en SQL PSL v1: `updatedAt DateTime temporal.updatedAt()` (el preset `temporal.*()` reemplaza al tipo, no lo acompaña) y `Decimal(12, 2)` (el constructor `Decimal` acepta 0 argumentos en esta versión; no hay soporte de precisión/escala).\n**Where**: prisma/contract.prisma (5 campos updatedAt, 2 campos amount). prisma.config.ts y prisma/db.ts no requirieron cambios.\n**Learned**: En Prisma 8 SQL PSL: `@updatedAt` fue eliminado (hint: usar `temporal.updatedAt()`); `@db.X(args)` se reescribe como `X(args)` pero `Decimal` no admite args; `DateTime @default(now())` sigue siendo válido. Artefactos emitidos en prisma/contract.json + prisma/contract.d.ts (generated/prisma/ quedó como resto viejo). Errores llegan como envelope JSON con `CONTRACT.SOURCE_LOAD_FAILED` y `meta.diagnostics[]`.",
  "project": "nexus",
  "title": "Arreglada sintaxis SQL PSL v1 en contract.prisma (Prisma 8)",
  "type": "bugfix"
}
```

**Output:**
```
{"id":183,"judgment_required":false,"project":"nexus","project_path":"","project_source":"explicit_override","result":"Memory saved: \"Arreglada sintaxis SQL PSL v1 en contract.prisma (Prisma 8)\" (bugfix)\nSuggested topic_key: bug/arreglada-sintaxis-sql-psl-v1-en-contract-prisma-prisma-8","state":"active","sync_id":"obs-d214817b2833accc"}
```

*[step-finish part]*

### 🤖 Assistant
*2026-10-06 15:00:02*

*[step-start part]*

💭 **Reasoning:**

<details>
<summary>Click to expand reasoning</summary>

Report concisely.

</details>

**Archivos modificados:** solo `prisma/contract.prisma`.

**Qué cambié:**
- Los 5 campos `updatedAt`: `DateTime temporal.updatedAt()` → `temporal.updatedAt()` (el preset `temporal.updatedAt()` ocupa la posición de tipo en SQL PSL v1; `DateTime temporal...` se parseaba como un segundo campo `temporal` y daba `PSL_INVALID_MODEL_MEMBER` / `PSL_UNSUPPORTED_FIELD_TYPE`).
- Los 2 campos `amount`: `Decimal(12, 2)` → `Decimal` (el constructor `Decimal` acepta 0 argumentos; `PSL_INVALID_ATTRIBUTE_ARGUMENT`).
- `prisma.config.ts` y `prisma/db.ts`: sin cambios (no fue necesario).

**Comando ejecutado:** `npx prisma contract emit`

**Resultado:** terminó correctamente — exit code 0, envelope `"ok":true`, `"exitCode":0`, sin diagnósticos. Generó `prisma/contract.json` (storageHash `fe702cd2…`) y `prisma/contract.d.ts`, con los modelos Tenant, User, Customer, Payment, Expense y los enums Role, PaymentStatus, PaymentProvider (las columnas de monto quedan como `pg/numeric@1`).

*[step-finish part]*
