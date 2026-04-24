# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test runner is configured yet.

## Environment Variables

Copy these to `.env.local` before running:

```
API_URL=http://localhost:8000          # Server-side only (used in Server Components)
NEXT_PUBLIC_API_URL=http://localhost:8000  # Client-accessible
```

The backend is a Laravel/Lumen API running on port 8000.

## Architecture

**Stack:** Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4 · App Router

**Routing:** App Router only (`src/app/`). The `src/pages/` directory exists but is empty — do not use it.

**Data fetching:** Use async Server Components with `fetch()`. Server-side calls use `process.env.API_URL`; client-side calls use `process.env.NEXT_PUBLIC_API_URL`. Set `cache: "no-store"` for dynamic data.

**Styling:** Tailwind CSS 4 via PostCSS (`@tailwindcss/postcss`). CSS custom properties for dark mode are defined in `src/app/globals.css`. No component library is installed.

**Path alias:** `@/*` resolves to the project root (e.g., `@/src/app/...`).
