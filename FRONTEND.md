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

**Styling:** Tailwind CSS 4 via PostCSS (`@tailwindcss/postcss`). CSS custom properties are defined in `src/app/globals.css`. No component library is installed. See design system rules below.

**Path alias:** `@/*` resolves to the project root (e.g., `@/src/app/...`).

---

## KurmaGo Design System

All new components **must** use the tokens defined in `DESIGN-kurmago.md`. The CSS variables are declared in `src/app/globals.css` under the `/* KurmaGo Design Tokens */` block. Never hardcode hex values — always reference a `--kg-*` variable or one of the legacy aliases listed below.

### Color Tokens

| CSS Variable | Value | Role |
|---|---|---|
| `--kg-primary` | `#1E6091` | Ocean Blue — every CTA, link, active state |
| `--kg-primary-deep` | `#0A3D62` | Deep Sea — hero panels, dark surfaces, left auth panel |
| `--kg-primary-bright` | `#2E86AB` | Wave Bright — eyebrow labels, editorial accents, Pro upsells |
| `--kg-primary-tint` | `#A8DADC` | Shallow — decorative numerals, muted text on dark panels |
| `--kg-canvas` | `#F5F1E8` | Warm Sand — **page background** (never use pure white for pages) |
| `--kg-paper` | `#FFFFFF` | White — cards, modals, elevated surfaces only |
| `--kg-surface-mist` | `#E8F4F8` | Sea Mist — quote panels, active sidebar links, search inputs |
| `--kg-ink` | `#0D1B2A` | Deep Ink — default body text |
| `--kg-ink-72` | `#3A4A5C` | Muted 72 — sidebar nav at rest, secondary body |
| `--kg-ink-56` | `#5C6B7A` | Muted 56 — captions, helper text, inactive |
| `--kg-ink-40` | `#8A95A2` | Muted 40 — disabled, placeholder, fine print |
| `--kg-hairline` | `#E5DFD0` | Hairline — 1px card border on Warm Sand |
| `--kg-hairline-mist` | `#C9DDE3` | Hairline on Sea Mist surfaces |
| `--kg-hairline-dark` | `rgba(168,218,220,.16)` | Hairline on Deep Sea panels |
| `--kg-coral` | `#FF6B6B` | Coral — **error and destructive actions ONLY** |
| `--kg-coral-soft` | `#FFE5E5` | Coral soft — error message backgrounds |
| `--kg-focus-ring` | `rgba(46,134,171,.32)` | Wave Bright at 32% — keyboard focus ring alpha |

### Shadow Tokens

| CSS Variable | Use |
|---|---|
| `--kg-shadow-ring` | `0 0 0 1px var(--kg-hairline)` — default card elevation |
| `--kg-shadow-soft-1` | Trip cards, place cards at rest |
| `--kg-shadow-soft-2` | Dropdowns, popovers, hovered cards |
| `--kg-shadow-soft-3` | Modals, toasts, sticky bars |
| `--kg-shadow-focus` | `0 0 0 3px var(--kg-focus-ring)` — keyboard focus on interactive elements |

### Legacy Aliases (keep working, map to KurmaGo)

The following legacy variables exist for backwards compatibility — they now point to KurmaGo tokens. Use `--kg-*` for all new code; the aliases are for existing components only.

| Legacy var | Maps to |
|---|---|
| `--ink` | `--kg-ink` |
| `--bg` | `--kg-canvas` |
| `--bg-card` | `--kg-paper` |
| `--accent` | `--kg-primary` |
| `--accent-light` | `--kg-primary-bright` |
| `--accent-bg` | `--kg-surface-mist` |
| `--warm` | `--kg-primary-bright` |
| `--warm-bg` | Wave Bright at 8% |
| `--line` | `--kg-hairline` |
| `--error` | `--kg-coral` |

---

### Typography Rules

Two fonts only — **never substitute**:
- **Headlines / Display**: `Fraunces, ui-serif, Georgia, serif`
- **Body / UI**: `Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif`

| Role | Font | Size | Weight | Notes |
|---|---|---|---|---|
| Hero display | Fraunces | 64px | 600 | Letter-spacing -0.5px |
| Page title | Fraunces | 36px | 600 | Letter-spacing -0.2px |
| Section head | Fraunces | 28px | 600 | Letter-spacing -0.1px |
| Card title | Fraunces | 21px | 600 | |
| Editorial italic | Fraunces | 21px | 400 italic | Pull-quotes, brand taglines only |
| Eyebrow label | Plus Jakarta Sans | 12px | 600 | +1.5px letter-spacing, UPPERCASE, `--kg-primary-bright` |
| Lead paragraph | Plus Jakarta Sans | 18px | 400 | Line-height 1.55 |
| Body | Plus Jakarta Sans | 16px | 400 | Line-height 1.6 — never go below 1.5 |
| Body small | Plus Jakarta Sans | 14px | 400 | |
| Caption | Plus Jakarta Sans | 13px | 400 | |
| Button | Plus Jakarta Sans | 15px | 600 | |
| Fine print | Plus Jakarta Sans | 12px | 400 | |

**Italic rule**: Fraunces italic is for brand taglines, vision quotes, and the "Go Beyond." continuation only. Never italicize body copy, button labels, or UI controls.

---

### Component Patterns

Every new component must open with an **eyebrow label** above the headline on editorial/marketing surfaces:
```tsx
{/* Eyebrow label — Wave Bright, tracked all-caps */}
<p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--kg-primary-bright)', marginBottom: 8 }}>
  SECTION · LABEL
</p>
{/* Fraunces headline */}
<h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 36, fontWeight: 600, letterSpacing: '-0.2px', color: 'var(--kg-primary-deep)' }}>
  Plan Smart. <em style={{ fontStyle: 'italic', color: 'var(--kg-primary-tint)' }}>Go Beyond.</em>
</h2>
```

#### Button — Primary
```tsx
style={{
  background: 'var(--kg-primary)', color: '#fff',
  fontSize: 15, fontWeight: 600, fontFamily: 'Plus Jakarta Sans, sans-serif',
  padding: '12px 22px', borderRadius: 12, border: 'none', cursor: 'pointer',
}}
// Active: background → var(--kg-primary-deep)
// Focus:  box-shadow → var(--kg-shadow-focus)
```

#### Button — On Dark Panel
```tsx
style={{
  background: 'var(--kg-paper)', color: 'var(--kg-primary-deep)',
  fontSize: 15, fontWeight: 600, padding: '12px 22px', borderRadius: 12,
}}
// Never use --kg-primary (Ocean Blue) on --kg-primary-deep panel — insufficient contrast
```

#### Card — Default (card-plain)
```tsx
style={{
  background: 'var(--kg-paper)',
  borderRadius: 12,
  padding: 24,
  boxShadow: 'var(--kg-shadow-ring)',  // hairline ring, not a drop shadow
}}
```

#### Card — With Accent Stripe (card-accent-left)
```tsx
style={{
  background: 'var(--kg-paper)',
  borderRadius: 8,
  padding: '24px 28px',
  boxShadow: 'var(--kg-shadow-ring)',
  borderLeft: '4px solid var(--kg-primary)',  // 4px Ocean Blue stripe — brand signature
}}
```

#### Card — Sea Mist (card-mist)
```tsx
style={{
  background: 'var(--kg-surface-mist)',
  borderRadius: 12,
  padding: 24,
}}
```

#### Input — Text Field
```tsx
style={{
  background: 'var(--kg-paper)', color: 'var(--kg-ink)',
  fontSize: 16, fontFamily: 'Plus Jakarta Sans, sans-serif',
  border: '1px solid var(--kg-hairline)',
  borderRadius: 8, padding: '12px 14px', height: 44,
  outline: 'none',
}}
// Focus: border-color → var(--kg-primary), box-shadow → var(--kg-shadow-focus)
```

#### Alert — Error
```tsx
style={{
  background: 'var(--kg-coral-soft)',
  borderLeft: '4px solid var(--kg-coral)',
  borderRadius: 8,
  padding: '12px 16px',
}}
// Coral is for errors ONLY — never use for CTAs or promotion
```

#### Hero Panel — Deep Sea
```tsx
style={{
  background: 'var(--kg-primary-deep)',
  color: '#fff',
  borderRadius: 12,
  padding: 48,
}}
// Text colors on dark: rgba(255,255,255,.92) for primary, rgba(168,218,220,.70) for secondary
// Links on dark: var(--kg-primary-tint)
// Button on dark: var(--kg-paper) background with var(--kg-primary-deep) text
```

---

### Hard Rules

1. **Page background is always Warm Sand** (`--kg-canvas`). Pure white (`--kg-paper`) is for elevated surfaces — cards, modals — never full pages.
2. **Ocean Blue (`--kg-primary`) is the only action color**. Wave Bright (`--kg-primary-bright`) is for editorial accents and eyebrow labels — never for CTAs.
3. **Coral (`--kg-coral`) is for errors and destructive actions only**. Never use it for promotions, urgency messaging, or decorative purposes.
4. **No CSS gradients**. Color depth is expressed through neighboring solid surfaces (Deep Sea hero → Warm Sand section → Sea Mist panel), not gradient overlays.
5. **No sharp drop-shadows**. Use `--kg-shadow-ring` (hairline) as default; escalate to `--kg-shadow-soft-1/2/3` only when needed. Max blur: 32px.
6. **Every interactive element must have `--kg-shadow-focus`** as its `:focus-visible` state.
7. **Italic Fraunces is precious**. Use only for brand taglines, vision quotes, and the "Go Beyond." continuation. Never inside buttons, nav, or UI controls.
8. **Eyebrow label above every section title** on marketing/editorial surfaces. `--kg-primary-bright`, 12px, 600, +1.5px letter-spacing, UPPERCASE.
9. **Border-radius 12px (`rounded.md`)** is the default working radius for buttons, cards, and modals. Pill (9999px) is for filter chips and search inputs only.
10. **Icons**: Lucide or Phosphor at 18–20px, stroke 1.5. `--kg-primary` for interactive icons, `--kg-ink-56` for decorative icons.
