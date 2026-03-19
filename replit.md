# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies. This is the FieldState website — a narrative-driven React SPA with a guided Summon interaction system and lead capture backend.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + Zustand + Framer Motion
- **Router**: Wouter

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server (leads submission, health)
│   └── fieldstate/         # FieldState React SPA (main website)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
├── pnpm-workspace.yaml     # pnpm workspace
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## FieldState Website

### Routes
- `/` — Home (hero statement rotation, CTAs, principles)
- `/mythos` — Narrative/philosophy
- `/builders` — Builder profiles
- `/forge` — Artifact cards with LIVE/BUILDING/ARCHIVED status
- `/sparks-and-lore` — Category-filtered archive posts
- `/about` — System explanation, team, stack
- `/labs` — Lab project cards with waitlist CTAs
- `/workspec` — WorkSpec framework page
- `/contact` — Lead capture form
- `/not-for-clients` — Filter statements + reflective form
- `/summon` — Standalone summon page
- `*` — Branded 404

### Global State (Zustand)
- `summonState`: 'closed' | 'open' | 'active' | 'capturing' | 'complete'
- `ceremonialMode`: boolean (persisted to localStorage)
- `navState`: 'desktop' | 'mobile-closed' | 'mobile-open'
- `loadingState`: 'initial' | 'ready'
- `cursorState`: 'default' | 'interactive' | 'hidden'

### Lead Capture
All forms submit to `POST /api/leads` with honeypot anti-spam. Stored in `leads` table.
Entry points: contact page, not-for-clients page, summon system, labs waitlist.

### Content Data
All content is centralized in `artifacts/fieldstate/src/data/content.ts`:
- Statements (rotating hero)
- Navigation links
- Builders
- Forge artifacts
- Archive categories & posts
- Lab projects
- Filter statements

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## API Endpoints

- `GET /api/healthz` — Health check
- `POST /api/leads` — Lead submission (source, name?, email, message?, inquiryType?, route, honeypot)

## Database Schema

### `leads` table
- `id` — serial primary key
- `source` — entry point (contact, summon, labs, not-for-clients)
- `name` — optional
- `email` — required
- `message` — optional
- `inquiry_type` — optional
- `route` — current route when submitted
- `created_at` — timestamp
