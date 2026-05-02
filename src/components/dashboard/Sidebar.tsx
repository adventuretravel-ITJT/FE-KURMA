'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@/src/contexts/UserContext'

const SETTINGS_HREF = '/dashboard/settings'

const NAV = [
    {
        section: 'Plan',
        items: [
            {
                label: 'My Trips',
                href: '/dashboard',
                icon: (
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1.5" y="2.5" width="13" height="11" rx="2" />
                        <path d="M5 1v3M11 1v3M1.5 7h13" />
                    </svg>
                ),
            },
        ],
    },
    {
        section: 'Connectivity',
        items: [
            {
                label: 'eSIM',
                href: '/dashboard/esim',
                icon: (
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6.5C3 4 5.2 2 8 2s5 2 5 4.5" />
                        <path d="M5.5 9C5.5 7.6 6.6 6.5 8 6.5S10.5 7.6 10.5 9" />
                        <circle cx="8" cy="12" r="1.2" fill="currentColor" stroke="none" />
                    </svg>
                ),
            },
        ],
    },
]

export default function Sidebar() {
    const pathname = usePathname() ?? ''
    const { user, onLogout, sidebarOpen, onCloseSidebar } = useUser()
    const initials = user.name.slice(0, 2).toUpperCase()

    return (
        <aside className={`dash-sidebar${sidebarOpen ? ' is-open' : ''}`}>
            {/* Logo row */}
            <div style={{ padding: '24px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link
                    href="/dashboard"
                    onClick={onCloseSidebar}
                    style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 500, color: 'var(--ink)', letterSpacing: '-.03em', textDecoration: 'none' }}
                >
                    Kurma<em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' }}>Go</em>
                </Link>
                <button
                    onClick={onCloseSidebar}
                    aria-label="Close menu"
                    style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--line-strong)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-50)' }}
                >
                    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ width: 13, height: 13 }}>
                        <path d="M2 2l10 10M12 2L2 12" />
                    </svg>
                </button>
            </div>
            <div style={{ fontSize: 9.5, fontWeight: 500, color: 'var(--ink-25)', letterSpacing: '.07em', textTransform: 'uppercase', padding: '4px 20px 0' }}>
                Plan Smart. Go Beyond.
            </div>

            {/* Nav */}
            <nav style={{ padding: '24px 10px 0', flex: 1 }}>
                {NAV.map(({ section, items }) => (
                    <div key={section}>
                        <span style={{ display: 'block', fontSize: 9.5, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-25)', padding: '0 10px', marginBottom: 4, marginTop: 20 }}>
                            {section}
                        </span>
                        {items.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onCloseSidebar}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 9,
                                        padding: '9px 10px', borderRadius: 8,
                                        fontSize: 13.5, fontWeight: isActive ? 600 : 500,
                                        color: isActive ? 'var(--accent)' : 'var(--ink-50)',
                                        background: isActive ? 'var(--accent-bg)' : 'transparent',
                                        textDecoration: 'none', transition: 'all .18s',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'var(--bg-warm)'
                                            e.currentTarget.style.color = 'var(--ink)'
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'transparent'
                                            e.currentTarget.style.color = 'var(--ink-50)'
                                        }
                                    }}
                                >
                                    <span style={{ width: 16, height: 16, flexShrink: 0 }}>{item.icon}</span>
                                    {item.label}
                                </Link>
                            )
                        })}
                    </div>
                ))}
            </nav>

            {/* User row */}
            <div style={{ padding: '14px 10px 24px', borderTop: '1px solid var(--line)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {/* Avatar + name → Settings */}
                    <Link
                        href={SETTINGS_HREF}
                        onClick={onCloseSidebar}
                        style={{
                            flex: 1, minWidth: 0,
                            display: 'flex', alignItems: 'center', gap: 9,
                            padding: '9px 10px', borderRadius: 8,
                            textDecoration: 'none', transition: 'background .18s',
                            background: pathname === SETTINGS_HREF ? 'var(--accent-bg)' : 'transparent',
                        }}
                        onMouseEnter={(e) => {
                            if (pathname !== SETTINGS_HREF) e.currentTarget.style.background = 'var(--bg-warm)'
                        }}
                        onMouseLeave={(e) => {
                            if (pathname !== SETTINGS_HREF) e.currentTarget.style.background = 'transparent'
                        }}
                    >
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--warm-10)', border: '1.5px solid rgba(184,149,106,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--warm)', flexShrink: 0 }}>
                            {initials}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                            <div style={{ fontSize: 10.5, color: 'var(--ink-25)' }}>{user.role?.name ?? 'Free plan'}</div>
                        </div>
                    </Link>

                    {/* Logout icon button */}
                    <button
                        onClick={onLogout}
                        title="Sign out"
                        style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--line-strong)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-25)', flexShrink: 0, transition: 'all .18s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(192,57,43,.3)'; e.currentTarget.style.color = 'var(--error)'; e.currentTarget.style.background = 'rgba(192,57,43,.04)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-25)'; e.currentTarget.style.background = 'transparent' }}
                    >
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{ width: 14, height: 14 }}>
                            <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10.5 11l3-3-3-3M13.5 8H6" />
                        </svg>
                    </button>
                </div>
            </div>
        </aside>
    )
}
