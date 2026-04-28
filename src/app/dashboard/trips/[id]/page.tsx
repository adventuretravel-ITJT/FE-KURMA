'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@/src/contexts/UserContext'

interface Trip {
    id: number
    name: string
    destination: string
    destination_flag?: string
    travel_type: string
    status: string
    start_date?: string
    end_date?: string
    created_at?: string
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
    active:    { bg: 'var(--accent-bg)', color: 'var(--accent)', label: 'Active' },
    draft:     { bg: 'var(--ink-05)',    color: 'var(--ink-50)', label: 'Planning' },
    completed: { bg: 'var(--warm-bg)',   color: 'var(--warm)',   label: 'Completed' },
}

const TRAVEL_TYPE_LABEL: Record<string, string> = {
    solo:   '👤 Solo',
    couple: '👫 Couple',
    family: '👨‍👩‍👧 Family',
    group:  '👥 Group',
}

export default function TripDetailPage() {
    const router = useRouter()
    const { id } = useParams<{ id: string }>()
    const { onToggleSidebar } = useUser()

    const [trip, setTrip]       = useState<Trip | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => {
                if (r.status === 404) { setNotFound(true); return null }
                return r.json()
            })
            .then((d) => { if (d?.data) setTrip(d.data) })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false))
    }, [id])

    async function handleDelete() {
        setDeleting(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            })
            if (res.ok) router.push('/dashboard')
        } finally {
            setDeleting(false)
        }
    }

    const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    const nights = trip?.start_date && trip?.end_date
        ? Math.round((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / 86400000)
        : null

    return (
        <>
            {/* Topbar */}
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
                    <Link
                        href="/dashboard"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 500, color: 'var(--ink-50)', textDecoration: 'none' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-50)')}
                    >
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 12, height: 12 }}>
                            <path d="M8 2L4 6l4 4" />
                        </svg>
                        My trips
                    </Link>
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-50)' }}>Trip detail</span>
                <div style={{ width: 36 }} />
            </div>

            <div className="dash-page">
                <div style={{ maxWidth: 680, margin: '0 auto' }}>

                    {/* Loading */}
                    {loading && <TripDetailSkeleton />}

                    {/* Not found */}
                    {!loading && notFound && (
                        <div style={{ textAlign: 'center', padding: '64px 0' }}>
                            <div style={{ fontSize: 40, marginBottom: 16 }}>🗺️</div>
                            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 500, color: 'var(--ink)', marginBottom: 8 }}>Trip not found</div>
                            <div style={{ fontSize: 13.5, color: 'var(--ink-50)', marginBottom: 24 }}>This trip doesn't exist or you don't have access to it.</div>
                            <Link
                                href="/dashboard"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 22px', background: 'var(--ink)', color: 'var(--bg)', fontSize: 13, fontWeight: 600, borderRadius: 100, textDecoration: 'none' }}
                            >
                                Back to dashboard
                            </Link>
                        </div>
                    )}

                    {/* Trip content */}
                    {!loading && trip && (
                        <>
                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 28, animation: 'fadeUp .4s ease both' }}>
                                <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg,rgba(44,95,78,.08),rgba(184,149,106,.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                                    {trip.destination_flag ?? '🗺️'}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 500, letterSpacing: '-.03em', color: 'var(--ink)', lineHeight: 1.15, marginBottom: 5 }}>
                                        {trip.name}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                        {(() => {
                                            const s = STATUS_STYLE[trip.status] ?? STATUS_STYLE.draft
                                            return (
                                                <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.03em', padding: '3px 10px', borderRadius: 100, background: s.bg, color: s.color }}>
                                                    {s.label}
                                                </span>
                                            )
                                        })()}
                                        {nights !== null && (
                                            <span style={{ fontSize: 10.5, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: 'var(--ink-05)', color: 'var(--ink-50)' }}>
                                                {nights} days
                                            </span>
                                        )}
                                        <span style={{ fontSize: 10.5, fontWeight: 500, color: 'var(--ink-25)' }}>
                                            {TRAVEL_TYPE_LABEL[trip.travel_type] ?? trip.travel_type}
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    href={`/dashboard/trips/${id}/edit`}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 14px', fontSize: 12.5, fontWeight: 500, color: 'var(--ink-50)', border: '1px solid var(--line-strong)', borderRadius: 8, textDecoration: 'none', flexShrink: 0, transition: 'all .18s' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ink)'; e.currentTarget.style.color = 'var(--ink)' }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-50)' }}
                                >
                                    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
                                        <path d="M9.5 2.5l2 2L5 11H3v-2l6.5-6.5z" />
                                    </svg>
                                    Edit
                                </Link>
                            </div>

                            {/* Detail cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20, animation: 'fadeUp .4s ease .06s both' }}>
                                <InfoCard icon={
                                    <svg viewBox="0 0 16 16" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                                        <path d="M9 2l-5.447 2.724A1 1 0 003 5.618v10.764a1 1 0 001.447.894L9 14m0-12l6 3M9 14l6-3M9 14V2m6-3v12" />
                                    </svg>
                                } label="Destination" value={trip.destination} />

                                <InfoCard icon={
                                    <svg viewBox="0 0 16 16" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                                        <rect x="1.5" y="2.5" width="13" height="11" rx="2" />
                                        <path d="M5 1v3M11 1v3M1.5 7h13" />
                                    </svg>
                                } label="Departure" value={trip.start_date ? fmt(trip.start_date) : '—'} muted={!trip.start_date} />

                                <InfoCard icon={
                                    <svg viewBox="0 0 16 16" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                                        <rect x="1.5" y="2.5" width="13" height="11" rx="2" />
                                        <path d="M5 1v3M11 1v3M1.5 7h13" />
                                    </svg>
                                } label="Return" value={trip.end_date ? fmt(trip.end_date) : '—'} muted={!trip.end_date} />

                                <InfoCard icon={
                                    <svg viewBox="0 0 16 16" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" style={{ width: 14, height: 14 }}>
                                        <circle cx="8" cy="8" r="6" /><path d="M8 5v3.5l2 2" />
                                    </svg>
                                } label="Duration" value={nights !== null ? `${nights} nights · ${nights + 1} days` : '—'} muted={nights === null} />
                            </div>

                            {/* Itinerary placeholder */}
                            <div style={{ background: 'var(--bg-card)', border: '1.5px dashed var(--line-strong)', borderRadius: 14, padding: '40px 28px', textAlign: 'center', marginBottom: 20, animation: 'fadeUp .4s ease .12s both' }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-bg)', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg viewBox="0 0 20 20" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
                                        <path d="M6 10h8M6 14h5M4 3h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z" />
                                    </svg>
                                </div>
                                <div style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 500, color: 'var(--ink)', marginBottom: 6 }}>Itinerary coming soon</div>
                                <div style={{ fontSize: 13, color: 'var(--ink-50)', maxWidth: 280, margin: '0 auto', lineHeight: 1.65 }}>
                                    Day-by-day planning will appear here once you upgrade to Pro.
                                </div>
                            </div>

                            {/* Danger zone */}
                            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 14, padding: '18px 20px', animation: 'fadeUp .4s ease .18s both' }}>
                                <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-25)', marginBottom: 12 }}>Danger zone</div>
                                {!confirmDelete ? (
                                    <button
                                        onClick={() => setConfirmDelete(true)}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'transparent', color: 'var(--error)', fontSize: 12.5, fontWeight: 500, border: '1px solid rgba(192,57,43,.2)', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--error-bg)'; e.currentTarget.style.borderColor = 'var(--error)' }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(192,57,43,.2)' }}
                                    >
                                        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
                                            <path d="M2 3.5h10M5 3.5V2.5a1 1 0 011-1h2a1 1 0 011 1v1M11.5 3.5l-.7 8a1 1 0 01-1 .9H4.2a1 1 0 01-1-.9l-.7-8" />
                                        </svg>
                                        Delete trip
                                    </button>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: 13, color: 'var(--ink-50)' }}>Are you sure? This cannot be undone.</span>
                                        <button
                                            onClick={handleDelete}
                                            disabled={deleting}
                                            style={{ padding: '7px 16px', background: 'var(--error)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: deleting ? 'default' : 'pointer', fontFamily: 'inherit', opacity: deleting ? .6 : 1 }}
                                        >
                                            {deleting ? 'Deleting…' : 'Yes, delete'}
                                        </button>
                                        <button
                                            onClick={() => setConfirmDelete(false)}
                                            style={{ padding: '7px 14px', background: 'transparent', color: 'var(--ink-50)', border: '1px solid var(--line-strong)', borderRadius: 8, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

function InfoCard({ icon, label, value, muted }: { icon: React.ReactNode; label: string; value: string; muted?: boolean }) {
    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {icon}
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-25)' }}>{label}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: muted ? 'var(--ink-25)' : 'var(--ink)' }}>{value}</div>
        </div>
    )
}

function TripDetailSkeleton() {
    return (
        <div style={{ animation: 'fadeUp .3s ease both' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 28 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--line)', animation: 'pulse-sk 1.4s ease infinite', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                    <div style={{ height: 22, borderRadius: 6, background: 'var(--line)', width: '55%', marginBottom: 10, animation: 'pulse-sk 1.4s ease infinite' }} />
                    <div style={{ height: 14, borderRadius: 6, background: 'var(--line)', width: '30%', animation: 'pulse-sk 1.4s ease infinite' }} />
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[1,2,3,4].map((i) => (
                    <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 12, padding: '14px 16px' }}>
                        <div style={{ height: 11, borderRadius: 4, background: 'var(--line)', width: '40%', marginBottom: 10, animation: 'pulse-sk 1.4s ease infinite' }} />
                        <div style={{ height: 14, borderRadius: 4, background: 'var(--line)', width: '65%', animation: 'pulse-sk 1.4s ease infinite' }} />
                    </div>
                ))}
            </div>
            <style>{`@keyframes pulse-sk{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
        </div>
    )
}
