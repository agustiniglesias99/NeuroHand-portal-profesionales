# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands are run from the `neurohand-proffesional/` directory.

```bash
npm run dev       # Start dev server with HMR (Vite)
npm run build     # Type-check then build for production (tsc -b && vite build)
npm run lint      # Run ESLint
npm run preview   # Preview production build locally
```

There are no tests configured yet.

## Architecture

Single-page React 19 app bootstrapped with the Vite + React + TypeScript template. The project is effectively a blank slate — `src/App.tsx` is the only real component so far.

**Stack:** React 19, TypeScript ~6, Vite 8, ESLint with `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`.

**Entry point:** `src/main.tsx` mounts `<App />` into `#root` inside `StrictMode`.

**Static assets:** SVG icons are sprite-based via `public/icons.svg` (referenced with `<use href="/icons.svg#icon-id">`). Image assets (`.png`, `.svg`) live in `src/assets/` and are imported directly into components.

**TypeScript:** Strict mode with `noUnusedLocals`, `noUnusedParameters`, and `erasableSyntaxOnly` enabled. Bundler module resolution — do not add `.js` extensions to relative imports.

**Data layer:** Patients/activities/sessions/news are mock data (`src/data/mock.ts`) held in `DataContext`. Doctors are backed by **Supabase** (`src/lib/supabase.ts` client, `src/lib/doctors.ts` data access, table `medicos`). The DB columns (`matricula`, `nombre`, `apellido`, `email`) are mapped to/from the `Doctor` model in `lib/doctors.ts`; `address`/`specialty` exist in the model but are not yet persisted. If `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` are absent (see `.env.example`), `DataContext` falls back to `MOCK_DOCTORS` so the app still runs.

**Auth/roles:** `AuthContext` tracks a `CurrentUser` with `role` (`doctor` | `admin`). Login derives the role from the email local-part (`admin` → admin). Routing and sidebar nav in `App.tsx`/`Layout.tsx` are role-gated; `/admin/doctors` is admin-only.
