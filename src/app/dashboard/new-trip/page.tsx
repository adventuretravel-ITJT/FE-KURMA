'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@/src/contexts/UserContext'

/* ─── Types ─────────────────────────────────────── */
type TravelType = 'solo' | 'couple' | 'family' | 'group' | ''
type Pace       = 'easy' | 'balanced' | 'packed' | ''
type Budget     = 'backpacker' | 'smart' | 'comfort' | 'splurge' | ''

interface Dest { flag: string; name: string; country: string; tag?: string }

interface FormState {
    // Step 1
    destination: string
    destinationFlag: string
    tripName: string
    travelType: TravelType
    adults: number
    kids: number
    littles: number
    // Step 2
    startDate: string
    endDate: string
    datesSkipped: boolean
    // Step 3
    activities: string[]
    pace: Pace
    budget: Budget
    specialNeeds: string[]
}

/* ─── Destination list ──────────────────────────── */
const DESTS: Dest[] = [
    { flag: '🗾', name: 'Japan',          country: 'East Asia',     tag: 'Popular' },
    { flag: '🇨🇳', name: 'China',          country: 'East Asia',     tag: 'Popular' },
    { flag: '🇰🇷', name: 'South Korea',    country: 'East Asia' },
    { flag: '🇹🇭', name: 'Thailand',       country: 'Southeast Asia',tag: 'Popular' },
    { flag: '🇸🇬', name: 'Singapore',      country: 'Southeast Asia' },
    { flag: '🇮🇩', name: 'Indonesia',      country: 'Southeast Asia' },
    { flag: '🇮🇹', name: 'Italy',          country: 'Europe' },
    { flag: '🇫🇷', name: 'France',         country: 'Europe' },
    { flag: '🇬🇧', name: 'United Kingdom', country: 'Europe' },
    { flag: '🇺🇸', name: 'United States',  country: 'North America' },
    { flag: '🇦🇺', name: 'Australia',      country: 'Oceania' },
    { flag: '🇹🇷', name: 'Turkey',         country: 'Europe / Asia' },
    { flag: '🇲🇦', name: 'Morocco',        country: 'North Africa' },
    { flag: '🇦🇪', name: 'UAE',            country: 'Middle East' },
    { flag: '🇮🇳', name: 'India',          country: 'South Asia' },
]

const ACTIVITIES = ['🏯 Culture & History','🍜 Local Food','🌿 Nature','🛍️ City & Shopping','🏙️ Sightseeing','🎢 Theme Parks']
const SPECIAL    = ['🕌 Halal food','♿ Accessibility','👶 Stroller-friendly','🌱 Vegetarian/Vegan','📸 Instagrammable','🗺️ Off the beaten path']
const BUDGETS    = [
    { key: 'backpacker', icon: '🎒', label: 'Backpacker', sub: 'stretch every rupiah' },
    { key: 'smart',      icon: '👍', label: 'Smart',       sub: 'comfort without the guilt' },
    { key: 'comfort',    icon: '🛎️', label: 'Comfort',     sub: 'mid-range done right' },
    { key: 'splurge',    icon: '✨', label: 'Splurge',     sub: 'treat yourself' },
]
const PACES = [
    { key: 'easy',      emoji: '🌿', label: 'Easy',     sub: '2–3 spots a day' },
    { key: 'balanced',  emoji: '⚡', label: 'Balanced', sub: '4–5 spots' },
    { key: 'packed',    emoji: '🚀', label: 'Packed',   sub: 'max it out' },
]
const QUICK_PICKS = [5, 7, 10, 14, 21]

/* ─── Page ──────────────────────────────────────── */
export default function NewTripPage() {
    const router = useRouter()
    const { onToggleSidebar } = useUser()

    const [step, setStep]     = useState(1)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [createdName, setCreatedName] = useState('')

    const [form, setForm] = useState<FormState>({
        destination: '', destinationFlag: '', tripName: '',
        travelType: '', adults: 2, kids: 0, littles: 0,
        startDate: '', endDate: '', datesSkipped: false,
        activities: [], pace: '', budget: '', specialNeeds: [],
    })

    // Validation errors
    const [destErr, setDestErr]   = useState(false)
    const [dateErr, setDateErr]   = useState(false)

    // Destination search
    const [query, setQuery]       = useState('')
    const [ddOpen, setDdOpen]     = useState(false)
    const destWrapRef             = useRef<HTMLDivElement>(null)

    const filtered = query.trim()
        ? DESTS.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()) || d.country.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
        : []

    useEffect(() => {
        function onDown(e: MouseEvent) {
            if (destWrapRef.current && !destWrapRef.current.contains(e.target as Node)) setDdOpen(false)
        }
        document.addEventListener('mousedown', onDown)
        return () => document.removeEventListener('mousedown', onDown)
    }, [])

    // Duration calc
    const nights = form.startDate && form.endDate
        ? Math.round((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000)
        : null

    /* helpers */
    function pickDest(d: Dest) {
        setForm((f) => ({ ...f, destination: d.name, destinationFlag: d.flag, tripName: f.tripName || `${d.name} Trip` }))
        setQuery(''); setDdOpen(false); setDestErr(false)
    }
    function clearDest() {
        setForm((f) => ({ ...f, destination: '', destinationFlag: '', tripName: '' }))
        setQuery('')
    }
    function setField<K extends keyof FormState>(key: K, val: FormState[K]) {
        setForm((f) => ({ ...f, [key]: val }))
    }
    function toggleMulti(arr: string[], val: string): string[] {
        return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]
    }
    function applyQuickPick(nights: number) {
        const from = new Date(); from.setDate(from.getDate() + 1)
        const to   = new Date(from); to.setDate(to.getDate() + nights)
        const fmt  = (d: Date) => d.toISOString().split('T')[0]
        setForm((f) => ({ ...f, startDate: fmt(from), endDate: fmt(to), datesSkipped: false }))
        setDateErr(false)
    }
    function skipDates() {
        setForm((f) => ({ ...f, startDate: '', endDate: '', datesSkipped: true }))
        setDateErr(false)
    }
    function undoSkip() {
        setForm((f) => ({ ...f, datesSkipped: false }))
    }

    /* stepper */
    function stepperChange(field: 'adults' | 'kids' | 'littles', delta: number) {
        setForm((f) => {
            const min = field === 'adults' ? 1 : 0
            const next = Math.max(min, f[field] + delta)
            return { ...f, [field]: next }
        })
    }

    /* navigation */
    function goNext() {
        if (step === 1) {
            if (!form.destination) { setDestErr(true); return }
            setStep(2)
        } else if (step === 2) {
            if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) { setDateErr(true); return }
            setStep(3)
        } else {
            submitTrip()
        }
    }
    function goBack() {
        if (step > 1) setStep((s) => s - 1)
    }

    async function submitTrip() {
        const name = form.tripName.trim() || `${form.destination} Trip`
        setSubmitting(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    name,
                    destination:      form.destination,
                    destination_flag: form.destinationFlag,
                    travel_type:      form.travelType || 'solo',
                    status:           form.datesSkipped ? 'draft' : 'draft',
                    start_date:       form.datesSkipped ? null : (form.startDate || null),
                    end_date:         form.datesSkipped ? null : (form.endDate || null),
                }),
            })
            if (res.ok) {
                setCreatedName(name)
                setSuccess(true)
            }
        } finally {
            setSubmitting(false)
        }
    }

    const showStepper = form.travelType === 'family' || form.travelType === 'group'

    const STEP_LABELS = ['Destination', 'Dates', 'Preferences']

    /* ── Render ── */
    return (
        <>
            {/* Topbar */}
            <div className="dash-topbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={onToggleSidebar} aria-label="Open menu" style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--line-strong)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-50)' }}>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{ width: 15, height: 15 }}><path d="M2 4h12M2 8h12M2 12h12" /></svg>
                    </button>
                    <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 500, color: 'var(--ink-50)', textDecoration: 'none' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-50)')}>
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 12, height: 12 }}><path d="M8 2L4 6l4 4" /></svg>
                        Dashboard
                    </Link>
                </div>

                {/* Step indicator */}
                {!success && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {STEP_LABELS.map((label, i) => {
                            const n = i + 1
                            const active = step === n
                            const done   = step > n
                            return (
                                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: done ? 'var(--accent)' : active ? 'var(--ink)' : 'var(--line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: done || active ? '#fff' : 'var(--ink-25)', transition: 'all .2s' }}>
                                            {done ? (
                                                <svg viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" style={{ width: 9, height: 9 }}><path d="M2 5l2 2.5 4-4" /></svg>
                                            ) : n}
                                        </div>
                                        <span style={{ fontSize: 11.5, fontWeight: active ? 600 : 400, color: active ? 'var(--ink)' : 'var(--ink-25)', display: 'none' }} className="steps-label">{label}</span>
                                    </div>
                                    {i < 2 && <div style={{ width: 16, height: 1.5, borderRadius: 2, background: done ? 'var(--accent)' : 'var(--line-strong)', transition: 'background .3s' }} />}
                                </div>
                            )
                        })}
                    </div>
                )}

                <div style={{ width: 36 }} />
            </div>

            {/* ── Form page ── */}
            <div className="dash-page">
                <div style={{ maxWidth: 560, margin: '0 auto' }}>

                    {/* ───── SUCCESS ───── */}
                    {success && (
                        <div style={{ textAlign: 'center', padding: '48px 0' }}>
                            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--accent-bg)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" style={{ width: 24, height: 24 }}><path d="M20 6L9 17l-5-5" /></svg>
                            </div>
                            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 500, letterSpacing: '-.025em', color: 'var(--ink)', marginBottom: 8 }}>"{createdName}" is ready!</div>
                            <div style={{ fontSize: 13.5, color: 'var(--ink-50)', maxWidth: 300, margin: '0 auto 28px', lineHeight: 1.65 }}>Your trip is saved. You can start building your itinerary anytime.</div>
                            <button
                                onClick={() => router.push('/dashboard')}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '12px 28px', background: 'var(--ink)', color: 'var(--bg)', fontSize: 13.5, fontWeight: 600, borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                            >
                                Back to dashboard
                                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 13, height: 13 }}><path d="M4 2l4 4-4 4" /></svg>
                            </button>
                        </div>
                    )}

                    {/* ───── STEP 1: Destination & Party ───── */}
                    {!success && step === 1 && (
                        <div>
                            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>Step 1 of 3</div>
                            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 500, letterSpacing: '-.03em', lineHeight: 1.15, color: 'var(--ink)', marginBottom: 4 }}>
                                Where are you <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' }}>headed?</em>
                            </div>
                            <div style={{ fontSize: 13.5, color: 'var(--ink-50)', marginBottom: 28, lineHeight: 1.6 }}>Pick a destination and tell us who's coming along.</div>

                            {/* Destination */}
                            <Field label="Destination">
                                <div ref={destWrapRef} style={{ position: 'relative' }}>
                                    {!form.destination ? (
                                        <>
                                            <svg viewBox="0 0 16 16" fill="none" stroke="var(--ink-25)" strokeWidth="1.5" strokeLinecap="round" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, pointerEvents: 'none' }}>
                                                <circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5l3 3" />
                                            </svg>
                                            <input
                                                autoFocus
                                                type="text"
                                                value={query}
                                                onChange={(e) => { setQuery(e.target.value); setDdOpen(true); setDestErr(false) }}
                                                onFocus={() => setDdOpen(true)}
                                                placeholder="Search city or country…"
                                                style={{ ...inputStyle, paddingLeft: 38, borderColor: destErr ? 'var(--error)' : undefined }}
                                            />
                                            {ddOpen && filtered.length > 0 && (
                                                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: 10, overflow: 'hidden', zIndex: 20, boxShadow: '0 8px 24px rgba(17,17,16,.08)' }}>
                                                    {filtered.map((d) => (
                                                        <div key={d.name} onClick={() => pickDest(d)}
                                                            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--line)', transition: 'background .15s' }}
                                                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-warm)')}
                                                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                                        >
                                                            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{d.flag}</div>
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{d.name}</div>
                                                                <div style={{ fontSize: 11, color: 'var(--ink-25)' }}>{d.country}</div>
                                                            </div>
                                                            {d.tag && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 100, background: 'var(--accent-bg)', color: 'var(--accent)' }}>{d.tag}</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'var(--accent-bg)', border: '1px solid var(--accent-10)', borderRadius: 10 }}>
                                            <span style={{ fontSize: 16 }}>{form.destinationFlag}</span>
                                            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--accent)', flex: 1 }}>{form.destination}</span>
                                            <button onClick={clearDest} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: 18, lineHeight: 1, opacity: .6, padding: '0 2px' }}>×</button>
                                        </div>
                                    )}
                                </div>
                                {destErr && <FieldErr>Please pick a destination first.</FieldErr>}
                            </Field>

                            {/* Trip name */}
                            <Field label="Trip name">
                                <input type="text" value={form.tripName} onChange={(e) => setField('tripName', e.target.value)} placeholder="e.g. Japan Spring 2025" maxLength={60} style={inputStyle} />
                                <FieldHint>Or we'll name it after your destination.</FieldHint>
                            </Field>

                            {/* Who's coming */}
                            <Field label="Who's coming?">
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                    {[
                                        { key: 'solo',   label: 'Just me',   icon: '👤' },
                                        { key: 'couple', label: 'Us two',    icon: '👫' },
                                        { key: 'family', label: 'Family',    icon: '👨‍👩‍👧' },
                                        { key: 'group',  label: 'Group',     icon: '👥' },
                                    ].map((t) => (
                                        <button key={t.key} onClick={() => setField('travelType', t.key as TravelType)}
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 100, fontFamily: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all .18s', border: `1.5px solid ${form.travelType === t.key ? 'var(--accent)' : 'var(--line-strong)'}`, background: form.travelType === t.key ? 'var(--accent-bg)' : 'transparent', color: form.travelType === t.key ? 'var(--accent)' : 'var(--ink-50)' }}>
                                            {t.icon} {t.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Party stepper */}
                                {showStepper && (
                                    <div style={{ marginTop: 14, padding: 14, background: 'var(--bg)', border: '1px solid var(--line-strong)', borderRadius: 12 }}>
                                        <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-25)', marginBottom: 12 }}>
                                            {form.travelType === 'family' ? "Who's in the family?" : "Who's in the group?"}
                                        </div>
                                        {([
                                            { field: 'adults',  label: 'Adults',      sub: '13 and older',   show: true },
                                            { field: 'kids',    label: 'Kids',         sub: '5–12 years old', show: form.travelType === 'family' },
                                            { field: 'littles', label: 'Little ones',  sub: 'Under 5',        show: form.travelType === 'family' },
                                        ] as const).filter((r) => r.show).map((row, i, arr) => (
                                            <div key={row.field} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none' }}>
                                                <div>
                                                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{row.label}</div>
                                                    <div style={{ fontSize: 11, color: 'var(--ink-25)', marginTop: 1 }}>{row.sub}</div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <button onClick={() => stepperChange(row.field, -1)} disabled={form[row.field] <= (row.field === 'adults' ? 1 : 0)}
                                                        style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid var(--line-strong)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-50)', fontSize: 16, fontFamily: 'inherit', opacity: form[row.field] <= (row.field === 'adults' ? 1 : 0) ? .3 : 1 }}>−</button>
                                                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', minWidth: 20, textAlign: 'center' }}>{form[row.field]}</span>
                                                    <button onClick={() => stepperChange(row.field, 1)}
                                                        style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid var(--line-strong)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-50)', fontSize: 16, fontFamily: 'inherit' }}>+</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Field>
                        </div>
                    )}

                    {/* ───── STEP 2: Dates ───── */}
                    {!success && step === 2 && (
                        <div>
                            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>Step 2 of 3</div>
                            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 500, letterSpacing: '-.03em', lineHeight: 1.15, color: 'var(--ink)', marginBottom: 4 }}>
                                When are you <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' }}>going?</em>
                            </div>
                            <div style={{ fontSize: 13.5, color: 'var(--ink-50)', marginBottom: 20, lineHeight: 1.6 }}>
                                Set your travel dates to {form.destination}, or skip and decide later.
                            </div>

                            {/* Destination preview */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg-warm)', borderRadius: 10, marginBottom: 20 }}>
                                <span style={{ fontSize: 16 }}>{form.destinationFlag}</span>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{form.destination}</div>
                                    <div style={{ fontSize: 11, color: 'var(--ink-25)' }}>{form.tripName || `${form.destination} Trip`}</div>
                                </div>
                            </div>

                            {!form.datesSkipped ? (
                                <>
                                    <Field label="Departure & return">
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                            <div style={{ position: 'relative' }}>
                                                <input type="date" value={form.startDate} onChange={(e) => { setField('startDate', e.target.value); setDateErr(false) }} style={inputStyle} />
                                                <svg viewBox="0 0 14 14" fill="none" stroke="var(--ink-25)" strokeWidth="1.5" strokeLinecap="round" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, pointerEvents: 'none' }}>
                                                    <rect x="1" y="2" width="12" height="11" rx="2" /><path d="M4 1v2M10 1v2M1 6h12" />
                                                </svg>
                                            </div>
                                            <div style={{ position: 'relative' }}>
                                                <input type="date" value={form.endDate} onChange={(e) => { setField('endDate', e.target.value); setDateErr(false) }} style={inputStyle} />
                                                <svg viewBox="0 0 14 14" fill="none" stroke="var(--ink-25)" strokeWidth="1.5" strokeLinecap="round" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, pointerEvents: 'none' }}>
                                                    <rect x="1" y="2" width="12" height="11" rx="2" /><path d="M4 1v2M10 1v2M1 6h12" />
                                                </svg>
                                            </div>
                                        </div>
                                        {nights !== null && nights >= 0 && (
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, padding: '4px 10px', background: 'var(--accent-bg)', borderRadius: 100, fontSize: 11.5, fontWeight: 500, color: 'var(--accent)' }}>
                                                <svg viewBox="0 0 12 12" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" style={{ width: 12, height: 12 }}><circle cx="6" cy="6" r="4.5" /><path d="M6 3.5V6l2 1.5" /></svg>
                                                {nights} night{nights !== 1 ? 's' : ''} · {nights + 1} days
                                            </div>
                                        )}
                                        {dateErr && <FieldErr>Return must be after departure.</FieldErr>}
                                    </Field>

                                    {/* Quick picks */}
                                    <Field label="Quick pick">
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                            {QUICK_PICKS.map((d) => (
                                                <button key={d} onClick={() => applyQuickPick(d)}
                                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 100, fontFamily: 'inherit', fontSize: 12, fontWeight: 500, border: '1px solid var(--line-strong)', background: 'transparent', color: d === 7 ? 'var(--accent)' : 'var(--ink-50)', borderColor: d === 7 ? 'var(--accent)' : undefined, cursor: 'pointer', transition: 'all .18s' }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = d === 7 ? 'var(--accent)' : 'var(--line-strong)'; e.currentTarget.style.color = d === 7 ? 'var(--accent)' : 'var(--ink-50)' }}
                                                >
                                                    {d}D
                                                    {d === 7 && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', background: 'var(--accent)', color: '#fff', padding: '1px 5px', borderRadius: 100 }}>rec</span>}
                                                </button>
                                            ))}
                                        </div>
                                        <div style={{ fontSize: 11, color: 'var(--ink-25)', marginTop: 6 }}>Sets departure from tomorrow and calculates return automatically.</div>
                                    </Field>

                                    {/* Skip link */}
                                    <div style={{ textAlign: 'center', marginTop: 8 }}>
                                        <button onClick={skipDates} style={{ fontSize: 12, color: 'var(--ink-25)', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', padding: '4px 8px', transition: 'color .18s' }}
                                            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
                                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-25)')}>
                                            Skip for now — figure it out later
                                        </button>
                                    </div>
                                </>
                            ) : (
                                /* Skipped state */
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: 'var(--bg-warm)', borderRadius: 10, marginBottom: 12 }}>
                                    <svg viewBox="0 0 16 16" fill="none" stroke="var(--warm)" strokeWidth="1.5" strokeLinecap="round" style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }}><circle cx="8" cy="8" r="6" /><path d="M8 5v4M8 11v.5" /></svg>
                                    <span style={{ fontSize: 12.5, color: 'var(--ink-50)', lineHeight: 1.5 }}>
                                        No worries — your trip is saved as <strong>Planning.</strong>{' '}
                                        <button onClick={undoSkip} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontWeight: 500, fontFamily: 'inherit', fontSize: 12.5, padding: 0 }}>Add dates anytime</button> from your dashboard.
                                    </span>
                                </div>
                            )}

                            {/* AI upsell */}
                            <div style={{ display: 'flex', gap: 10, padding: '12px 14px', background: 'var(--bg-warm)', borderRadius: 10, marginTop: 16 }}>
                                <div style={{ flexShrink: 0, width: 20, height: 20, borderRadius: 6, background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                                    <svg viewBox="0 0 12 12" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" style={{ width: 11, height: 11 }}><path d="M6 1v5M6 8.5v.5" /><circle cx="6" cy="6" r="5" /></svg>
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>Want AI to draft this for you?</div>
                                    <div style={{ fontSize: 11.5, color: 'var(--ink-50)', lineHeight: 1.55 }}>Upgrade to Pro and get a full itinerary in minutes.</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ───── STEP 3: Preferences ───── */}
                    {!success && step === 3 && (
                        <div>
                            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>Step 3 of 3</div>
                            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 500, letterSpacing: '-.03em', lineHeight: 1.15, color: 'var(--ink)', marginBottom: 4 }}>
                                Help AI plan <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' }}>your trip.</em>
                            </div>
                            <div style={{ fontSize: 13.5, color: 'var(--ink-50)', marginBottom: 24, lineHeight: 1.6 }}>A few quick picks. AI uses these to build your itinerary just right.</div>

                            {/* AI auto-fill bar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'linear-gradient(135deg,rgba(44,95,78,.06),rgba(184,149,106,.04))', border: '1px solid var(--accent-10)', borderRadius: 10, marginBottom: 24 }}>
                                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <svg viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                                        <path d="M8 2l1.5 3.5L13 7l-3.5 1.5L8 12l-1.5-3.5L3 7l3.5-1.5z" />
                                        <path d="M13 1l.5 1.5L15 3l-1.5.5L13 5l-.5-1.5L11 3l1.5-.5z" />
                                    </svg>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>Let AI fill this for you</div>
                                    <div style={{ fontSize: 11, color: 'var(--ink-50)', marginTop: 1 }}>Kurma picks based on your trip details</div>
                                </div>
                                <button
                                    onClick={() => {
                                        setForm((f) => ({ ...f, activities: ['🏯 Culture & History','🍜 Local Food'], pace: 'balanced', budget: 'smart', specialNeeds: [] }))
                                    }}
                                    style={{ padding: '6px 14px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 100, fontSize: 11.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                                >
                                    Auto-fill
                                </button>
                            </div>

                            {/* Q1: Activities */}
                            <PrefBlock num={1} label="What's your vibe?" hint="pick all that fit">
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {ACTIVITIES.map((a) => (
                                        <QChip key={a} on={form.activities.includes(a)} onClick={() => setField('activities', toggleMulti(form.activities, a))}>{a}</QChip>
                                    ))}
                                </div>
                            </PrefBlock>

                            {/* Q2 + Q3 side by side on desktop */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                                <PrefBlock num={2} label="Trip pace" noMargin>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {PACES.map((p) => (
                                            <QChip key={p.key} on={form.pace === p.key} onClick={() => setField('pace', p.key as Pace)} fullWidth>
                                                {p.emoji} {p.label} <span style={{ fontSize: 10.5, opacity: .6 }}>— {p.sub}</span>
                                            </QChip>
                                        ))}
                                    </div>
                                </PrefBlock>
                                <PrefBlock num={3} label="Overall budget" noMargin>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {BUDGETS.map((b) => (
                                            <button key={b.key} onClick={() => setField('budget', b.key as Budget)}
                                                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 10, fontFamily: 'inherit', cursor: 'pointer', transition: 'all .18s', border: `1.5px solid ${form.budget === b.key ? 'var(--accent)' : 'var(--line-strong)'}`, background: form.budget === b.key ? 'var(--accent-bg)' : 'transparent', textAlign: 'left' }}>
                                                <span style={{ fontSize: 14, width: 20, textAlign: 'center', flexShrink: 0 }}>{b.icon}</span>
                                                <div>
                                                    <div style={{ fontSize: 12.5, fontWeight: 600, color: form.budget === b.key ? 'var(--accent)' : 'var(--ink)', lineHeight: 1.2 }}>{b.label}</div>
                                                    <div style={{ fontSize: 10.5, color: 'var(--ink-25)', marginTop: 1 }}>{b.sub}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </PrefBlock>
                            </div>

                            {/* Q4: Special needs */}
                            <PrefBlock num={4} label="Anything we should know?" hint="optional">
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {SPECIAL.map((s) => (
                                        <QChip key={s} on={form.specialNeeds.includes(s)} onClick={() => setField('specialNeeds', toggleMulti(form.specialNeeds, s))}>{s}</QChip>
                                    ))}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--ink-25)', marginTop: 8 }}>Nothing fits? That's totally fine — AI will still do its thing.</div>
                            </PrefBlock>
                        </div>
                    )}

                    {/* ───── Footer nav ───── */}
                    {!success && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
                            {step > 1 ? (
                                <button onClick={goBack}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: 'transparent', color: 'var(--ink-50)', fontSize: 13, fontWeight: 500, border: '1px solid var(--line-strong)', borderRadius: 100, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ink)'; e.currentTarget.style.color = 'var(--ink)' }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-50)' }}
                                >
                                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 13, height: 13 }}><path d="M8 2L4 6l4 4" /></svg>
                                    Back
                                </button>
                            ) : (
                                <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--ink-50)', textDecoration: 'none' }}>
                                    Cancel
                                </Link>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                {step === 3 && (
                                    <button onClick={() => submitTrip()} style={{ fontSize: 12.5, color: 'var(--ink-25)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '4px 8px' }}>
                                        Skip preferences
                                    </button>
                                )}
                                <button
                                    onClick={goNext}
                                    disabled={submitting}
                                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px 26px', background: 'var(--ink)', color: 'var(--bg)', fontSize: 13, fontWeight: 600, borderRadius: 100, border: 'none', cursor: submitting ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'background .22s', opacity: submitting ? .6 : 1, minWidth: 140 }}
                                    onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = 'var(--accent)' }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--ink)' }}
                                >
                                    {submitting ? (
                                        <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', animation: 'spin .7s linear infinite', display: 'block' }} />
                                    ) : (
                                        <>
                                            {step < 3 ? 'Continue' : 'Create trip'}
                                            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 13, height: 13 }}><path d="M4 2l4 4-4 4" /></svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @media (max-width: 600px) {
                    .steps-label { display: none !important; }
                }
                @media (max-width: 500px) {
                    div[style*="grid-template-columns: 1fr 1fr"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </>
    )
}

/* ─── Shared sub-components ─────────────────────── */

const inputStyle: React.CSSProperties = {
    width: '100%', height: 46, padding: '0 14px',
    background: 'var(--bg)', border: '1px solid var(--line-strong)',
    borderRadius: 10, fontSize: 14, color: 'var(--ink)',
    fontFamily: 'inherit', outline: 'none',
    transition: 'border-color .18s, background .18s',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--ink-25)', marginBottom: 8 }}>
                {label}
            </label>
            {children}
        </div>
    )
}

function FieldHint({ children }: { children: React.ReactNode }) {
    return <div style={{ fontSize: 11.5, color: 'var(--ink-25)', marginTop: 5, lineHeight: 1.5 }}>{children}</div>
}

function FieldErr({ children }: { children: React.ReactNode }) {
    return <div style={{ fontSize: 11.5, color: 'var(--error)', marginTop: 5 }}>{children}</div>
}

function PrefBlock({ num, label, hint, children, noMargin }: { num: number; label: string; hint?: string; children: React.ReactNode; noMargin?: boolean }) {
    return (
        <div style={{ marginBottom: noMargin ? 0 : 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 17, height: 17, borderRadius: '50%', background: 'var(--accent-bg)', color: 'var(--accent)', fontSize: 9, fontWeight: 700 }}>{num}</span>
                {label}
                {hint && <span style={{ fontSize: 10.5, fontWeight: 400, color: 'var(--ink-25)' }}>{hint}</span>}
            </div>
            {children}
        </div>
    )
}

function QChip({ on, onClick, children, fullWidth }: { on: boolean; onClick: () => void; children: React.ReactNode; fullWidth?: boolean }) {
    return (
        <button onClick={onClick}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 100, fontFamily: 'inherit', fontSize: 12.5, fontWeight: on ? 600 : 500, cursor: 'pointer', transition: 'all .18s', border: `1.5px solid ${on ? 'var(--accent)' : 'var(--line-strong)'}`, background: on ? 'var(--accent-bg)' : 'transparent', color: on ? 'var(--accent)' : 'var(--ink-50)', whiteSpace: 'nowrap', width: fullWidth ? '100%' : undefined, justifyContent: fullWidth ? 'flex-start' : undefined }}
        >
            {children}
        </button>
    )
}
