---
version: alpha
name: KurmaGo
description: An editorial, ocean-quiet interface where Fraunces serif headlines pair with Plus Jakarta Sans body, set on a Warm Sand (#F5F1E8) canvas — never pure white. Deep Sea (#0A3D62) anchors hero panels; Ocean Blue (#1E6091) carries every interactive action; Wave Bright (#2E86AB) tints italic editorial moments and tracked all-caps eyebrows. Cards rest on the canvas with a hairline ring, often marked by a 4px Ocean Blue left stripe. Layouts breathe — Fraunces section numerals appear at corner-of-page scale in Shallow (#A8DADC) tint as decorative atmosphere. The italic Fraunces "Go Beyond." cadence is a brand signature, not a flourish. The aesthetic mirrors the brand: slow, certain, far-reaching.

colors:
  primary: "#1E6091"
  primary-deep: "#0A3D62"
  primary-bright: "#2E86AB"
  primary-tint: "#A8DADC"
  primary-on-dark: "#A8DADC"
  ink: "#0D1B2A"
  ink-muted-72: "#3A4A5C"
  ink-muted-56: "#5C6B7A"
  ink-muted-40: "#8A95A2"
  body: "#0D1B2A"
  body-on-dark: "#FFFFFF"
  body-muted-on-dark: "#A8DADC"
  on-primary: "#FFFFFF"
  on-dark: "#FFFFFF"
  canvas: "#F5F1E8"
  canvas-paper: "#FFFFFF"
  surface-mist: "#E8F4F8"
  surface-mist-deep: "#D6E9EF"
  surface-tint: "#A8DADC"
  surface-deep: "#0A3D62"
  surface-deep-2: "#0D2D49"
  hairline: "#E5DFD0"
  hairline-on-mist: "#C9DDE3"
  hairline-on-dark: "rgba(168, 218, 220, 0.16)"
  divider-soft: "#EDE7D6"
  accent-coral: "#FF6B6B"
  accent-coral-soft: "#FFE5E5"
  focus-ring: "rgba(46, 134, 171, 0.32)"

typography:
  hero-display:
    fontFamily: "Fraunces, ui-serif, Georgia, 'Times New Roman', serif"
    fontSize: 64px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.5px
  hero-display-italic:
    fontFamily: "Fraunces, ui-serif, Georgia, 'Times New Roman', serif"
    fontSize: 64px
    fontWeight: 600
    fontStyle: italic
    lineHeight: 1.05
    letterSpacing: -0.5px
  display-xl:
    fontFamily: "Fraunces, ui-serif, Georgia, serif"
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.3px
  display-lg:
    fontFamily: "Fraunces, ui-serif, Georgia, serif"
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.2px
  display-md:
    fontFamily: "Fraunces, ui-serif, Georgia, serif"
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.1px
  display-sm:
    fontFamily: "Fraunces, ui-serif, Georgia, serif"
    fontSize: 21px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  display-italic:
    fontFamily: "Fraunces, ui-serif, Georgia, serif"
    fontSize: 21px
    fontWeight: 400
    fontStyle: italic
    lineHeight: 1.4
    letterSpacing: 0
  decorative-numeral:
    fontFamily: "Fraunces, ui-serif, Georgia, serif"
    fontSize: 96px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: 0
  lead:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  body:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-emphasis:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  caption:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  eyebrow:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 1.5px
    textTransform: uppercase
  eyebrow-sm:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: 10px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 1.2px
    textTransform: uppercase
  button-label:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: 0
  button-utility:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: 0
  fine-print:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  xxxl: 64px
  section: 96px

shadows:
  none: "none"
  ring-hairline: "0 0 0 1px {colors.hairline}"
  soft-1: "0 1px 2px rgba(13, 27, 42, 0.04), 0 1px 1px rgba(13, 27, 42, 0.06)"
  soft-2: "0 4px 12px rgba(13, 27, 42, 0.06), 0 1px 2px rgba(13, 27, 42, 0.04)"
  soft-3: "0 12px 32px rgba(13, 27, 42, 0.10), 0 2px 6px rgba(13, 27, 42, 0.04)"
  focus-ring: "0 0 0 3px {colors.focus-ring}"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-label}"
    rounded: "{rounded.md}"
    padding: 12px 22px
  button-primary-active:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  button-primary-focus:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    shadow: "{shadows.focus-ring}"
  button-secondary-ghost:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.button-label}"
    rounded: "{rounded.md}"
    padding: 11px 22px
    border: "1px solid {colors.primary}"
  button-tertiary-text:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.button-label}"
    padding: 8px 12px
  button-on-dark:
    backgroundColor: "{colors.canvas-paper}"
    textColor: "{colors.primary-deep}"
    typography: "{typography.button-label}"
    rounded: "{rounded.md}"
    padding: 12px 22px
  button-icon-circular:
    backgroundColor: "{colors.canvas-paper}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    size: 40px
    shadow: "{shadows.ring-hairline}"
  text-link:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.body}"
  text-link-on-dark:
    backgroundColor: transparent
    textColor: "{colors.primary-tint}"
    typography: "{typography.body}"
  eyebrow-label:
    backgroundColor: transparent
    textColor: "{colors.primary-bright}"
    typography: "{typography.eyebrow}"
  eyebrow-label-on-dark:
    backgroundColor: transparent
    textColor: "{colors.primary-tint}"
    typography: "{typography.eyebrow}"
  decorative-section-numeral:
    textColor: "{colors.primary-tint}"
    typography: "{typography.decorative-numeral}"
  editorial-headline-pair:
    textColor: "{colors.primary-deep}"
    typography: "{typography.display-lg}"
  quote-panel-mist:
    backgroundColor: "{colors.surface-mist}"
    textColor: "{colors.primary-deep}"
    typography: "{typography.display-italic}"
    rounded: "{rounded.sm}"
    padding: 28px 32px
    borderLeft: "4px solid {colors.primary}"
  hero-panel-deep:
    backgroundColor: "{colors.surface-deep}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.md}"
    padding: 48px
  card-accent-left:
    backgroundColor: "{colors.canvas-paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: 24px 28px
    borderLeft: "4px solid {colors.primary}"
    shadow: "{shadows.ring-hairline}"
  card-mist:
    backgroundColor: "{colors.surface-mist}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 24px
  card-plain:
    backgroundColor: "{colors.canvas-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 24px
    shadow: "{shadows.ring-hairline}"
  card-elevated:
    backgroundColor: "{colors.canvas-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 24px
    shadow: "{shadows.soft-2}"
  divider-hairline:
    backgroundColor: "{colors.hairline}"
    height: 1px
  sidebar-nav:
    backgroundColor: "{colors.canvas-paper}"
    textColor: "{colors.ink}"
    width: 240px
    borderRight: "1px solid {colors.hairline}"
  sidebar-nav-link:
    backgroundColor: transparent
    textColor: "{colors.ink-muted-72}"
    typography: "{typography.button-utility}"
    rounded: "{rounded.sm}"
    padding: 10px 14px
  sidebar-nav-link-active:
    backgroundColor: "{colors.surface-mist}"
    textColor: "{colors.primary-deep}"
    typography: "{typography.button-utility}"
    rounded: "{rounded.sm}"
    padding: 10px 14px
    borderLeft: "3px solid {colors.primary}"
  bottom-nav-mobile:
    backgroundColor: "{colors.canvas-paper}"
    textColor: "{colors.ink-muted-56}"
    height: 64px
    borderTop: "1px solid {colors.hairline}"
  top-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    height: 64px
    borderBottom: "1px solid {colors.hairline}"
  modal-shell:
    backgroundColor: "{colors.canvas-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 32px
    shadow: "{shadows.soft-3}"
  input-text:
    backgroundColor: "{colors.canvas-paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: 12px 14px
    border: "1px solid {colors.hairline}"
    height: 44px
  input-search:
    backgroundColor: "{colors.surface-mist}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: 10px 18px
    border: "1px solid transparent"
    height: 40px
  chip-filter:
    backgroundColor: "{colors.canvas-paper}"
    textColor: "{colors.ink-muted-72}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: 8px 14px
    border: "1px solid {colors.hairline}"
  chip-filter-selected:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: 8px 14px
  trip-card:
    backgroundColor: "{colors.canvas-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 20px
    shadow: "{shadows.soft-1}"
  place-card:
    backgroundColor: "{colors.canvas-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 16px
    shadow: "{shadows.soft-1}"
  day-section-header:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary-deep}"
    typography: "{typography.display-sm}"
    padding: 16px 0
    borderBottom: "1px solid {colors.hairline}"
  toc-rail-link:
    backgroundColor: transparent
    textColor: "{colors.ink-muted-56}"
    typography: "{typography.body-sm}"
    padding: 8px 16px
    borderLeft: "2px solid transparent"
  toc-rail-link-active:
    backgroundColor: transparent
    textColor: "{colors.primary-deep}"
    typography: "{typography.body-sm}"
    padding: 8px 16px
    borderLeft: "2px solid {colors.primary}"
  city-guide-panel:
    backgroundColor: "{colors.surface-mist}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 24px
    width: 320px
  pro-upsell-prompt:
    backgroundColor: "{colors.canvas-warm}"
    textColor: "{colors.primary-deep}"
    rounded: "{rounded.md}"
    padding: 20px 24px
    borderLeft: "4px solid {colors.primary-bright}"
  alert-error:
    backgroundColor: "{colors.accent-coral-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: 12px 16px
    borderLeft: "4px solid {colors.accent-coral}"
  avatar-circle:
    backgroundColor: "{colors.surface-mist}"
    textColor: "{colors.primary-deep}"
    rounded: "{rounded.full}"
    size: 36px
---

# KurmaGo Design System

## Brand Voice Cues

KurmaGo is a contemplative travel companion. Wisdom over urgency. Depth over distance. The interface is the brand statement: spacious, editorial, and quietly confident. Where most travel SaaS shouts in saturated red gradients, KurmaGo whispers in ocean blue on warm sand — like a printed travel journal that happens to be interactive.

Three rules read like brand law:

1. **Italic Fraunces is the brand's voice — never decoration.** "*Plan Smart. Go Beyond.*" sets the cadence: serif regular for the certain word, italic for the moving word. Every editorial moment, brand quote, or vision statement carries the italic continuation. Italic is reserved; it is never used inside UI controls.
2. **Warm Sand (#F5F1E8) is the canvas, not white.** Pages live on the parchment. White is for cards, modals, and focused content blocks — surfaces that earn elevation by lifting from the warm canvas. A KurmaGo page that defaults to pure white reads as "generic SaaS" instantly.
3. **Coral is for alerts only — never promotion.** The brand never sells through urgency. Coral (#FF6B6B) appears only in error states and destructive confirmations. Pro upsells, premium accents, and promotional moments use Wave Bright + Warm Sand, never red, never gold, never flashing badges.

## Color Palette

The palette is drawn from the ocean — from the deep calm of the abyss to the bright clarity of a shallow lagoon. Blue carries trust, wisdom, and the endurance of the tide. Four ocean depths form the primary ladder; four supporting tones carry the editorial canvas, the highlight panels, and the rare alert.

### Primary — Ocean Ladder

- **Deep Sea** (`{colors.primary-deep}` — #0A3D62): The abyss. Used for hero panels, dark surfaces, vision statements, and any moment the brand wants to feel anchored. Also the ink color of headline text on Warm Sand canvases — Deep Sea reads softer than pure black and ties the type back to the brand.
- **Ocean Blue** (`{colors.primary}` — #1E6091): The brand's primary action color. Every primary CTA, every interactive link, every active state. The "Plan Smart" half of the wordmark sits in Ocean Blue territory. This is the single signal: if it's blue and clickable, it's Ocean Blue.
- **Wave Bright** (`{colors.primary-bright}` — #2E86AB): The italic accent. Used for tracked all-caps eyebrow labels, the italic "Go" half of editorial headlines when a touch of brightness is needed, and secondary highlights. Wave Bright is the brand's "lifted" voice — never an action color, always an editorial one.
- **Shallow** (`{colors.primary-tint}` — #A8DADC): The lagoon. Used as the decorative section numeral color (huge Fraunces "01", "02" at corner of editorial spreads), as muted accents on dark surfaces, and as the soft tint on chips, badges, and supporting backgrounds.

### Supporting — Canvas & Atmosphere

- **Sea Mist** (`{colors.surface-mist}` — #E8F4F8): The highlight panel. Used as the background for editorial quote panels (paired with the 4px Ocean Blue left stripe), table fills, search input fields, and active-state surfaces in the sidebar. Sea Mist is "this content is special, but quietly so."
- **Warm Sand** (`{colors.canvas}` — #F5F1E8): The default page canvas. Every editorial page, every dashboard, every onboarding screen begins on Warm Sand. Pure white is reserved for content cards that need to lift from the canvas. The warm cast (vs. cool gray) is what makes KurmaGo feel like a printed journal rather than a SaaS app.
- **Coral Accent** (`{colors.accent-coral}` — #FF6B6B): Restraint. Used only for error states, destructive confirmation buttons, and validation messages. Never used as a CTA, never used in promotional copy, never paired with "now" or "today" or any urgency language. The brand never sells through alarm.
- **Deep Ink** (`{colors.ink}` — #0D1B2A): Body text on Warm Sand and white. A near-black with a marine blue cast — chosen instead of pure black because pure black on Warm Sand reads as photocopy contrast. Deep Ink is the editorial body voice.

### Text on Light & Dark

- **Body** (`{colors.body}` — #0D1B2A): Default body copy on Warm Sand or white surfaces.
- **Ink Muted 72** (`{colors.ink-muted-72}` — #3A4A5C): Sidebar nav links at rest, secondary body text.
- **Ink Muted 56** (`{colors.ink-muted-56}` — #5C6B7A): Helper copy, captions, inactive TOC entries, day-section secondary text.
- **Ink Muted 40** (`{colors.ink-muted-40}` — #8A95A2): Disabled text, fine-print legal, placeholder copy.
- **Body On Dark** (`{colors.body-on-dark}` — #FFFFFF): All text on Deep Sea hero panels.
- **Body Muted On Dark** (`{colors.body-muted-on-dark}` — #A8DADC): Secondary copy on Deep Sea panels — Shallow tint reads as soft on dark, where pure white would shout.

### Hairlines & Borders

- **Hairline** (`{colors.hairline}` — #E5DFD0): The 1px border on cards sitting on Warm Sand. A warm-cast hairline that ties to the canvas — a cool gray border (#E5E5E5) reads as foreign on Warm Sand and breaks the editorial feel.
- **Hairline On Mist** (`{colors.hairline-on-mist}` — #C9DDE3): The 1px border on cards sitting on Sea Mist surfaces (e.g., inside the City Guide panel).
- **Hairline On Dark** (`rgba(168, 218, 220, 0.16)`): Soft Shallow at low alpha — used as the divider on Deep Sea hero panels.

### The Tide Treatment (Not a Gradient)

KurmaGo does **not** use decorative CSS gradients. The "from the deep abyss to the bright lagoon" metaphor is expressed through *neighboring surfaces* — a Deep Sea hero panel followed by a Warm Sand section followed by a Sea Mist quote panel — not through gradient overlays. Atmosphere comes from the rhythm of solid colors, not from blended pixels. This restraint is what gives the editorial spreads their printed-journal feel; the moment a gradient is introduced, the pages start to feel digital-first again.

## Typography

### Font Family

- **Headline / Display**: `Fraunces, ui-serif, Georgia, serif`. A contemporary variable serif with optical sizing and a true italic. Fraunces carries the editorial voice — every page title, every section head, every brand statement. Italic Fraunces is reserved for editorial moments: taglines, vision quotes, the "Go Beyond." continuation.
- **Body / UI**: `Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif`. A geometric sans with crisp rounding — used for body copy, all UI controls, all functional text, and tracked all-caps eyebrow labels.
- **Pairing rule**: Headlines are always Fraunces. Body and UI are always Plus Jakarta Sans. Never substitute. The serif/sans pairing is the typographic signature.
- **Variable axes**: Fraunces' `opsz` (optical size) and `SOFT` axes are useful — let display sizes auto-scale up `opsz` for tighter letterforms, and dial body sizes back to `opsz: 14` for warmer reading.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 64px | 600 | 1.05 | -0.5px | Landing hero ("Plan Smart.") |
| `{typography.hero-display-italic}` | 64px | 600 italic | 1.05 | -0.5px | The italic continuation ("*Go Beyond.*") |
| `{typography.display-xl}` | 48px | 600 | 1.10 | -0.3px | Brand spread section titles |
| `{typography.display-lg}` | 36px | 600 | 1.15 | -0.2px | Page titles, dashboard headers |
| `{typography.display-md}` | 28px | 600 | 1.25 | -0.1px | Section heads, modal titles |
| `{typography.display-sm}` | 21px | 600 | 1.30 | 0 | Card titles, day-section headers |
| `{typography.display-italic}` | 21px | 400 italic | 1.40 | 0 | Editorial pull-quotes, brand essence lines |
| `{typography.decorative-numeral}` | 96px | 400 | 1.0 | 0 | Corner-of-page section numerals (Shallow tint) |
| `{typography.lead}` | 18px | 400 | 1.55 | 0 | Page intro paragraph under titles |
| `{typography.body}` | 16px | 400 | 1.60 | 0 | Default paragraph copy |
| `{typography.body-emphasis}` | 16px | 600 | 1.50 | 0 | Inline strong emphasis |
| `{typography.body-sm}` | 14px | 400 | 1.55 | 0 | Compact body, table cells, sidebar links |
| `{typography.caption}` | 13px | 400 | 1.40 | 0 | Helper text, sub-labels |
| `{typography.eyebrow}` | 12px | 600 | 1.20 | 1.5px / UPPER | Tracked all-caps section labels |
| `{typography.eyebrow-sm}` | 10px | 600 | 1.20 | 1.2px / UPPER | Page-footer labels, micro-section markers |
| `{typography.button-label}` | 15px | 600 | 1.0 | 0 | Primary button text |
| `{typography.button-utility}` | 14px | 500 | 1.0 | 0 | Sidebar nav, utility buttons |
| `{typography.fine-print}` | 12px | 400 | 1.40 | 0 | Footer body, legal fine-print |

### Principles

- **The Fraunces + Italic Fraunces pair is the brand voice.** "Plan Smart. *Go Beyond.*" — same size, same weight, the italic does the lifting. Reproduce this pairing on every brand surface (landing hero, onboarding hero, brand-moment marketing). The italic half always carries forward motion; the regular half is the steady foundation.
- **Tracked all-caps eyebrows in Wave Bright.** Every section, every category label, every page header opens with a `{typography.eyebrow}` line in `{colors.primary-bright}`. The 1.5px letter-spacing and small size make these read as editorial chapter markers, not as UI labels. They sit above the Fraunces page title with 8–12px of air.
- **Body at 16px, line-height 1.6.** Plus Jakarta Sans needs the relaxed leading to feel editorial; tightening below 1.5 makes the page read as productivity-tool dense. The 16px base is non-negotiable — Apple breaks the convention going up to 17, KurmaGo holds the standard but earns its editorial feel through line-height and the warm canvas.
- **Italic is precious.** Use italic Fraunces only for: brand taglines, vision/mission statement quotes, pull-quotes inside `{component.quote-panel-mist}`, and the "Go" half of the wordmark. Never italicize body copy, never italicize button labels, never italicize for emphasis (use `{typography.body-emphasis}` instead).
- **Two weights per block, max.** A heading + body block uses one Fraunces weight + one Plus Jakarta weight. A heading + body + caption block uses one weight per role. Never mix three sans weights in the same paragraph.
- **Negative tracking on display, zero tracking on body, positive tracking on eyebrows.** Display gets -0.5 to -0.1; body sits at 0; eyebrows get +1.5px (the all-caps signal). Never invert this — positive tracking on display reads as "tech logo," negative tracking on eyebrows kills the editorial cadence.

### Note on Font Substitutes

Fraunces and Plus Jakarta Sans are both Google Fonts (variable, free) and should be self-hosted via `@font-face` with `font-display: swap` for production. When a fallback is needed:

- **For Fraunces**: System serifs are uneven. Georgia is the closest ubiquitous fallback; "Times New Roman" is acceptable but reads colder. Fraunces' italic is unusually rounded and slightly back-leaning — Georgia italic is the closest match. Do not substitute with Playfair Display (too high-contrast) or Merriweather (too dense).
- **For Plus Jakarta Sans**: Inter is the closest open-source equivalent. If substituting, dial line-height up by 0.05 (1.6 → 1.65) — Inter's x-height runs taller and needs more leading.

## Layout

### Spacing System

- **Base unit:** 4px. Structural layout snaps to 8/12/16/24/32.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.xxxl}` 64px · `{spacing.section}` 96px.
- **Section vertical padding:** `{spacing.section}` (96px) on landing/marketing surfaces; `{spacing.xxxl}` (64px) on dashboard pages; `{spacing.xxl}` (48px) inside hero panels.
- **Card padding:** `{spacing.lg}` (24px) inside `{component.card-plain}` and `{component.trip-card}`. `{spacing.md}` (16px) inside compact cards like `{component.place-card}`.
- **Eyebrow → headline gap:** 8–12px (`{spacing.xs}` to `{spacing.sm}`). Tighter than expected — the eyebrow reads as a kicker on the headline, not as a separate paragraph.
- **Headline → body gap:** 16–24px (`{spacing.md}` to `{spacing.lg}`).

### Grid & Container

- **Max content width:** 1200px on dashboard surfaces; 1280px on editorial/marketing spreads (matching the brand book proportion); 720px on text-heavy reading surfaces (legal, blog posts).
- **Three-column itinerary grid:** TOC rail (240px fixed) + Main Content (flexible, ~720px) + City Guide panel (320px fixed). Total ~1280px. The columns are not interchangeable; this layout is a brand-defining pattern for KurmaGo.
- **Two-column dashboard grid:** Sidebar nav (240px fixed) + Main canvas (flexible). Sidebar is always present on desktop; collapses to bottom nav on mobile.
- **Card grid gutters:** `{spacing.lg}` (24px) between cards in dashboard grids; `{spacing.md}` (16px) between place cards in dense lists.

### Whitespace Philosophy

KurmaGo's whitespace is the brand's pause for breath. Every editorial spread opens with at least 96px of clearance above the page title; cards never touch siblings closer than 16px; the City Guide panel maintains 24px of internal padding even on narrow viewports. The wisdom of the turtle is encoded structurally — the layout never rushes.

The exception is the sidebar nav, which goes deliberately dense (10–14px padding, tight stacking) — sidebars are precision navigation, not editorial reading. The footer follows the brand book pattern: tighter columns, larger horizontal gaps, designed to be glanced at as an information architecture overview.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No border, no shadow | Editorial body sections on Warm Sand, hero panels |
| Hairline ring | `0 0 0 1px {colors.hairline}` | `{component.card-plain}`, `{component.card-accent-left}`, default elevation |
| Soft 1 | `{shadows.soft-1}` | Trip cards, place cards at rest — barely lifted |
| Soft 2 | `{shadows.soft-2}` | Dropdowns, popovers, hovered cards |
| Soft 3 | `{shadows.soft-3}` | Modals, toasts, sticky bars over content |
| Focus ring | `{shadows.focus-ring}` | Keyboard focus state on every interactive element |

**Shadow philosophy.** KurmaGo uses **layered, low-contrast shadows**, never sharp drop-shadows. Every shadow is split across two offsets (a 1px close shadow + a wider soft shadow) to read as ambient light rather than as a stamp. The maximum shadow blur is 32px — anything beyond reads as floating-balloon, which breaks the calm-water metaphor.

The default elevation cue is the **hairline ring**, not a shadow. A card with a 1px Hairline border on Warm Sand reads as elevated because the canvas is colored — the same card on pure white would need a shadow to register. This is the structural reason the canvas is Warm Sand.

### Decorative Depth

- **Decorative section numerals** in Shallow tint at corner-of-page scale (Fraunces 96px, `{colors.primary-tint}`) supply atmosphere without imagery. The numerals are decorative — never interactive, never tied to navigation.
- **Sea Mist quote panels** with the 4px Ocean Blue left stripe create a "this is editorial, slow down" cue without needing a shadow.
- **Deep Sea hero panels** establish brand-moment authority through surface-color change alone — no shadow needed; the canvas-to-panel color jump is the elevation.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed editorial sections, dividers |
| `{rounded.xs}` | 4px | Tags inside dense tables, micro-chips |
| `{rounded.sm}` | 8px | Inputs, quote panels, accent-left cards (subtle round) |
| `{rounded.md}` | 12px | Default for buttons, cards, modals — the brand's working radius |
| `{rounded.lg}` | 16px | Trip cards, modal shells, prominent containers |
| `{rounded.xl}` | 24px | Hero panels, large editorial cards |
| `{rounded.pill}` | 9999px | Filter chips, search inputs, status tags |
| `{rounded.full}` | 9999px / 50% | Avatars, circular icon buttons, the turtle-shell motif |

The brand's working radius is **12px (`{rounded.md}`)** — soft enough to feel friendly, restrained enough to feel editorial. Apple uses pill radius as its action signal; KurmaGo's signal is the *combination* of 12px corners + Ocean Blue fill. Pill radius is reserved for tags, filter chips, and the search input — controls that should read as "selectable token," not "primary action."

### The Turtle-Shell Circle

Circular forms (`{rounded.full}`) are a deliberate brand motif — the wordmark's accent dot, avatars, brand-icon badges, the eSIM coverage indicators. The circle is the turtle's shell: balanced, whole, moving in still waters. Use circles where the metaphor lands; do not force it onto controls that should read as rectangular (cards, modals, inputs).

### Photography Geometry

- **Place cards**: 4:3 photo crop at `{rounded.sm}` (8px) inner radius, sitting inside a `{rounded.md}` (12px) card.
- **Hero imagery**: 16:9 on landing, 21:9 on editorial spreads. Always corner-rounded at `{rounded.lg}` or `{rounded.xl}` — never edge-to-edge.
- **City guide panel imagery**: 1:1 squares at `{rounded.sm}` (8px), small thumbnail scale.
- **Avatars**: 1:1 squares cropped to `{rounded.full}` — the circle is non-negotiable for human portraits.

## Components

### Brand Patterns

**`editorial-headline-pair`** — The brand's signature typography moment. A two-part headline where the first half is Fraunces Regular and the second half is Fraunces Italic, both at the same size, both in `{colors.primary-deep}`. Examples: "Plan Smart. *Go Beyond.*", "Words with weight and *wander.*", "Built for travelers who *go with purpose.*" — used at `{typography.hero-display}` for landing heroes and `{typography.display-lg}` for page titles. The italic always carries the forward-motion word; the regular half is the steady foundation.

**`decorative-section-numeral`** — Huge Fraunces numerals ("01", "02", "03") in `{colors.primary-tint}` (Shallow) at `{typography.decorative-numeral}` (96px), positioned at the top-right of editorial spreads. Functions as decorative atmosphere, not navigation. Never clickable, never tied to a TOC link. The Shallow tint keeps it as ambience rather than a competing visual.

**`eyebrow-label`** — Tracked all-caps label in `{colors.primary-bright}` (Wave Bright) at `{typography.eyebrow}` (12px / 600 / +1.5px tracking / UPPERCASE). Sits above page titles and section heads with 8–12px of air. The brand's chapter-marker device — every editorial spread, every dashboard section, every modal opens with one. Optional decorative center-dot separator (`·`) for multi-part labels: "PRIMARY · HERO", "01 · SIMPLIFY".

**`quote-panel-mist`** — Editorial pull-quote container. Background `{colors.surface-mist}` (Sea Mist), 4px solid `{colors.primary}` left border, rounded `{rounded.sm}` (8px), padding 28px × 32px. Content: optional `{component.eyebrow-label}` on top, italic quote in `{typography.display-italic}` (Fraunces 21px italic), optional attribution. Used for brand essence lines, vision statements, positioning quotes — anywhere the brand wants to slow the reader down.

**`hero-panel-deep`** — Brand-moment authority surface. Background `{colors.surface-deep}` (Deep Sea #0A3D62), text `{colors.on-dark}`, rounded `{rounded.md}` (12px), padding 48px. Content stack: `{component.eyebrow-label-on-dark}` in Shallow tint → italic Fraunces vision/quote in white → optional `{component.button-on-dark}`. Used on landing pages for vision/mission moments and on dashboard onboarding for first-impression brand surfaces.

### Cards & Containers

**`card-accent-left`** — The brand book's signature card pattern. Background `{colors.canvas-paper}` (white), 4px solid `{colors.primary}` left stripe, rounded `{rounded.sm}` (8px), padding 24px × 28px, hairline ring (`{shadows.ring-hairline}`). Content stack: optional `{component.eyebrow-label}` → Fraunces card title in `{typography.display-sm}` → body copy. Used for Brand Truth / Promise / Objective cards, mission commitment cards, value cards, feature blocks. The 4px stripe is what makes the card "a KurmaGo card" rather than a generic card.

**`card-mist`** — Sea Mist tinted container. Background `{colors.surface-mist}` (#E8F4F8), no border, rounded `{rounded.md}` (12px), padding 24px. Used for tip blocks, City Guide internal sections, helper-content cards. Reads as "supporting context," not as primary content.

**`card-plain`** — Default white card on Warm Sand. Background `{colors.canvas-paper}` (white), hairline ring (`{shadows.ring-hairline}`), rounded `{rounded.md}` (12px), padding 24px. The workhorse — used for dashboard sections, content blocks, anywhere a card is needed without an editorial accent.

**`card-elevated`** — Lifted card with `{shadows.soft-2}`, no border, rounded `{rounded.lg}` (16px). Used sparingly — for the focus card on a dashboard, for booking-reference cards, for any moment a card should read as "this is the active item."

**`trip-card`** — Dashboard active-state card. Background `{colors.canvas-paper}`, rounded `{rounded.lg}` (16px), padding 20px, `{shadows.soft-1}`. Top: trip cover image (16:9, `{rounded.sm}` inner radius). Below: destination + dates in `{typography.eyebrow}`, trip name in Fraunces `{typography.display-sm}`, day count + collaborators in `{typography.caption}` `{colors.ink-muted-56}`.

**`empty-state-card`** — Dashboard empty-state container. Background `{colors.canvas}` (Warm Sand, same as page — the card disappears into the canvas), generous padding (48px × 32px), centered content stack: editorial Fraunces headline, lead paragraph, primary CTA. The "card" is structural framing, not visual elevation — emptiness is part of the brand voice.

**`place-card`** — Itinerary place tile. Background `{colors.canvas-paper}`, rounded `{rounded.md}` (12px), padding 16px, `{shadows.soft-1}`. Top: 4:3 photo at `{rounded.sm}` inner radius. Below: place name in `{typography.body-emphasis}`, category + duration in `{typography.caption}` `{colors.ink-muted-56}`, optional Kurma tip in italic Fraunces `{typography.display-italic}` at 14px (a small, deliberate echo of the brand voice inside dense UI).

**`day-section-header`** — Itinerary day-block header. Sticky/anchored heading: Fraunces `{typography.display-sm}` ("Day 3 — *Kyoto*"), italic city name as the editorial accent. Hairline border-bottom in `{colors.hairline}`. Below the header: collapsible content area for places, activities, transport.

**`city-guide-panel`** — The right-rail panel on the itinerary builder. Background `{colors.surface-mist}`, rounded `{rounded.md}`, width 320px. Content stack: `{component.eyebrow-label}` → city name in `{typography.display-md}` → city overview body → tip cards in `{component.card-mist}` variants nested inside. Auto-syncs to currently visible day via IntersectionObserver — no polling.

**`pro-upsell-prompt`** — Free → Pro contextual nudge. Background `{colors.canvas-warm}` (Warm Sand — even though it's the page canvas, here it sits on a white card or modal), 4px `{colors.primary-bright}` (Wave Bright) left stripe, rounded `{rounded.md}`, padding 20px × 24px. Content: `{component.eyebrow-label}` ("UPGRADE · PRO"), Fraunces headline in `{typography.display-sm}`, body copy explaining the unlocked capability, `{component.button-primary}` ("Try Pro Free"). The Wave Bright stripe (not Ocean Blue) signals "premium / aspirational" — a deliberately quieter cue than primary actions. **Never uses Coral, gold, or saturated promotional colors.**

### Buttons

**`button-primary`** — The KurmaGo action. Background `{colors.primary}` (Ocean Blue #1E6091), text `{colors.on-primary}` in `{typography.button-label}` (Plus Jakarta Sans 15px / 600), rounded `{rounded.md}` (12px), padding 12px × 22px. The 12px corner is the brand's working radius — softer than pill, more confident than sharp. Active state: `{component.button-primary-active}` darkens to Deep Sea (#0A3D62), no scale transform. Focus state: `{shadows.focus-ring}` (3px Wave Bright at 32% alpha).

**`button-secondary-ghost`** — The companion CTA. Background transparent, text `{colors.primary}` in `{typography.button-label}`, 1px solid `{colors.primary}` border, rounded `{rounded.md}`, padding 11px × 22px (1px less to match the bordered total height). Used as the second CTA paired with `{component.button-primary}` ("Learn More" / "Start Planning").

**`button-tertiary-text`** — Quiet text button. Background transparent, text `{colors.primary}`, no border, padding 8px × 12px. Used for low-emphasis actions inside forms ("Cancel", "Skip") and inline navigation.

**`button-on-dark`** — Primary CTA on Deep Sea hero panels. Background `{colors.canvas-paper}` (white), text `{colors.primary-deep}` in `{typography.button-label}`, rounded `{rounded.md}`, padding 12px × 22px. The inverse of `{component.button-primary}` — white pill on dark, never blue-on-dark (Ocean Blue on Deep Sea has insufficient contrast).

**`button-icon-circular`** — Floating utility action. 40 × 40px, background `{colors.canvas-paper}`, hairline ring, icon in `{colors.primary}`, rounded `{rounded.full}`. Used for share, more-actions, close-modal, and as the "+" add-item button in the itinerary builder. The circle reinforces the turtle-shell motif.

**`text-link`** — Inline link. Color `{colors.primary}`, no underline at rest, underline on focus. Used inline in body copy — never used in lists or as standalone CTAs (those use a button variant).

**`text-link-on-dark`** — Inline link on Deep Sea panels. Color `{colors.primary-tint}` (Shallow #A8DADC) — Ocean Blue would disappear against the dark surface.

### Inputs & Forms

**`input-text`** — Default form input. Background `{colors.canvas-paper}`, text `{colors.ink}` in `{typography.body}`, 1px `{colors.hairline}` border, rounded `{rounded.sm}` (8px), padding 12px × 14px, height 44px. Focus state adds `{shadows.focus-ring}` and replaces the hairline with `{colors.primary}` border.

**`input-search`** — Search field, pill-shaped to read as "filter / find." Background `{colors.surface-mist}`, text `{colors.ink}` in `{typography.body-sm}`, rounded `{rounded.pill}`, padding 10px × 18px, height 40px. Leading search icon at 14px in `{colors.ink-muted-56}`.

**`chip-filter`** — Selectable category chip. Background `{colors.canvas-paper}`, text `{colors.ink-muted-72}` in `{typography.body-sm}`, 1px `{colors.hairline}` border, rounded `{rounded.pill}`, padding 8px × 14px. Selected state (`{component.chip-filter-selected}`) flips to background `{colors.primary-deep}` + text `{colors.on-dark}`, no border. Used for "Food / Culture / Nature / Shopping" place filters.

**`alert-error`** — Error message strip. Background `{colors.accent-coral-soft}` (#FFE5E5), 4px solid `{colors.accent-coral}` left stripe, rounded `{rounded.sm}`, padding 12px × 16px. Used only for validation errors and destructive-confirmation warnings. Never repurposed as a promotional or informational banner.

### Top Navigation & Sidebar

**`sidebar-nav`** — Persistent left sidebar on desktop dashboard surfaces. Width 240px, background `{colors.canvas-paper}` (white — the sidebar lifts off the Warm Sand canvas through surface contrast), 1px `{colors.hairline}` right border. Top: KurmaGo wordmark with 24px padding. Middle: stack of `{component.sidebar-nav-link}` entries. Bottom: user avatar + name + plan badge.

**`sidebar-nav-link`** — Inactive link. Background transparent, text `{colors.ink-muted-72}` in `{typography.button-utility}` (14px / 500), rounded `{rounded.sm}`, padding 10px × 14px, leading icon at 18px.

**`sidebar-nav-link-active`** — Active state. Background `{colors.surface-mist}` (Sea Mist), text `{colors.primary-deep}`, 3px solid `{colors.primary}` left border (shifted to internal padding so the right edge stays clean). The active link reads as "you are here, breathing in Sea Mist."

**`bottom-nav-mobile`** — Mobile bottom navigation, 64px tall, background `{colors.canvas-paper}`, 1px top border in `{colors.hairline}`. 4 destinations: Home, Trips, Discover, Profile. Active destination: icon + label in `{colors.primary-deep}`, inactive in `{colors.ink-muted-56}`.

**`top-bar`** — Optional top bar above the main canvas (desktop). Background `{colors.canvas}` (Warm Sand — matches page, not white sidebar), 64px tall, 1px hairline bottom border. Contains breadcrumbs, page actions, search.

### Modals

**`modal-shell`** — Modal container. Background `{colors.canvas-paper}`, rounded `{rounded.lg}` (16px), padding 32px, `{shadows.soft-3}`. Centered relative to the **content area**, not the full viewport — `left: calc(var(--sidebar-width) + 50%)` to avoid sidebar overlap. Backdrop: `rgba(13, 27, 42, 0.48)` (Deep Ink at 48% alpha — tied to the brand text color, not generic black).

**`modal-step-indicator`** — Multi-step progress dots for the 2-step New Trip modal. Inactive dots: 8px `{colors.hairline}` filled circle. Active dot: 8px `{colors.primary}` filled circle with 12px outer ring in `{colors.surface-mist}`. Connecting line in `{colors.hairline}`.

### Footer

**`footer`** — Background `{colors.canvas}` (Warm Sand — the footer continues the page canvas), text `{colors.ink-muted-72}`. Link columns in `{typography.body-sm}` with 1.6 line-height. Column headings in `{typography.eyebrow}` (Wave Bright tracked all-caps). Legal row at the very bottom in `{typography.fine-print}` with `{colors.ink-muted-40}`. Vertical padding `{spacing.xxxl}` (64px). The wordmark sits at the top-left of the footer, paired with a small `{component.eyebrow-sm}` line ("PLAN SMART · GO BEYOND") underneath.

## Logo System

The KurmaGo logo asset is in development. Until shipped, the brand book defines the construction logic for any provisional rendering:

- **Wordmark composition**: "Kurma" set in Fraunces SemiBold at the brand's display size, in `{colors.primary-deep}` (Deep Sea); "Go" set in Fraunces SemiBold *Italic* at the same size, in `{colors.primary-bright}` (Wave Bright); a closing period `.` in `{colors.primary-deep}`. The italic + lighter blue on "Go" carries the brand's forward-motion cue inside the wordmark itself.
- **Accent dot**: A small filled circle in `{colors.primary-deep}` positioned above the "K" — references the turtle-shell circle that opens the brand book. Roughly 18% of the cap-height of "K", offset slightly to the upper-left.
- **Three approved variants**:
  - **Primary · Light** — for use on `{colors.canvas-paper}` (white) and `{colors.canvas}` (Warm Sand) backgrounds.
  - **Reverse · Dark** — wordmark inverts: "Kurma" in white, "Go" in `{colors.primary-tint}` (Shallow), accent dot in white. For use on `{colors.surface-deep}` (Deep Sea) backgrounds.
  - **Soft · Mist** — for use on `{colors.surface-mist}` (Sea Mist) backgrounds, same colors as Primary · Light (the contrast holds on Sea Mist).
- **Clear space**: minimum clear space equal to the height of the "K" cap on all four sides.
- **Minimum size**: 96px wordmark width at digital scale; below this, switch to the standalone accent-dot mark (in development).

Once the final SVG asset is delivered by the brand team, replace any provisional renderings — do not let the placeholder become permanent.

## Do's and Don'ts

### Do

- Set the page canvas to `{colors.canvas}` (Warm Sand) by default. Pure white is for cards and modals.
- Open every section with `{component.eyebrow-label}` in Wave Bright tracked all-caps + `{component.editorial-headline-pair}` in Fraunces. The two together are the brand's chapter device.
- Pair Fraunces Regular and Fraunces Italic in display headlines ("Plan Smart. *Go Beyond.*") — the italic carries the forward-motion word.
- Use `{colors.primary}` (Ocean Blue) for every primary action; use `{colors.primary-bright}` (Wave Bright) for editorial accents and Pro upsells. Keep these two roles separate.
- Use the 4px Ocean Blue left stripe on `{component.card-accent-left}` and `{component.quote-panel-mist}` — the stripe is the brand's most identifiable card-level signature.
- Reserve `{component.decorative-section-numeral}` (huge Fraunces in Shallow tint) for editorial spreads and brand-moment surfaces. It's atmosphere, not UI.
- Apply `{shadows.ring-hairline}` as the default elevation cue. Cards lift through the warm canvas / hairline contrast, not through drop-shadows.
- Use circular forms (`{rounded.full}`) for avatars, brand-icon badges, and accent dots — the turtle-shell motif. Resist the urge to circle every UI element.

### Don't

- Don't default the page background to pure white. The brand canvas is Warm Sand. Pure white reads as "generic SaaS" and breaks the editorial feel instantly.
- Don't use Coral (`{colors.accent-coral}`) as a CTA, promotional accent, or attention-grabber. Coral is for errors only. Pro / premium / promotional moments use Wave Bright + Warm Sand.
- Don't italicize body copy, button labels, or UI controls. Italic Fraunces is reserved for editorial moments.
- Don't introduce decorative CSS gradients. The "ocean depths" metaphor lives in *neighboring solid surfaces*, not in blended pixels.
- Don't pair Fraunces with anything other than Plus Jakarta Sans. The serif/sans pairing is the typographic signature.
- Don't tighten body line-height below 1.5 — Plus Jakarta Sans needs the relaxed leading to read as editorial. Tight body kills the brand voice.
- Don't use sharp drop-shadows or single-offset shadows. KurmaGo shadows are split across two offsets, low contrast, never beyond 32px blur.
- Don't put `{component.button-primary}` (Ocean Blue) on a Deep Sea panel — contrast is insufficient. Use `{component.button-on-dark}` (white pill) instead.
- Don't use eyebrow labels at sizes other than `{typography.eyebrow}` (12px) or `{typography.eyebrow-sm}` (10px). Larger tracked all-caps reads as a logo, not as a kicker.
- Don't omit the `{component.eyebrow-label}` above section titles on editorial surfaces. The eyebrow is the brand's chapter marker — without it, the page reads as "untitled section."

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Small phone | ≤ 419px | Single-column stack; sidebar collapses to bottom nav; `{typography.hero-display}` drops to 36px; section padding tightens to 48px |
| Phone | 420–640px | Single-column; place cards become single-column; itinerary 3-column collapses to single column with City Guide as bottom-sheet |
| Large phone | 641–767px | Tighter card padding (16px vs 24px); decorative section numeral hides on mobile editorial surfaces |
| Tablet portrait | 768–1023px | Sidebar nav collapses to icon-only rail (64px); 2-column card grids |
| Tablet landscape | 1024–1199px | Sidebar nav returns expanded; itinerary 3-column shows TOC + Content (City Guide as toggleable drawer) |
| Desktop | 1200–1439px | Full 3-column itinerary layout (TOC 240 + Content flex + Guide 320) |
| Wide desktop | ≥ 1440px | Content locks at 1280–1400px; canvas margins absorb extra width |

The structural breakpoints that matter for IT: 1200px (full itinerary 3-column appears), 1024px (sidebar returns), 768px (sidebar → icon rail), 640px (single-column collapse).

### Touch Targets

- Minimum 44 × 44px on all interactive elements. `{component.button-primary}` lands at 44px tall (12px × 2 + 15px line-height + buffer).
- `{component.button-icon-circular}` is exactly 40 × 40px; on mobile, increase to 44 × 44px.
- Sidebar nav links use 40px target on desktop (precision navigation); bottom nav mobile uses full 64px height.

### Collapsing Strategy

- **Sidebar nav**: Full 240px expanded → icon-only 64px rail at 768px → bottom nav at 640px.
- **Three-column itinerary**: TOC + Content + Guide → TOC + Content (Guide as toggleable drawer) at 1024px → Content only (TOC and Guide as bottom sheets) at 640px.
- **Editorial spreads**: Two-column card grids → single-column at 640px; decorative section numerals hide entirely below 768px (they're decorative atmosphere, not content).
- **Hero typography**: `{typography.hero-display}` (64px) → 48px at 1024px → 36px at 640px.
- **Eyebrow labels** never collapse — they remain at 12px / +1.5px tracking across all breakpoints. They are part of the brand's chapter rhythm.

### Image Behavior

- All photography uses responsive `srcset` with breakpoint-matched crops.
- Place card photos maintain 4:3 ratio across breakpoints; only scale changes.
- Hero imagery may switch art direction at mobile (a 16:9 desktop hero crops to 4:5 portrait on mobile to keep the subject framed).
- Lazy-loading is default; the above-the-fold landing hero loads eagerly.
- Avatar circles maintain 1:1 source crop; rendering radius is `{rounded.full}`.

## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key directly (`{component.card-accent-left}`, `{component.quote-panel-mist}`).
2. Variants of an existing component (`-active`, `-focus`, `-on-dark`) live as separate entries in `components:`.
3. Use `{token.refs}` everywhere — never inline hex.
4. Never document hover. Default and Active/Pressed/Focus states only — KurmaGo is mobile-first, hover is not a primary input.
5. Display headlines stay Fraunces Regular/Italic. Body and UI stay Plus Jakarta Sans. The boundary is unbreakable.
6. The page canvas is Warm Sand. White is for elevated surfaces. This rule is the single most important brand-vs-generic-SaaS distinction.
7. The eyebrow-label + editorial-headline-pair combo opens every section. If a new screen lacks one, it's missing the brand's chapter device.
8. When in doubt about emphasis: lift the card with `{shadows.ring-hairline}` first; only escalate to `{shadows.soft-1}` or `{shadows.soft-2}` if the lift isn't reading.
9. Wave Bright is for editorial accents and Pro upsells. Ocean Blue is for actions. Don't blur the two.
10. Italic Fraunces is precious. Used too often, it stops feeling editorial and starts feeling decorative. Audit every italic usage — if it's not a brand quote, tagline, or vision moment, it shouldn't be italic.

## Known Gaps

- **Logo asset**: The wordmark + accent-dot SVG is in development. Section "Logo System" defines the construction logic for provisional renderings — replace with the official asset once delivered.
- **Form validation states beyond error**: Success and warning states are not yet documented. Recommended: success uses `{colors.primary-bright}` (Wave Bright) on a `{colors.surface-mist}` background; warning uses `{colors.canvas-warm}` with a dark amber stripe (token to be defined).
- **Dark mode**: KurmaGo is daytime/light-first by default — the brand book and PRD do not surface a dark-mode counterpart. A future dark-mode pass would invert the canvas to `{colors.primary-deep}` (Deep Sea) with `{colors.primary-tint}` accents, but the surface tokens are not yet defined.
- **Iconography system**: The brand book uses geometric Unicode glyphs (◈ ◉ ▲ ◊ △) as decorative section markers. A formal icon library (line weight, stroke, corner radius) is not yet specified — interim guidance is to use Lucide or Phosphor at 18–20px stroke 1.5, in `{colors.primary}` for interactive icons and `{colors.ink-muted-56}` for decorative icons.
- **Motion & animation**: Transition curves and durations are not yet documented. Interim guidance: ease-out at 200ms for state changes; ease-in-out at 300ms for layout shifts; respect `prefers-reduced-motion`. The brand voice ("slow, certain, far-reaching") suggests deliberately calm easing — never bounce or overshoot.
- **Pro tier visual differentiation**: The brand intentionally avoids gold/glitter Pro accents. The Wave Bright + Warm Sand pairing in `{component.pro-upsell-prompt}` is the documented approach, but a more comprehensive Pro design language (premium card variant, Pro badge, post-conversion delight moments) is not yet specified.
- **Photography direction**: The brand book describes editorial atmosphere but does not specify a photography style guide (color grading, subject framing, location curation). Interim: prefer documentary travel photography over staged stock; favor cooler color grading that ties to the ocean palette; humans appear in environment, not as posed subjects.
