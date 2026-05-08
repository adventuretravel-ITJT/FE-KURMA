'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useUser } from '@/contexts/UserContext'

/* â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
interface Trip {
    id: number
    name: string
    destination: string
    destination_flag?: string
    travel_type: string
    status: string
    start_date?: string
    end_date?: string
}

/* â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function greetingPrefix() {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   DASHBOARD PAGE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function DashboardPage() {
    const { user, onToggleSidebar } = useUser()
    const [trips, setTrips]     = useState<Trip[]>([])
    const [loading, setLoading] = useState(true)

    const firstName = user.name.split(' ')[0]
    const hasTrips  = trips.length > 0
    const nextTrip  = trips.find((t) => t.start_date && new Date(t.start_date) >= new Date())

    const fetchTrips = useCallback(() => {
        const token = localStorage.getItem('token')
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((d) => { if (d.data) setTrips(d.data) })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { fetchTrips() }, [fetchTrips])

    return (
        <>
            {/* â”€â”€ Topbar â”€â”€ */}
            <div className="dash-topbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                        onClick={onToggleSidebar}
                        aria-label="Open menu"
                        style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--line-strong)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-50)', flexShrink: 0 }}
                    >
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{ width: 15, height: 15 }}>
                            <path d="M2 4h12M2 8h12M2 12h12" />
                        </svg>
                    </button>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-50)' }}>Dashboard</span>
                </div>

                <Link
                    href="/dashboard/new-trip"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'var(--ink)', color: 'var(--bg)', fontSize: 12.5, fontWeight: 600, borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background .22s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--ink)')}
                >
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 12, height: 12 }}>
                        <path d="M6 1v10M1 6h10" />
                    </svg>
                    New trip
                </Link>
            </div>

            {/* â”€â”€ Page â”€â”€ */}
            <div className="dash-page">
                <div className="dash-grid">

                    {/* â”€â”€ LEFT COLUMN â”€â”€ */}
                    <div>
                        {/* Greeting */}
                        <div style={{ marginBottom: 28, animation: 'fadeUp .45s ease both' }}>
                            <div style={{ fontSize: 10.5, fontWeight: 500, color: 'var(--ink-25)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 5 }}>
                                {greetingPrefix()}
                            </div>
                            <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 26, fontWeight: 500, letterSpacing: '-.03em', lineHeight: 1.1, color: 'var(--ink)' }}>
                                {hasTrips
                                    ? `${firstName}.`
                                    : <>Welcome, <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' }}>{firstName}.</em></>}
                            </div>
                            <div style={{ fontSize: 13.5, color: 'var(--ink-50)', marginTop: 5, lineHeight: 1.6 }}>
                                {hasTrips
                                    ? nextTrip
                                        ? `Your ${nextTrip.destination} trip is coming up. Everything looks on track.`
                                        : `You have ${trips.length} trip${trips.length > 1 ? 's' : ''} in your folder.`
                                    : "Your travel folder is ready. Let's fill it with your first adventure."}
                            </div>
                        </div>

                        {/* Trips section */}
                        <div style={{ animation: 'fadeUp .45s ease .08s both' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                                <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-25)' }}>My trips</span>
                                {hasTrips && (
                                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--accent)', cursor: 'pointer' }}>View all</span>
                                )}
                            </div>

                            {loading ? (
                                <TripSkeleton />
                            ) : !hasTrips ? (
                                <EmptyState />
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {trips.map((trip) => <TripCard key={trip.id} trip={trip} />)}
                                </div>
                            )}
                        </div>

                        {/* Onboarding — empty state only */}
                        {!hasTrips && !loading && (
                            <div style={{ animation: 'fadeUp .45s ease .16s both' }}>
                                <OnboardingCard />
                            </div>
                        )}
                    </div>

                    {/* â”€â”€ RIGHT COLUMN â”€â”€ */}
                    <div className="dash-right" style={{ animation: 'fadeUp .45s ease .08s both' }}>

                        {/* Upcoming card — shown when trips exist */}
                        {hasTrips && <UpcomingWidget trips={trips} />}

                        {/* Kurma tip — always visible */}
                        <KurmaTipWidget destination={nextTrip?.destination} />
                    </div>

                </div>
            </div>
        </>
    )
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   TRIP CARD
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
    active:    { bg: 'var(--accent-bg)', color: 'var(--accent)', label: 'Active' },
    draft:     { bg: 'var(--ink-05)',    color: 'var(--ink-50)', label: 'Planning' },
    completed: { bg: 'var(--warm-bg)',   color: 'var(--warm)',   label: 'Completed' },
}

function TripCard({ trip }: { trip: Trip }) {
    const s = STATUS_STYLE[trip.status] ?? STATUS_STYLE.draft
    const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    const nights = trip.start_date && trip.end_date
        ? Math.round((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / 86400000)
        : null
    const hasDates = !!trip.start_date

    return (
        <Link
            href={`/dashboard/trips/${trip.id}`}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', transition: 'all .22s', color: 'inherit', textDecoration: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,.05)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.boxShadow = 'none' }}
        >
            <div style={{ width: 48, height: 48, borderRadius: 10, background: hasDates ? 'linear-gradient(135deg,rgba(44,95,78,.08),rgba(184,149,106,.08))' : 'var(--ink-05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                {trip.destination_flag ?? 'ðŸ—ºï¸'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 15, fontWeight: 500, letterSpacing: '-.02em', color: 'var(--ink)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {trip.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-50)' }}>
                    {hasDates
                        ? `${trip.destination} · ${fmt(trip.start_date!)}${trip.end_date ? ` – ${fmt(trip.end_date)}` : ''}`
                        : 'No dates set yet'}
                </div>
                <div style={{ display: 'flex', gap: 5, marginTop: 7, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.03em', padding: '2px 8px', borderRadius: 100, background: s.bg, color: s.color }}>
                        {s.label}
                    </span>
                    {nights !== null && (
                        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: 'var(--ink-05)', color: 'var(--ink-50)' }}>
                            {nights} days
                        </span>
                    )}
                    {!hasDates && (
                        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: 'rgba(220,100,40,.07)', color: '#C4511A' }}>
                            ðŸ“… Add dates
                        </span>
                    )}
                </div>
            </div>
            <div style={{ color: 'var(--ink-25)', flexShrink: 0 }}>
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: 14, height: 14 }}>
                    <path d="M5 3l4 4-4 4" />
                </svg>
            </div>
        </Link>
    )
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   EMPTY STATE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function EmptyState() {
    return (
        <div style={{ background: 'var(--bg-card)', border: '1.5px dashed var(--line-strong)', borderRadius: 16, padding: '56px 32px', textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--accent-bg)', margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
                    <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7M9 20l6-3M9 20V7m6 13l5.447-2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 13V7M9 7l6-3" />
                </svg>
            </div>
            <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 20, fontWeight: 500, letterSpacing: '-.02em', color: 'var(--ink)', marginBottom: 8 }}>No trips yet</div>
            <div style={{ fontSize: 13.5, color: 'var(--ink-50)', maxWidth: 320, margin: '0 auto 24px', lineHeight: 1.7 }}>
                Plan your first trip and we'll keep itinerary, bookings, and connectivity all in one place.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                <Link
                    href="/dashboard/new-trip"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'var(--ink)', color: 'var(--bg)', fontSize: 12.5, fontWeight: 600, borderRadius: 8, textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--ink)')}
                >
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 12, height: 12 }}>
                        <path d="M6 1v10M1 6h10" />
                    </svg>
                    Plan a new trip
                </Link>
            </div>
        </div>
    )
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   ONBOARDING CARD
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function OnboardingCard() {
    const steps = [
        { done: true,  current: false, label: 'Create your account',            desc: '' },
        { done: false, current: true,  label: 'Plan your first trip',           desc: 'Add a destination and let AI draft your itinerary.' },
        { done: false, current: false, label: 'Activate eSIM for connectivity', desc: 'Stay connected the moment you land — no SIM swapping.' },
    ]
    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 16, padding: '24px 28px', marginTop: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-25)', marginBottom: 16 }}>Getting started</div>
            {steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '13px 0', borderBottom: i < steps.length - 1 ? '1px solid var(--line)' : 'none', paddingTop: i === 0 ? 0 : 10, paddingBottom: i === steps.length - 1 ? 0 : 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', border: `1.5px solid ${s.done ? 'var(--accent)' : s.current ? 'var(--accent)' : 'var(--line-strong)'}`, background: s.done ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, fontWeight: 600, color: s.done ? '#fff' : s.current ? 'var(--accent)' : 'var(--ink-25)', marginTop: 1 }}>
                        {s.done ? (
                            <svg viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" style={{ width: 10, height: 10 }}>
                                <path d="M2 5.5l2.5 2.5 4-5" />
                            </svg>
                        ) : i + 1}
                    </div>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: s.done || s.current ? 'var(--ink)' : 'var(--ink-25)', lineHeight: 1.3 }}>{s.label}</div>
                        {s.desc && <div style={{ fontSize: 11.5, color: 'var(--ink-25)', marginTop: 2, lineHeight: 1.5 }}>{s.desc}</div>}
                    </div>
                </div>
            ))}
        </div>
    )
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   UPCOMING WIDGET
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function UpcomingWidget({ trips }: { trips: Trip[] }) {
    const upcoming = trips
        .filter((t) => t.start_date && new Date(t.start_date) >= new Date())
        .sort((a, b) => new Date(a.start_date!).getTime() - new Date(b.start_date!).getTime())
        .slice(0, 2)

    const noDateTrips = trips.filter((t) => !t.start_date)

    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 14, padding: '18px 18px 20px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-25)', marginBottom: 14 }}>Upcoming</div>

            {upcoming.length > 0 ? (
                upcoming.map((trip, i) => {
                    const d     = new Date(trip.start_date!)
                    const month = d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()
                    const day   = d.getDate()
                    return (
                        <div key={trip.id}>
                            {i > 0 && <div style={{ height: 1, background: 'var(--line)', margin: '12px 0' }} />}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 36, height: 40, borderRadius: 8, background: i === 0 ? 'var(--accent-bg)' : 'var(--warm-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: i === 0 ? 'var(--accent)' : 'var(--warm)' }}>{month}</div>
                                    <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 17, fontWeight: 500, color: i === 0 ? 'var(--accent)' : 'var(--warm)', lineHeight: 1.1 }}>{day}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink)' }}>Departure — {trip.destination}</div>
                                    <div style={{ fontSize: 11, color: 'var(--ink-25)', marginTop: 1 }}>{trip.name}</div>
                                </div>
                            </div>
                        </div>
                    )
                })
            ) : (
                <div>
                    <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink)', marginBottom: 4 }}>No dates yet</div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-50)', lineHeight: 1.55, marginBottom: noDateTrips.length > 0 ? 12 : 0 }}>
                        Add travel dates to your trip{trips.length > 1 ? 's' : ''} to see what&apos;s coming up.
                    </div>
                    {noDateTrips.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {noDateTrips.slice(0, 2).map((t) => (
                                <Link key={t.id} href={`/dashboard/trips/${t.id}`}
                                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: 'var(--bg)', borderRadius: 8, textDecoration: 'none', border: '1px solid var(--line)', transition: 'border-color .18s' }}
                                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--line-strong)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--line)')}
                                >
                                    <span style={{ fontSize: 14 }}>{t.destination_flag ?? 'ðŸ—ºï¸'}</span>
                                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</span>
                                    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 100, background: 'rgba(220,100,40,.07)', color: '#C4511A', whiteSpace: 'nowrap' }}>ðŸ“… Add dates</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   KURMA TIP WIDGET
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const TIPS: Record<string, { dest: string; tip: string }> = {
    Japan:          { dest: 'Japan',         tip: 'Shinkansen tickets sell out fast during peak season — book at least 2 weeks ahead for Golden Week or sakura season.' },
    'South Korea':  { dest: 'Seoul',         tip: 'T-money card works on all transit in Seoul — top it up at any convenience store before your first subway ride.' },
    Thailand:       { dest: 'Thailand',      tip: 'Visit temples early morning to beat the crowds and the heat. Most open from 8am and are quietest before 9am.' },
    Indonesia:      { dest: 'Bali',          tip: "Rent a scooter only if you're comfortable in heavy traffic — Bali roads move fast and lane rules are loose." },
    France:         { dest: 'Paris',         tip: "The Musee d'Orsay is far less crowded than the Louvre and houses some of the finest impressionist works in the world." },
    Italy:          { dest: 'Italy',         tip: 'Book Colosseum and Vatican tickets online at least 3 days ahead — same-day queues can be 2+ hours.' },
    Singapore:      { dest: 'Singapore',     tip: 'Hawker centres offer the best local food at unbeatable prices. Try Maxwell Food Centre or Lau Pa Sat.' },
    __default:      { dest: 'Japan · Kyoto', tip: 'Arashiyama bamboo grove is best before 7am — most tour groups arrive after 9 and crowds get thick fast.' },
}

function KurmaTipWidget({ destination }: { destination?: string }) {
    const entry = (destination && TIPS[destination]) ? TIPS[destination] : TIPS.__default
    return (
        <div style={{ background: 'var(--ink)', borderRadius: 14, padding: '18px 18px 20px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.22)', marginBottom: 10 }}>Kurma tip</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 100, fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,.35)', letterSpacing: '.04em', marginBottom: 12 }}>
                {entry.dest}
            </div>
            <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 13.5, fontWeight: 300, fontStyle: 'italic', color: 'rgba(255,255,255,.65)', lineHeight: 1.65 }}>
                <span style={{ display: 'block', fontSize: 18, color: 'var(--accent-light)', lineHeight: 1, marginBottom: 3, fontStyle: 'normal' }}>&ldquo;</span>
                {entry.tip}
            </div>
        </div>
    )
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   LOADING SKELETON
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function TripSkeleton() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2].map((i) => (
                <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 14, padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--line)', animation: 'pulse-sk 1.4s ease infinite', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ height: 14, borderRadius: 6, background: 'var(--line)', width: '52%', marginBottom: 8, animation: 'pulse-sk 1.4s ease infinite' }} />
                        <div style={{ height: 11, borderRadius: 6, background: 'var(--line)', width: '32%', animation: 'pulse-sk 1.4s ease infinite' }} />
                    </div>
                </div>
            ))}
            <style>{`@keyframes pulse-sk{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
        </div>
    )
}

