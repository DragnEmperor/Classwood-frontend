# Classwood Frontend

Next.js 15 (App Router) + TypeScript + Tailwind CSS frontend for Classwood.

Auth uses httpOnly cookies set by Next.js API routes that proxy to the Django REST backend. Tokens never reach the browser. Server components fetch data directly from DRF on each request; React Query handles client-side mutations.

## Prerequisites

- Node 20+
- Django backend running (see `../Classwood-DRF`) — default expected at `http://127.0.0.1:8000/api/`

## Setup

```sh
cp .env.example .env.local
# edit .env.local if your DRF runs somewhere else
npm install
npm run dev
```

App boots at http://localhost:3000.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Project layout

```
app/                  # Next.js App Router routes
  api/auth/           # Login/logout proxy routes (set/clear cookies)
  login/              # Public login page + client form
  school/             # School role section (gated by middleware)
    dashboard/        # Server-rendered dashboard
    _components/      # Role-scoped client components (sidebar)
lib/                  # Server-only helpers (auth, fetch wrapper, react-query)
types/                # Shared API response types
middleware.ts         # Role gating: /school|/staff|/student → cookie check
public/               # Static assets (images, manifest, favicon)
_legacy_src/          # OLD Create-React-App codebase — kept for reference
                      #   during Phase 3 migration. Will be removed when all
                      #   routes are ported.
```

## Migration status (Phase 3)

| Phase | Status |
|---|---|
| 3.1 — Foundation + Login + School Dashboard | ✅ Done |
| 3.2 — Remaining School routes, Student/Staff dashboards, public pages | ⏳ Pending |
| 3.3 — Cleanup: delete `_legacy_src/` | ⏳ Pending |

See `_legacy_src/` for the unmigrated routes (Register, ForgotPassword, all CRUD pages, Student/Staff dashboards, notices/events). These are no longer served — they exist only as reference during incremental migration.
