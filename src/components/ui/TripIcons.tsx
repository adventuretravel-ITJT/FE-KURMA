/**
 * SVG icon library for trip-related UI.
 * All icons use a consistent 16×16 viewBox, stroke-based, no fill.
 */

const S = {
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    style: { width: 16, height: 16 },
}

/* ── Activity icons ─────────────────────────────── */

export const IconCultureHistory = (
    <svg {...S}>
        {/* Temple / columns */}
        <path d="M2 14h12" />
        <path d="M8 3L1.5 7.5h13L8 3z" />
        <path d="M4.5 7.5V14M8 7.5V14M11.5 7.5V14" />
    </svg>
)

export const IconLocalFood = (
    <svg {...S}>
        {/* Fork left, knife right */}
        <path d="M5.5 1.5v4.5M3.5 1.5v3a2 2 0 004 0v-3" />
        <path d="M5.5 6v8" />
        <path d="M11 1.5c1.5 0 2.5 1 2.5 2.5v3l-1.25 1V14" />
    </svg>
)

export const IconNature = (
    <svg {...S}>
        {/* Leaf */}
        <path d="M13 3C8 3 3.5 7.5 3.5 13" />
        <path d="M3.5 13C3.5 8 8 3 13 3" />
        <path d="M3.5 13l3.5-4" />
    </svg>
)

export const IconShopping = (
    <svg {...S}>
        {/* Shopping bag */}
        <path d="M3.5 6.5h9L11 13.5H5L3.5 6.5z" />
        <path d="M6 6.5V5.5a2 2 0 014 0v1" />
        <path d="M6.5 10h3" />
    </svg>
)

export const IconSightseeing = (
    <svg {...S}>
        {/* Camera */}
        <rect x="1.5" y="5.5" width="13" height="9" rx="1.5" />
        <path d="M5.5 5.5V4.5a1 1 0 011-1h3a1 1 0 011 1v1" />
        <circle cx="8" cy="10" r="2.5" />
    </svg>
)

export const IconThemeParks = (
    <svg {...S}>
        {/* Ticket */}
        <rect x="1.5" y="5.5" width="13" height="5" rx="1.5" />
        <path d="M6 5.5v5" />
        <path d="M3 8h1.5M10.5 8H12" />
    </svg>
)

/* ── Pace icons ─────────────────────────────────── */

export const IconPaceEasy = (
    <svg {...S}>
        {/* Feather / leaf — relaxed */}
        <path d="M13 3c-5 0-9 4-9 9" />
        <path d="M13 3C13 8 9 12 4 12" />
        <path d="M4 12l-2 2" />
        <path d="M7 9l-1.5 1.5" />
    </svg>
)

export const IconPaceBalanced = (
    <svg {...S}>
        {/* Balance scale */}
        <path d="M8 2v12" />
        <path d="M3 5h10" />
        <path d="M2.5 5l2.5 4H2.5L5 5z" />
        <path d="M13.5 5l-2.5 4h5l-2.5-4z" />
        <path d="M6 14h4" />
    </svg>
)

export const IconPacePacked = (
    <svg {...S}>
        {/* Lightning bolt */}
        <path d="M9.5 2L4 9h5.5L5.5 14 12 7H6.5L9.5 2z" />
    </svg>
)

/* ── Budget icons ───────────────────────────────── */

export const IconBudgetBackpacker = (
    <svg {...S}>
        {/* Backpack */}
        <rect x="4" y="4.5" width="8" height="9.5" rx="2" />
        <path d="M4 8.5h8" />
        <path d="M7 4.5V3a1 1 0 012 0v1.5" />
        <path d="M6.5 11h3" />
        <path d="M10 4.5V6" />
    </svg>
)

export const IconBudgetSmart = (
    <svg {...S}>
        {/* Shield with checkmark */}
        <path d="M8 1.5l5 2v4c0 3.3-2.3 5.5-5 6.5-2.7-1-5-3.2-5-6.5v-4l5-2z" />
        <path d="M5.5 8l2 2 3-3.5" />
    </svg>
)

export const IconBudgetComfort = (
    <svg {...S}>
        {/* House */}
        <path d="M2 8l6-5.5L14 8" />
        <path d="M3.5 7v7h9V7" />
        <path d="M6.5 14V10.5h3V14" />
    </svg>
)

export const IconBudgetSplurge = (
    <svg {...S}>
        {/* Gem / diamond */}
        <path d="M8 13.5L3.5 7l1.5-3h6l1.5 3L8 13.5z" />
        <path d="M3.5 7h9" />
        <path d="M5 4l1 3M11 4l-1 3M8 4l-1 3M8 4l1 3" />
    </svg>
)

/* ── Special needs icons ────────────────────────── */

export const IconHalal = (
    <svg {...S}>
        {/* Crescent moon */}
        <path d="M12.5 8A5.5 5.5 0 016 13.5 5.5 5.5 0 018 2.5 7 7 0 0112.5 8z" />
    </svg>
)

export const IconAccessibility = (
    <svg {...S}>
        {/* Wheelchair */}
        <circle cx="8" cy="3" r="1.5" />
        <path d="M8 4.5V9l3 1.5" />
        <path d="M8 9l-2 3" />
        <circle cx="6" cy="13.5" r="1.5" />
        <circle cx="11" cy="13.5" r="1.5" />
        <path d="M9 6.5h3" />
        <path d="M9.5 9l1.5 2.5" />
    </svg>
)

export const IconStroller = (
    <svg {...S}>
        {/* Baby stroller */}
        <path d="M2.5 5h5.5v4.5a3 3 0 01-6 0A1.5 1.5 0 012.5 8V5z" />
        <path d="M8 7.5l4-5" />
        <path d="M12 2.5h1.5" />
        <circle cx="4" cy="13.5" r="1.5" />
        <circle cx="9" cy="13.5" r="1.5" />
        <path d="M2.5 12h8" />
    </svg>
)

export const IconVegetarian = (
    <svg {...S}>
        {/* Seedling */}
        <path d="M8 14.5V8" />
        <path d="M8 8C8 5 11.5 3 11.5 3S11.5 6.5 8 8" />
        <path d="M8 8C8 5 4.5 3 4.5 3S4.5 6.5 8 8" />
        <path d="M5 11c1-1 2-2 3-3" />
    </svg>
)

export const IconInstagrammable = (
    <svg {...S}>
        {/* Camera with sparkle */}
        <rect x="1.5" y="5" width="11" height="8.5" rx="1.5" />
        <path d="M5.5 5V4a1 1 0 011-1h2a1 1 0 011 1v1" />
        <circle cx="7" cy="9" r="2" />
        <path d="M13.5 4l.5 1.5M14 5.5l1.5.5M15.5 6l-1.5.5M14 7l-.5-1.5" />
    </svg>
)

export const IconOffBeatenPath = (
    <svg {...S}>
        {/* Compass */}
        <circle cx="8" cy="8" r="6" />
        <path d="M8 4.5v1M8 10.5v1M4.5 8h1M10.5 8h1" />
        <path d="M10.5 5.5l-1.5 3.5-3.5 1.5 1.5-3.5 3.5-1.5z" />
    </svg>
)

/* ── Travel type icons ──────────────────────────── */

export const IconTravelSolo = (
    <svg {...S}>
        <circle cx="8" cy="5.5" r="2.5" />
        <path d="M3 14.5c0-2.8 2.2-5 5-5s5 2.2 5 5" />
    </svg>
)

export const IconTravelCouple = (
    <svg {...S}>
        <circle cx="5.5" cy="5" r="2" />
        <path d="M1.5 14c0-2.2 1.8-4 4-4" />
        <circle cx="10.5" cy="5" r="2" />
        <path d="M14.5 14c0-2.2-1.8-4-4-4" />
        <path d="M5.5 10C6.8 9.5 9.2 9.5 10.5 10" />
        <path d="M8 10v4" />
    </svg>
)

export const IconTravelFamily = (
    <svg {...S}>
        <circle cx="4" cy="4" r="1.8" />
        <circle cx="12" cy="4" r="1.8" />
        <circle cx="8" cy="5.5" r="1.4" />
        <path d="M1.5 14c0-2 1.3-3.5 2.5-3.5" />
        <path d="M14.5 14c0-2-1.3-3.5-2.5-3.5" />
        <path d="M5.5 14c0-1.5 1.1-2.5 2.5-2.5s2.5 1 2.5 2.5" />
    </svg>
)

export const IconTravelGroup = (
    <svg {...S}>
        <circle cx="3" cy="5" r="1.8" />
        <circle cx="8" cy="4" r="2" />
        <circle cx="13" cy="5" r="1.8" />
        <path d="M0.5 14c0-1.8 1.1-3.2 2.5-3.2" />
        <path d="M5.5 14c0-2 1.1-3.5 2.5-3.5s2.5 1.5 2.5 3.5" />
        <path d="M15.5 14c0-1.8-1.1-3.2-2.5-3.2" />
    </svg>
)

/* ── File type icons ────────────────────────────── */

export const IconFileDefault = (
    <svg {...S}>
        <path d="M10 2H4.5a1 1 0 00-1 1v10a1 1 0 001 1h7a1 1 0 001-1V5L10 2z" />
        <path d="M10 2v3h3" />
        <path d="M5.5 8.5h5M5.5 10.5h5M5.5 6.5h2.5" />
    </svg>
)

export const IconFileImage = (
    <svg {...S}>
        <rect x="2" y="3" width="12" height="10" rx="1.5" />
        <circle cx="5.5" cy="6" r="1" />
        <path d="M2 10.5l3.5-3 2.5 2.5 2-2 4 4" />
    </svg>
)

export const IconFileSpreadsheet = (
    <svg {...S}>
        <rect x="2" y="2" width="12" height="12" rx="1.5" />
        <path d="M2 6h12M2 10h12M6 2v12M10 2v12" />
    </svg>
)

/* ── Link category icons ────────────────────────── */

export const IconLinkFlight = (
    <svg {...S}>
        <path d="M2 11l1.5-1.5 2.5 1L10 4l1.5 1.5-4.5 6.5 1 2-1.5.5L2 11z" />
        <path d="M10 4l1.5-.5 1.5 1.5-1 .5" />
        <path d="M5.5 10l-1.5 3.5" />
    </svg>
)

export const IconLinkHotel = (
    <svg {...S}>
        <rect x="2" y="3" width="12" height="11" rx="1" />
        <path d="M2 7.5h12" />
        <path d="M5.5 7.5v6.5M10.5 7.5v6.5" />
        <path d="M7 11h2" />
        <path d="M5.5 3V2h5v1" />
    </svg>
)

export const IconLinkTour = (
    <svg {...S}>
        <rect x="1.5" y="5.5" width="13" height="5" rx="1.5" />
        <path d="M6 5.5v5" />
        <path d="M3 8h1.5M10.5 8H12" />
    </svg>
)

export const IconLinkMap = (
    <svg {...S}>
        <path d="M6 2.5L2 4.5v9l4-2 4 2 4-2v-9l-4 2-4-2z" />
        <path d="M6 2.5v9M10 4.5v9" />
    </svg>
)

export const IconLinkDefault = (
    <svg {...S}>
        <path d="M9 5.5a3.5 3.5 0 015 5l-2 2a3.5 3.5 0 01-5-5" />
        <path d="M7 10.5a3.5 3.5 0 01-5-5l2-2a3.5 3.5 0 015 5" />
        <path d="M9.5 6.5l-3 3" />
    </svg>
)
