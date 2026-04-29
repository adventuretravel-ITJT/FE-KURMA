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
interface TripLink { url: string; title: string }

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
    // Step 4
    files: File[]
    links: TripLink[]
}

/* ─── Destination list ──────────────────────────── */
const DESTS: Dest[] = [
    { flag: '🗾', name: 'Japan',          country: 'East Asia',      tag: 'Popular' },
    { flag: '🇨🇳', name: 'China',          country: 'East Asia',      tag: 'Popular' },
    { flag: '🇰🇷', name: 'South Korea',    country: 'East Asia' },
    { flag: '🇹🇭', name: 'Thailand',       country: 'Southeast Asia', tag: 'Popular' },
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

const ACCEPTED_TYPES = '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xlsx,.csv,.txt'
const MAX_FILE_MB    = 10

const LINK_CATEGORY_ICONS: Record<string, string> = {
    flight:  '✈️',
    hotel:   '🏨',
    tour:    '🎟️',
    map:     '🗺️',
    other:   '🔗',
}

function detectCategory(url: string): string {
    const u = url.toLowerCase()
    if (u.includes('booking') || u.includes('agoda') || u.includes('airbnb') || u.includes('hotel')) return 'hotel'
    if (u.includes('flight') || u.includes('airasia') || u.includes('garuda') || u.includes('skyscanner') || u.includes('google.com/travel')) return 'flight'
    if (u.includes('tripadvisor') || u.includes('klook') || u.includes('viator') || u.includes('getyourguide')) return 'tour'
    if (u.includes('maps.google') || u.includes('goo.gl/maps')) return 'map'
    return 'other'
}

function formatBytes(b: number) {
    if (b < 1024) return `${b} B`
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
    return `${(b / (1024 * 1024)).toFixed(1)} MB`
}

function fileIcon(name: string) {
    const ext = name.split('.').pop()?.toLowerCase()
    if (ext === 'pdf') return '📄'
    if (['jpg','jpeg','png','gif','webp'].includes(ext ?? '')) return '🖼️'
    if (['doc','docx'].includes(ext ?? '')) return '📝'
    if (['xls','xlsx','csv'].includes(ext ?? '')) return '📊'
    return '📎'
}

/* ─── Page ──────────────────────────────────────── */
export default function NewTripPage() {
    const router = useRouter()
    const { onToggleSidebar } = useUser()

    const [step, setStep]         = useState(1)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess]   = useState(false)
    const [createdId, setCreatedId]   = useState<number | null>(null)
    const [createdName, setCreatedName] = useState('')

    const [form, setForm] = useState<FormState>({
        destination: '', destinationFlag: '', tripName: '',
        travelType: '', adults: 2, kids: 0, littles: 0,
        startDate: '', endDate: '', datesSkipped: false,
        activities: [], pace: '', budget: '', specialNeeds: [],
        files: [], links: [],
    })

    // Validation errors
    const [destErr, setDestErr] = useState(false)
    const [dateErr, setDateErr] = useState(false)

    // Destination search
    const [query, setQuery]     = useState('')
    const [ddOpen, setDdOpen]   = useState(false)
    const destWrapRef           = useRef<HTMLDivElement>(null)

    // Step 4 refs & state
    const fileInputRef          = useRef<HTMLInputElement>(null)
    const [dragOver, setDragOver] = useState(false)
    const [linkInput, setLinkInput] = useState({ url: '', title: '' })
    const [linkErr, setLinkErr] = useState('')
    const [fileErr, setFileErr] = useState('')

    const filtered = query.trim()
        ? DESTS.filter((d) =>
            d.name.toLowerCase().includes(query.toLowerCase()) ||
            d.country.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 6)
        : []

    useEffect(() => {
        function onDown(e: MouseEvent) {
            if (destWrapRef.current && !destWrapRef.current.contains(e.target as Node)) setDdOpen(false)
        }
        document.addEventListener('mousedown', onDown)
        return () => document.removeEventListener('mousedown', onDown)
    }, [])

    const nights = form.startDate && form.endDate
        ? Math.round((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000)
        : null

    /* ── helpers ── */
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
    function applyQuickPick(n: number) {
        const from = new Date(); from.setDate(from.getDate() + 1)
        const to   = new Date(from); to.setDate(to.getDate() + n)
        const fmt  = (d: Date) => d.toISOString().split('T')[0]
        setForm((f) => ({ ...f, startDate: fmt(from), endDate: fmt(to), datesSkipped: false }))
        setDateErr(false)
    }
    function skipDates() {
        setForm((f) => ({ ...f, startDate: '', endDate: '', datesSkipped: true }))
        setDateErr(false)
    }
    function undoSkip() { setForm((f) => ({ ...f, datesSkipped: false })) }
    function stepperChange(field: 'adults' | 'kids' | 'littles', delta: number) {
        setForm((f) => {
            const min = field === 'adults' ? 1 : 0
            return { ...f, [field]: Math.max(min, f[field] + delta) }
        })
    }

    /* ── file handling ── */
    function addFiles(incoming: FileList | null) {
        if (!incoming) return
        setFileErr('')
        const toAdd: File[] = []
        Array.from(incoming).forEach((f) => {
            if (f.size > MAX_FILE_MB * 1024 * 1024) {
                setFileErr(`"${f.name}" exceeds ${MAX_FILE_MB} MB limit.`)
                return
            }
            if (form.files.some((x) => x.name === f.name && x.size === f.size)) return
            toAdd.push(f)
        })
        if (toAdd.length) setForm((prev) => ({ ...prev, files: [...prev.files, ...toAdd] }))
    }
    function removeFile(i: number) {
        setForm((f) => ({ ...f, files: f.files.filter((_, idx) => idx !== i) }))
    }
    function handleDrop(e: React.DragEvent) {
        e.preventDefault(); setDragOver(false)
        addFiles(e.dataTransfer.files)
    }

    /* ── link handling ── */
    function addLink() {
        setLinkErr('')
        const url = linkInput.url.trim()
        if (!url) { setLinkErr('Please enter a URL.'); return }
        try { new URL(url) } catch { setLinkErr('Please enter a valid URL (include https://).'); return }
        if (form.links.some((l) => l.url === url)) { setLinkErr('This link was already added.'); return }
        setForm((f) => ({ ...f, links: [...f.links, { url, title: linkInput.title.trim() }] }))
        setLinkInput({ url: '', title: '' })
    }
    function removeLink(i: number) {
        setForm((f) => ({ ...f, links: f.links.filter((_, idx) => idx !== i) }))
    }

    /* ── navigation ── */
    function goNext() {
        if (step === 1) {
            if (!form.destination) { setDestErr(true); return }
            setStep(2)
        } else if (step === 2) {
            if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) { setDateErr(true); return }
            setStep(3)
        } else if (step === 3) {
            setStep(4)
        } else {
            submitTrip()
        }
    }
    function goBack() { if (step > 1) setStep((s) => s - 1) }

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
                    status:           'draft',
                    start_date:       form.datesSkipped ? null : (form.startDate || null),
                    end_date:         form.datesSkipped ? null : (form.endDate || null),
                    links:            form.links.length > 0 ? form.links : undefined,
                }),
            })
            if (res.ok) {
                const data = await res.json()
                setCreatedId(data.data?.id ?? data.id ?? null)
                setCreatedName(name)
                setSuccess(true)
            }
        } finally {
            setSubmitting(false)
        }
    }

    const showStepper  = form.travelType === 'family' || form.travelType === 'group'
    const STEP_LABELS  = ['Destination', 'Dates', 'Preferences', 'Documents']
    const TOTAL_STEPS  = 4

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
                                    {i < TOTAL_STEPS - 1 && <div style={{ width: 16, height: 1.5, borderRadius: 2, background: done ? 'var(--accent)' : 'var(--line-strong)', transition: 'background .3s' }} />}
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
                            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 500, letterSpacing: '-.025em', color: 'var(--ink)', marginBottom: 8 }}>
                                &ldquo;{createdName}&rdquo; is ready!
                            </div>
                            <div style={{ fontSize: 13.5, color: 'var(--ink-50)', maxWidth: 300, margin: '0 auto 8px', lineHeight: 1.65 }}>
                                Your trip is saved. You can start building your itinerary anytime.
                            </div>
                            {form.files.length > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--bg-warm)', borderRadius: 10, margin: '16px 0', textAlign: 'left', maxWidth: 360, marginLeft: 'auto', marginRight: 'auto' }}>
                                    <svg viewBox="0 0 16 16" fill="none" stroke="var(--warm)" strokeWidth="1.5" strokeLinecap="round" style={{ width: 14, height: 14, flexShrink: 0 }}>
                                        <circle cx="8" cy="8" r="6" /><path d="M8 5v4M8 11v.5" />
                                    </svg>
                                    <span style={{ fontSize: 12, color: 'var(--ink-50)', lineHeight: 1.4 }}>
                                        {form.files.length} file{form.files.length > 1 ? 's' : ''} noted — file storage will be available in the trip detail page.
                                    </span>
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
                                {createdId && (
                                    <button
                                        onClick={() => router.push(`/dashboard/trips/${createdId}`)}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '12px 24px', background: 'var(--accent)', color: '#fff', fontSize: 13.5, fontWeight: 600, borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                                    >
                                        View trip
                                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 13, height: 13 }}><path d="M4 2l4 4-4 4" /></svg>
                                    </button>
                                )}
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '12px 24px', background: 'var(--ink)', color: 'var(--bg)', fontSize: 13.5, fontWeight: 600, borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--ink)')}
                                >
                                    Back to dashboard
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ───── STEP 1: Destination & Party ───── */}
                    {!success && step === 1 && (
                        <div>
                            <div style={eyebrowStyle}>Step 1 of {TOTAL_STEPS}</div>
                            <div style={titleStyle}>
                                Where are you <em style={accentItalic}>headed?</em>
                            </div>
                            <div style={subStyle}>Pick a destination and tell us who&apos;s coming along.</div>

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
                                <FieldHint>Or we&apos;ll name it after your destination.</FieldHint>
                            </Field>

                            {/* Who's coming */}
                            <Field label="Who's coming?">
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                    {[
                                        { key: 'solo',   label: 'Just me',  icon: '👤' },
                                        { key: 'couple', label: 'Us two',   icon: '👫' },
                                        { key: 'family', label: 'Family',   icon: '👨‍👩‍👧' },
                                        { key: 'group',  label: 'Group',    icon: '👥' },
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
                            <div style={eyebrowStyle}>Step 2 of {TOTAL_STEPS}</div>
                            <div style={titleStyle}>
                                When are you <em style={accentItalic}>going?</em>
                            </div>
                            <div style={subStyle}>
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
                                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 100, fontFamily: 'inherit', fontSize: 12, fontWeight: 500, border: `1px solid ${d === 7 ? 'var(--accent)' : 'var(--line-strong)'}`, background: d === 7 ? 'var(--accent-bg)' : 'transparent', color: d === 7 ? 'var(--accent)' : 'var(--ink-50)', cursor: 'pointer', transition: 'all .18s' }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = d === 7 ? 'var(--accent)' : 'var(--line-strong)'; e.currentTarget.style.color = d === 7 ? 'var(--accent)' : 'var(--ink-50)' }}
                                                >
                                                    {d}D
                                                    {d === 7 && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', background: 'var(--accent)', color: '#fff', padding: '1px 5px', borderRadius: 100 }}>rec</span>}
                                                </button>
                                            ))}
                                        </div>
                                        <FieldHint>Sets departure from tomorrow and calculates return automatically.</FieldHint>
                                    </Field>

                                    {/* Skip */}
                                    <div style={{ textAlign: 'center', marginTop: 8 }}>
                                        <button onClick={skipDates} style={{ fontSize: 12, color: 'var(--ink-25)', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', padding: '4px 8px', transition: 'color .18s' }}
                                            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
                                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-25)')}>
                                            Skip for now — figure it out later
                                        </button>
                                    </div>
                                </>
                            ) : (
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
                            <div style={eyebrowStyle}>Step 3 of {TOTAL_STEPS}</div>
                            <div style={titleStyle}>
                                Help AI plan <em style={accentItalic}>your trip.</em>
                            </div>
                            <div style={subStyle}>A few quick picks. AI uses these to build your itinerary just right.</div>

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
                                    onClick={() => setForm((f) => ({ ...f, activities: ['🏯 Culture & History','🍜 Local Food'], pace: 'balanced', budget: 'smart', specialNeeds: [] }))}
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

                            {/* Q2 + Q3 */}
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

                            {/* Q4: Special */}
                            <PrefBlock num={4} label="Anything we should know?" hint="optional">
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {SPECIAL.map((s) => (
                                        <QChip key={s} on={form.specialNeeds.includes(s)} onClick={() => setField('specialNeeds', toggleMulti(form.specialNeeds, s))}>{s}</QChip>
                                    ))}
                                </div>
                                <FieldHint>Nothing fits? That&apos;s totally fine — AI will still do its thing.</FieldHint>
                            </PrefBlock>
                        </div>
                    )}

                    {/* ───── STEP 4: Files & Links ───── */}
                    {!success && step === 4 && (
                        <div>
                            <div style={eyebrowStyle}>Step 4 of {TOTAL_STEPS}</div>
                            <div style={titleStyle}>
                                Add your <em style={accentItalic}>references.</em>
                            </div>
                            <div style={subStyle}>
                                Upload travel documents and save useful links — all in one place for your trip.
                            </div>

                            {/* ── File upload ── */}
                            <Field label="Travel documents">
                                {/* Drop zone */}
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                    style={{
                                        border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--line-strong)'}`,
                                        borderRadius: 12,
                                        padding: '28px 20px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        background: dragOver ? 'var(--accent-bg)' : 'var(--bg)',
                                        transition: 'all .18s',
                                    }}
                                >
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: dragOver ? 'var(--accent-bg)' : 'var(--ink-05)', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke={dragOver ? 'var(--accent)' : 'var(--ink-25)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
                                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                    </div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: dragOver ? 'var(--accent)' : 'var(--ink)', marginBottom: 4 }}>
                                        {dragOver ? 'Drop files here' : 'Click to upload or drag & drop'}
                                    </div>
                                    <div style={{ fontSize: 11.5, color: 'var(--ink-25)' }}>
                                        PDF, JPG, PNG, DOC, DOCX, XLSX · Max {MAX_FILE_MB} MB each
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept={ACCEPTED_TYPES}
                                    style={{ display: 'none' }}
                                    onChange={(e) => addFiles(e.target.files)}
                                />

                                {fileErr && <FieldErr>{fileErr}</FieldErr>}

                                {/* File list */}
                                {form.files.length > 0 && (
                                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {form.files.map((file, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 10 }}>
                                                <span style={{ fontSize: 18, flexShrink: 0 }}>{fileIcon(file.name)}</span>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                                                    <div style={{ fontSize: 11, color: 'var(--ink-25)', marginTop: 1 }}>{formatBytes(file.size)}</div>
                                                </div>
                                                <button onClick={() => removeFile(i)}
                                                    style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--line-strong)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-25)', flexShrink: 0, transition: 'all .15s' }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--error)'; e.currentTarget.style.color = 'var(--error)' }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-25)' }}
                                                >
                                                    <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 9, height: 9 }}><path d="M2 2l6 6M8 2l-6 6" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Field>

                            {/* ── Links ── */}
                            <Field label="Useful links">
                                <FieldHint>Save booking confirmations, maps, tour pages, or any travel link.</FieldHint>

                                {/* Link input row */}
                                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <input
                                        type="url"
                                        value={linkInput.url}
                                        onChange={(e) => { setLinkInput((p) => ({ ...p, url: e.target.value })); setLinkErr('') }}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLink() } }}
                                        placeholder="https://booking.com/your-hotel"
                                        style={inputStyle}
                                    />
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <input
                                            type="text"
                                            value={linkInput.title}
                                            onChange={(e) => setLinkInput((p) => ({ ...p, title: e.target.value }))}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLink() } }}
                                            placeholder="Label (e.g. Hotel booking, Flight ticket)"
                                            style={{ ...inputStyle, flex: 1 }}
                                        />
                                        <button
                                            onClick={addLink}
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '0 18px', background: 'var(--ink)', color: 'var(--bg)', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, transition: 'background .18s' }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent)')}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--ink)')}
                                        >
                                            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ width: 11, height: 11 }}><path d="M6 1v10M1 6h10" /></svg>
                                            Add
                                        </button>
                                    </div>
                                </div>

                                {linkErr && <FieldErr>{linkErr}</FieldErr>}

                                {/* Link list */}
                                {form.links.length > 0 && (
                                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {form.links.map((link, i) => {
                                            const cat  = detectCategory(link.url)
                                            const icon = LINK_CATEGORY_ICONS[cat]
                                            const displayTitle = link.title || (() => {
                                                try { return new URL(link.url).hostname.replace('www.', '') }
                                                catch { return link.url }
                                            })()
                                            return (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 10 }}>
                                                    <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayTitle}</div>
                                                        <a
                                                            href={link.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{ fontSize: 11, color: 'var(--accent)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', textDecoration: 'none' }}
                                                        >
                                                            {link.url}
                                                        </a>
                                                    </div>
                                                    <button onClick={() => removeLink(i)}
                                                        style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--line-strong)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-25)', flexShrink: 0, transition: 'all .15s' }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--error)'; e.currentTarget.style.color = 'var(--error)' }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-25)' }}
                                                    >
                                                        <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 9, height: 9 }}><path d="M2 2l6 6M8 2l-6 6" /></svg>
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                {form.links.length === 0 && form.files.length === 0 && (
                                    <div style={{ marginTop: 16, padding: '14px 16px', background: 'var(--bg-warm)', borderRadius: 10, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                        <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
                                        <div>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>Pro tip</div>
                                            <div style={{ fontSize: 11.5, color: 'var(--ink-50)', lineHeight: 1.55 }}>
                                                Save your hotel confirmation, flight booking, and Google Maps links here so everything is in one place when you travel.
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Field>

                            {/* Summary badges */}
                            {(form.files.length > 0 || form.links.length > 0) && (
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                                    {form.files.length > 0 && (
                                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                                            📎 {form.files.length} file{form.files.length > 1 ? 's' : ''}
                                        </span>
                                    )}
                                    {form.links.length > 0 && (
                                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                                            🔗 {form.links.length} link{form.links.length > 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                            )}
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
                                    <button onClick={() => setStep(4)} style={{ fontSize: 12.5, color: 'var(--ink-25)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '4px 8px' }}>
                                        Skip preferences
                                    </button>
                                )}
                                {step === 4 && (
                                    <button onClick={() => submitTrip()} style={{ fontSize: 12.5, color: 'var(--ink-25)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '4px 8px' }}>
                                        Skip this step
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
                                            {step < TOTAL_STEPS ? 'Continue' : 'Create trip'}
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

/* ─── Shared styles ─────────────────────────────── */
const eyebrowStyle: React.CSSProperties = {
    fontSize: 10, fontWeight: 600, letterSpacing: '.1em',
    textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6,
}
const titleStyle: React.CSSProperties = {
    fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 500,
    letterSpacing: '-.03em', lineHeight: 1.15, color: 'var(--ink)', marginBottom: 4,
}
const subStyle: React.CSSProperties = {
    fontSize: 13.5, color: 'var(--ink-50)', marginBottom: 28, lineHeight: 1.6,
}
const accentItalic: React.CSSProperties = {
    fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)',
}
const inputStyle: React.CSSProperties = {
    width: '100%', height: 46, padding: '0 14px',
    background: 'var(--bg)', border: '1px solid var(--line-strong)',
    borderRadius: 10, fontSize: 14, color: 'var(--ink)',
    fontFamily: 'inherit', outline: 'none',
    transition: 'border-color .18s, background .18s',
}

/* ─── Shared sub-components ─────────────────────── */
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
        >{children}</button>
    )
}
