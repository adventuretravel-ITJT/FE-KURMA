# FE-KURMA — Frontend Guide

Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4

---

## Project Structure

```
src/
├── app/
│   ├── (admin)/            ← Admin panel (route group, no URL prefix)
│   │   ├── layout.tsx      ← Auth guard + sidebar + topbar wrapper
│   │   └── admin/
│   │       ├── overview/   ← Dashboard
│   │       ├── users/      ← User management + detail [id]
│   │       ├── trips/      ← Trip manager
│   │       ├── destinations/
│   │       ├── templates/
│   │       ├── cms/        ← posts, media, pages (privacy, terms)
│   │       ├── homepage/
│   │       ├── marketing/  ← vouchers, notifications
│   │       ├── affiliates/
│   │       ├── transactions/
│   │       ├── moderation/
│   │       ├── role-management/
│   │       └── settings/   ← audit, config
│   ├── (homepage)/         ← Public-facing homepage
│   ├── auth/               ← Login / register / forgot password
│   ├── dashboard/          ← User-facing trip dashboard
│   └── globals.css         ← Design tokens + global styles
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx   ← Dark sidebar, nav groups, mobile drawer
│   │   ├── AdminTopbar.tsx    ← Sticky topbar: search + notifications
│   │   ├── GlobalSearch.tsx   ← Full-screen search modal (Ctrl+K)
│   │   ├── PagePlaceholder.tsx
│   │   ├── roles/             ← Role management modals
│   │   └── ui/
│   │       ├── Card.tsx
│   │       ├── StatCard.tsx
│   │       ├── Badge.tsx
│   │       ├── PageHeader.tsx
│   │       ├── RichTextEditor.tsx
│   │       └── LegalSectionsEditor.tsx
│   └── (homepage components)
```

---

## Admin Panel — Design System

The admin panel uses a **neutral Polaris-inspired palette** (Shopify-style), completely separate from the homepage warm-sand palette. Tokens are scoped via the `[data-admin]` attribute on the root layout div — the homepage is never affected.

### Layout Structure

```
<div data-admin>                          ← token scope root, bg #f1f1f1
  <AdminSidebar />                        ← fixed, 220px wide, dark #1a1a1a
  <div lg:ml-[220px] flex flex-col>
    <AdminTopbar />                       ← sticky, 52px, white #ffffff
    <main>                                ← page content
      {children}
    </main>
  </div>
</div>
```

On mobile the sidebar is a drawer (slides in from left), the topbar shows with hamburger + KurmaGo logo mark. On desktop the sidebar is always visible and the topbar occupies the remaining width.

### Color Tokens (`[data-admin]` scope in `globals.css`)

| Token | Value | Usage |
|---|---|---|
| `--kg-canvas` | `#f1f1f1` | Page background |
| `--kg-paper` | `#ffffff` | Cards, topbar, dropdowns |
| `--kg-surface-mist` | `#f4f6f8` | Row hover, table header, unread notification bg |
| `--kg-surface-mist-2` | `#e4e7eb` | Deeper hover, skeleton loaders |
| `--kg-ink` | `#1a1a1a` | Primary text |
| `--kg-ink-72` | `#303030` | Heavy secondary text |
| `--kg-ink-56` | `#616161` | Secondary text, captions |
| `--kg-ink-40` | `#8a8a8a` | Placeholder, muted, disabled |
| `--kg-hairline` | `#e1e3e5` | Borders, dividers |
| `--kg-hairline-mist` | `#d2d5d8` | Stronger borders, kbd outlines |
| `--kg-primary` | `#2c6ecb` | Links, active nav, primary buttons |
| `--kg-primary-deep` | `#1a4d8f` | Logo gradient end color |
| `--kg-coral` | `#d72c0d` | Errors, destructive actions |
| `--kg-coral-soft` | `#fef2ee` | Error/destructive backgrounds |

### Sidebar (`AdminSidebar.tsx`)

- Background: `#1a1a1a` (never use CSS token — sidebar sits outside scroll context)
- Width: `220px` via `var(--sidebar)` CSS variable
- Nav items grouped under uppercase section labels (`10px`, `#8a8a8a`)
- **Active item**: `bg: rgba(255,255,255,0.12)`, `color: #ffffff`
- **Hover**: `bg: rgba(255,255,255,0.07)`
- Sub-menu indent: `border-left: 1px solid rgba(255,255,255,0.12)`
- Footer: Help & Docs + Logout (logout hover: red tint `rgba(255,107,107,0.12)`)
- Mobile: `position: fixed`, slides in via `translate-x`, `z-index: 50`; black/50 backdrop at `z-index: 40`

### Topbar (`AdminTopbar.tsx`)

- Height: `52px`, `position: sticky; top: 0; z-index: 50`
- Background: `#ffffff`, `border-bottom: 1px solid #e1e3e5`
- **Search input**: `readOnly`, clicking opens `GlobalSearch` modal; background `#f1f1f1`, hover `#e4e7eb`
- **Notification bell**: dropdown opens downward (`position: absolute; top: calc(100% + 8px); right: 0`), polls `/api/admin/notifications` every 15 s, unread dot `#d72c0d`
- **Mobile only**: hamburger button + KurmaGo "K" mark (`gradient #2c6ecb → #1a4d8f`) + brand name

### Global Search (`GlobalSearch.tsx`)

- Trigger: click topbar search input **or** `Ctrl+K` / `⌘K`
- Modal: `position: fixed`, horizontally centered, `max-width: 580px`, `top: 10vh`
- Backdrop: `rgba(26,26,26,0.5)` with `backdrop-filter: blur(2px)`, `z-index: 1000`
- Searches endpoint: `GET /api/admin/search?q=&type=`
- Result types: `user`, `trip`, `guide` (destination), `page` (legal)
- Filter tabs: Semua / Users / Trips / Destinasi / Halaman
- Keyboard: `↑↓` navigate · `Enter` open · `Esc` close
- Top-right X button closes the modal (no separate footer close)
- Recent searches persisted in `localStorage` key `admin_search_recent`

---

## UI Components (`components/admin/ui/`)

### `Card`

```tsx
<Card padding="md">...</Card>
<CardHeader title="Judul" action={<button>...</button>} />
```

- `padding`: `'none'` | `'sm'` (p-4) | `'md'` (p-5)
- `border-radius: 10px`
- Shadow: `inset 0 0 0 1px #e1e3e5, 0 1px 3px rgba(0,0,0,.06)` — no separate `border` prop

### `StatCard`

```tsx
<StatCard
  label="Total Users"
  value={1240}
  sub="+12 hari ini"
  trend={{ value: 8, positive: true }}
/>
```

- Simple **label / value / sub** stacked layout — no icon box
- `icon` and `color` props accepted but ignored (kept for backward compatibility)
- Trend badge: positive = `color #008060, bg #e3f1df` · negative = `color #d72c0d, bg #fef2ee`

### `Badge`

```tsx
<Badge status="active" config={STATUS_CONFIG} />
<Badge label="Custom" color="#008060" bg="#e3f1df" />
```

Built-in `STATUS_CONFIG`:

| Status | Color | Background |
|---|---|---|
| `draft` | `#616161` | `#f4f6f8` |
| `active` | `#008060` | `#e3f1df` |
| `completed` | `#0044a4` | `#ebf5ff` |

### `PageHeader`

```tsx
<PageHeader
  title="User Management"
  subtitle="Kelola semua pengguna"
  action={<button>...</button>}
  icon={<Users size={18} />}
/>
```

- Title: `#1a1a1a`, 20px bold
- Subtitle / description: `#8a8a8a`, 14px
- Icon (optional): rendered at `#8a8a8a`

---

## Homepage — Design System

The homepage uses a **warm-sand palette** defined in `:root` (globals.css). **Never use these inside admin components.**

Key tokens: `--kg-canvas: #F5F1E8` · `--kg-ink: #0D1B2A` · `--kg-primary: #1E6091` · `--kg-hairline: #E5DFD0`

Fonts: **Fraunces** (serif display, `.font-serif`) + **Plus Jakarta Sans** (body). The admin panel does not use Fraunces anywhere.

---

## Styling Conventions

- **Tailwind** for layout, spacing, flexbox, grid, and responsive utilities (`lg:`, `hidden`, `flex-1`, etc.)
- **Inline `style={}`** for all color values and pixel-precise sizing — avoids Tailwind class purge issues with dynamic/token values
- **No CSS modules** — components are self-contained
- Admin components must only reference the neutral palette; never use `.hp-*` classes or warm-palette tokens
- The sidebar intentionally uses raw hex values (`#1a1a1a`, `rgba(255,255,255,0.12)`) rather than CSS tokens — it lives outside the scrollable content area and has its own dark surface

---

## Auth Flow

1. `POST /api/login` → JWT returned
2. Token saved to both `localStorage` and cookie (`token=...; max-age=14d`)
3. Admin `layout.tsx` validates token on mount; expired → redirect `/auth`
4. Proactive refresh via `POST /api/refresh-token` every 55 min (token TTL = 60 min)
5. Global `window.fetch` interceptor catches 401 → attempts refresh once → redirect on failure
6. Logout: clears localStorage + cookie, redirects to `/auth`

---

## API Base URL

```env
NEXT_PUBLIC_API_URL=http://localhost:8000   # client-side fetches (browser)
API_URL=http://localhost:8000               # server-side (RSC / route handlers)
```

All admin API calls include `Authorization: Bearer <token>` header.
Token read from `localStorage` (client) or cookie (middleware/SSR).
