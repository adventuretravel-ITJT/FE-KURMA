'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@/contexts/UserContext'
import { RadioOption, CheckboxOption } from '@/components/ui/SelectOption'
import {
    IconCultureHistory, IconLocalFood, IconNature, IconShopping,
    IconSightseeing, IconThemeParks,
    IconPaceEasy, IconPaceBalanced, IconPacePacked,
    IconBudgetBackpacker, IconBudgetSmart, IconBudgetComfort, IconBudgetSplurge,
    IconHalal, IconAccessibility, IconStroller, IconVegetarian,
    IconInstagrammable, IconOffBeatenPath,
    IconTravelSolo, IconTravelCouple, IconTravelFamily, IconTravelGroup,
    IconFileDefault, IconFileImage, IconFileSpreadsheet,
    IconLinkFlight, IconLinkHotel, IconLinkTour, IconLinkMap, IconLinkDefault,
} from '@/components/ui/TripIcons'

/* â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
type TravelType = 'solo' | 'couple' | 'family' | 'group' | ''
type Pace       = 'easy' | 'balanced' | 'packed' | ''
type Budget     = 'backpacker' | 'smart' | 'comfort' | 'splurge' | ''

interface Dest { flag: string; name: string; country: string; tag?: string }
interface TripLink { url: string; title: string }

interface FormState {
    destination: string; destinationFlag: string; tripName: string
    travelType: TravelType; adults: number; kids: number; littles: number
    startDate: string; endDate: string; datesSkipped: boolean
    activities: string[]; pace: Pace; budget: Budget; specialNeeds: string[]
    files: File[]; links: TripLink[]
}

/* â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const DESTS: Dest[] = [
    { flag: 'ðŸ—¾', name: 'Japan',          country: 'East Asia',      tag: 'Popular' },
    { flag: 'ðŸ‡¨ðŸ‡³', name: 'China',          country: 'East Asia',      tag: 'Popular' },
    { flag: 'ðŸ‡°ðŸ‡·', name: 'South Korea',    country: 'East Asia' },
    { flag: 'ðŸ‡¹ðŸ‡­', name: 'Thailand',       country: 'Southeast Asia', tag: 'Popular' },
    { flag: 'ðŸ‡¸ðŸ‡¬', name: 'Singapore',      country: 'Southeast Asia' },
    { flag: 'ðŸ‡®ðŸ‡©', name: 'Indonesia',      country: 'Southeast Asia' },
    { flag: 'ðŸ‡®ðŸ‡¹', name: 'Italy',          country: 'Europe' },
    { flag: 'ðŸ‡«ðŸ‡·', name: 'France',         country: 'Europe' },
    { flag: 'ðŸ‡¬ðŸ‡§', name: 'United Kingdom', country: 'Europe' },
    { flag: 'ðŸ‡ºðŸ‡¸', name: 'United States',  country: 'North America' },
    { flag: 'ðŸ‡¦ðŸ‡º', name: 'Australia',      country: 'Oceania' },
    { flag: 'ðŸ‡¹ðŸ‡·', name: 'Turkey',         country: 'Europe / Asia' },
    { flag: 'ðŸ‡²ðŸ‡¦', name: 'Morocco',        country: 'North Africa' },
    { flag: 'ðŸ‡¦ðŸ‡ª', name: 'UAE',            country: 'Middle East' },
    { flag: 'ðŸ‡®ðŸ‡³', name: 'India',          country: 'South Asia' },
]

const TRAVEL_TYPES = [
    { key: 'solo',   label: 'Just me',  icon: IconTravelSolo },
    { key: 'couple', label: 'Us two',   icon: IconTravelCouple },
    { key: 'family', label: 'Family',   icon: IconTravelFamily },
    { key: 'group',  label: 'Group',    icon: IconTravelGroup },
] as const

const ACTIVITIES = [
    { key: 'culture',   label: 'Culture & History',  icon: IconCultureHistory },
    { key: 'food',      label: 'Local Food',         icon: IconLocalFood },
    { key: 'nature',    label: 'Nature',             icon: IconNature },
    { key: 'shopping',  label: 'City & Shopping',    icon: IconShopping },
    { key: 'sights',    label: 'Sightseeing',        icon: IconSightseeing },
    { key: 'parks',     label: 'Theme Parks',        icon: IconThemeParks },
]

const PACES = [
    { key: 'easy',     label: 'Easy',     description: '2 – 3 spots a day',   icon: IconPaceEasy },
    { key: 'balanced', label: 'Balanced', description: '4 – 5 spots a day',   icon: IconPaceBalanced },
    { key: 'packed',   label: 'Packed',   description: 'Maximise every hour', icon: IconPacePacked },
]

const BUDGETS = [
    { key: 'backpacker', label: 'Backpacker',  description: 'Stretch every rupiah',     icon: IconBudgetBackpacker },
    { key: 'smart',      label: 'Smart',       description: 'Comfort without guilt',   icon: IconBudgetSmart },
    { key: 'comfort',    label: 'Comfort',     description: 'Mid-range done right',    icon: IconBudgetComfort },
    { key: 'splurge',    label: 'Splurge',     description: 'Treat yourself',          icon: IconBudgetSplurge },
]

const SPECIAL_NEEDS = [
    { key: 'halal',         label: 'Halal food',           icon: IconHalal },
    { key: 'accessibility', label: 'Accessibility',        icon: IconAccessibility },
    { key: 'stroller',      label: 'Stroller-friendly',    icon: IconStroller },
    { key: 'vegetarian',    label: 'Vegetarian / Vegan',   icon: IconVegetarian },
    { key: 'instagram',     label: 'Instagrammable spots', icon: IconInstagrammable },
    { key: 'offpath',       label: 'Off the beaten path',  icon: IconOffBeatenPath },
]

const QUICK_PICKS   = [5, 7, 10, 14, 21]
const ACCEPTED_TYPES = '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xlsx,.csv,.txt'
const MAX_FILE_MB   = 10

/* â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function formatBytes(b: number) {
    if (b < 1024)             return `${b} B`
    if (b < 1024 * 1024)      return `${(b / 1024).toFixed(1)} KB`
    return `${(b / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(name: string) {
    const ext = name.split('.').pop()?.toLowerCase() ?? ''
    if (['jpg','jpeg','png','gif','webp'].includes(ext)) return IconFileImage
    if (['xls','xlsx','csv'].includes(ext))              return IconFileSpreadsheet
    return IconFileDefault
}

function getLinkIcon(url: string) {
    const u = url.toLowerCase()
    if (/airasia|garuda|skyscanner|flight|google\.com\/travel/.test(u)) return IconLinkFlight
    if (/booking|agoda|airbnb|hotel|hostel/.test(u))                     return IconLinkHotel
    if (/tripadvisor|klook|viator|getyourguide/.test(u))                return IconLinkTour
    if (/maps\.google|goo\.gl\/maps/.test(u))                            return IconLinkMap
    return IconLinkDefault
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PAGE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function NewTripPage() {
    const router = useRouter()
    const { onToggleSidebar } = useUser()

    const [step, setStep]             = useState(1)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess]       = useState(false)
    const [createdId, setCreatedId]   = useState<number | null>(null)
    const [createdName, setCreatedName] = useState('')

    const [form, setForm] = useState<FormState>({
        destination: '', destinationFlag: '', tripName: '',
        travelType: '', adults: 2, kids: 0, littles: 0,
        startDate: '', endDate: '', datesSkipped: false,
        activities: [], pace: '', budget: '', specialNeeds: [],
        files: [], links: [],
    })

    const [destErr, setDestErr] = useState(false)
    const [dateErr, setDateErr] = useState(false)

    const [query, setQuery]   = useState('')
    const [ddOpen, setDdOpen] = useState(false)
    const destWrapRef         = useRef<HTMLDivElement>(null)

    const fileInputRef        = useRef<HTMLInputElement>(null)
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

    /* â”€â”€ helpers â”€â”€ */
    function setField<K extends keyof FormState>(key: K, val: FormState[K]) {
        setForm((f) => ({ ...f, [key]: val }))
    }
    function toggleKey(arr: string[], key: string): string[] {
        return arr.includes(key) ? arr.filter((x) => x !== key) : [...arr, key]
    }
    function pickDest(d: Dest) {
        setForm((f) => ({ ...f, destination: d.name, destinationFlag: d.flag, tripName: f.tripName || `${d.name} Trip` }))
        setQuery(''); setDdOpen(false); setDestErr(false)
    }
    function clearDest() {
        setForm((f) => ({ ...f, destination: '', destinationFlag: '', tripName: '' }))
        setQuery('')
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

    /* â”€â”€ file handling â”€â”€ */
    function addFiles(incoming: FileList | null) {
        if (!incoming) return
        setFileErr('')
        const toAdd: File[] = []
        Array.from(incoming).forEach((f) => {
            if (f.size > MAX_FILE_MB * 1024 * 1024) {
                setFileErr(`"${f.name}" exceeds ${MAX_FILE_MB} MB.`)
                return
            }
            if (!form.files.some((x) => x.name === f.name && x.size === f.size)) toAdd.push(f)
        })
        if (toAdd.length) setForm((p) => ({ ...p, files: [...p.files, ...toAdd] }))
    }
    function removeFile(i: number) {
        setForm((f) => ({ ...f, files: f.files.filter((_, idx) => idx !== i) }))
    }
    function handleDrop(e: React.DragEvent) {
        e.preventDefault(); setDragOver(false)
        addFiles(e.dataTransfer.files)
    }

    /* â”€â”€ link handling â”€â”€ */
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

    /* â”€â”€ navigation â”€â”€ */
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
                    quiz_data: {
                        activities:    form.activities,
                        pace:          form.pace || null,
                        budget:        form.budget || null,
                        special_needs: form.specialNeeds,
                        adults:        form.adults,
                        kids:          form.kids,
                        littles:       form.littles,
                        links:         form.links,
                    },
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

    const showStepper = form.travelType === 'family' || form.travelType === 'group'
    const STEP_LABELS = ['Destination', 'Dates', 'Preferences', 'Documents']
    const TOTAL       = 4

    /* â”€â”€ Render â”€â”€ */
    return (
        <>
            {/* Topbar */}
            <div className="dash-topbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={onToggleSidebar} aria-label="Open menu"
                        style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--line-strong)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-50)' }}>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{ width: 15, height: 15 }}><path d="M2 4h12M2 8h12M2 12h12" /></svg>
                    </button>
                    <Link href="/dashboard"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 500, color: 'var(--ink-50)', textDecoration: 'none' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-50)')}>
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 12, height: 12 }}><path d="M8 2L4 6l4 4" /></svg>
                        Dashboard
                    </Link>
                </div>

                {!success && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {STEP_LABELS.map((label, i) => {
                            const n = i + 1; const active = step === n; const done = step > n
                            return (
                                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: done ? 'var(--accent)' : active ? 'var(--ink)' : 'var(--line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: done || active ? '#fff' : 'var(--ink-25)', transition: 'all .2s' }}>
                                            {done
                                                ? <svg viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" style={{ width: 9, height: 9 }}><path d="M2 5l2 2.5 4-4" /></svg>
                                                : n}
                                        </div>
                                        <span style={{ fontSize: 11.5, fontWeight: active ? 600 : 400, color: active ? 'var(--ink)' : 'var(--ink-25)' }} className="steps-label">{label}</span>
                                    </div>
                                    {i < TOTAL - 1 && <div style={{ width: 16, height: 1.5, borderRadius: 2, background: done ? 'var(--accent)' : 'var(--line-strong)', transition: 'background .3s' }} />}
                                </div>
                            )
                        })}
                    </div>
                )}

                <div style={{ width: 36 }} />
            </div>

            <div className="dash-page">
                <div style={{ maxWidth: 560, margin: '0 auto' }}>

                    {/* â”€â”€ SUCCESS â”€â”€ */}
                    {success && (
                        <div style={{ textAlign: 'center', padding: '48px 0' }}>
                            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--accent-bg)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" style={{ width: 24, height: 24 }}><path d="M20 6L9 17l-5-5" /></svg>
                            </div>
                            <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 500, letterSpacing: '-.025em', color: 'var(--ink)', marginBottom: 8 }}>
                                &ldquo;{createdName}&rdquo; is ready!
                            </div>
                            <div style={{ fontSize: 13.5, color: 'var(--ink-50)', maxWidth: 300, margin: '0 auto 8px', lineHeight: 1.65 }}>
                                Your trip is saved. Start building your itinerary anytime.
                            </div>
                            {form.files.length > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--bg-warm)', borderRadius: 10, margin: '16px auto', maxWidth: 360, textAlign: 'left' }}>
                                    <svg viewBox="0 0 16 16" fill="none" stroke="var(--warm)" strokeWidth="1.5" strokeLinecap="round" style={{ width: 14, height: 14, flexShrink: 0 }}>
                                        <circle cx="8" cy="8" r="6" /><path d="M8 5v4M8 11v.5" />
                                    </svg>
                                    <span style={{ fontSize: 12, color: 'var(--ink-50)', lineHeight: 1.4 }}>
                                        {form.files.length} file{form.files.length > 1 ? 's' : ''} noted — upload will be available in the trip detail page.
                                    </span>
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
                                {createdId && (
                                    <button onClick={() => router.push(`/dashboard/trips/${createdId}`)}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '12px 24px', background: 'var(--accent)', color: '#fff', fontSize: 13.5, fontWeight: 600, borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                                        View trip
                                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 13, height: 13 }}><path d="M4 2l4 4-4 4" /></svg>
                                    </button>
                                )}
                                <button onClick={() => router.push('/dashboard')}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '12px 24px', background: 'var(--ink)', color: 'var(--bg)', fontSize: 13.5, fontWeight: 600, borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--ink)')}>
                                    Back to dashboard
                                </button>
                            </div>
                        </div>
                    )}

                    {/* â”€â”€ STEP 1: Destination & Party â”€â”€ */}
                    {!success && step === 1 && (
                        <div>
                            <div style={ss.eyebrow}>Step 1 of {TOTAL}</div>
                            <div style={ss.title}>Where are you <em style={ss.em}>headed?</em></div>
                            <div style={ss.sub}>Pick a destination and tell us who&apos;s coming along.</div>

                            <Field label="Destination">
                                <div ref={destWrapRef} style={{ position: 'relative' }}>
                                    {!form.destination ? (
                                        <>
                                            <svg viewBox="0 0 16 16" fill="none" stroke="var(--ink-25)" strokeWidth="1.5" strokeLinecap="round" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, pointerEvents: 'none' }}>
                                                <circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5l3 3" />
                                            </svg>
                                            <input autoFocus type="text" value={query}
                                                onChange={(e) => { setQuery(e.target.value); setDdOpen(true); setDestErr(false) }}
                                                onFocus={() => setDdOpen(true)}
                                                placeholder="Search city or country…"
                                                style={{ ...ss.input, paddingLeft: 38, borderColor: destErr ? 'var(--error)' : undefined }}
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
                                            <button onClick={clearDest} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: 18, lineHeight: 1, opacity: .6, padding: '0 2px' }}>Ã—</button>
                                        </div>
                                    )}
                                </div>
                                {destErr && <FieldErr>Please pick a destination first.</FieldErr>}
                            </Field>

                            <Field label="Trip name">
                                <input type="text" value={form.tripName} onChange={(e) => setField('tripName', e.target.value)} placeholder="e.g. Japan Spring 2025" maxLength={60} style={ss.input} />
                                <FieldHint>Or we&apos;ll name it after your destination.</FieldHint>
                            </Field>

                            <Field label="Who's coming?">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                    {TRAVEL_TYPES.map((t) => (
                                        <button key={t.key} onClick={() => setField('travelType', t.key)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 9, padding: '10px 14px',
                                                borderRadius: 10, fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
                                                cursor: 'pointer', transition: 'all .18s',
                                                border: `1.5px solid ${form.travelType === t.key ? 'var(--accent)' : 'var(--line-strong)'}`,
                                                background: form.travelType === t.key ? 'var(--accent-bg)' : 'var(--bg)',
                                                color: form.travelType === t.key ? 'var(--accent)' : 'var(--ink-50)',
                                            }}>
                                            <span style={{ width: 16, height: 16, flexShrink: 0, color: form.travelType === t.key ? 'var(--accent)' : 'var(--ink-25)' }}>{t.icon}</span>
                                            {t.label}
                                        </button>
                                    ))}
                                </div>

                                {showStepper && (
                                    <div style={{ marginTop: 12, padding: 14, background: 'var(--bg)', border: '1px solid var(--line-strong)', borderRadius: 12 }}>
                                        <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-25)', marginBottom: 10 }}>
                                            {form.travelType === 'family' ? "Who's in the family?" : "Who's in the group?"}
                                        </div>
                                        {([
                                            { field: 'adults',  label: 'Adults',      sub: '13 and older',   show: true },
                                            { field: 'kids',    label: 'Kids',         sub: '5 – 12 years',   show: form.travelType === 'family' },
                                            { field: 'littles', label: 'Little ones',  sub: 'Under 5',        show: form.travelType === 'family' },
                                        ] as const).filter((r) => r.show).map((row, i, arr) => (
                                            <div key={row.field} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none' }}>
                                                <div>
                                                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{row.label}</div>
                                                    <div style={{ fontSize: 11, color: 'var(--ink-25)', marginTop: 1 }}>{row.sub}</div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <button onClick={() => stepperChange(row.field, -1)}
                                                        disabled={form[row.field] <= (row.field === 'adults' ? 1 : 0)}
                                                        style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid var(--line-strong)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-50)', fontSize: 16, fontFamily: 'inherit', opacity: form[row.field] <= (row.field === 'adults' ? 1 : 0) ? .3 : 1 }}>âˆ’</button>
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

                    {/* â”€â”€ STEP 2: Dates â”€â”€ */}
                    {!success && step === 2 && (
                        <div>
                            <div style={ss.eyebrow}>Step 2 of {TOTAL}</div>
                            <div style={ss.title}>When are you <em style={ss.em}>going?</em></div>
                            <div style={ss.sub}>Set your travel dates, or skip and decide later.</div>

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
                                            {['startDate','endDate'].map((k) => (
                                                <div key={k} style={{ position: 'relative' }}>
                                                    <input type="date"
                                                        value={form[k as 'startDate'|'endDate']}
                                                        onChange={(e) => { setField(k as 'startDate'|'endDate', e.target.value); setDateErr(false) }}
                                                        style={ss.input}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        {nights !== null && nights >= 0 && (
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, padding: '4px 10px', background: 'var(--accent-bg)', borderRadius: 100, fontSize: 11.5, fontWeight: 500, color: 'var(--accent)' }}>
                                                <svg viewBox="0 0 12 12" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" style={{ width: 12, height: 12 }}><circle cx="6" cy="6" r="4.5" /><path d="M6 3.5V6l2 1.5" /></svg>
                                                {nights} night{nights !== 1 ? 's' : ''} · {nights + 1} days
                                            </div>
                                        )}
                                        {dateErr && <FieldErr>Return must be after departure.</FieldErr>}
                                    </Field>

                                    <Field label="Quick pick">
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                            {QUICK_PICKS.map((d) => (
                                                <button key={d} onClick={() => applyQuickPick(d)}
                                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 100, fontFamily: 'inherit', fontSize: 12, fontWeight: 500, border: `1px solid ${d === 7 ? 'var(--accent)' : 'var(--line-strong)'}`, background: d === 7 ? 'var(--accent-bg)' : 'transparent', color: d === 7 ? 'var(--accent)' : 'var(--ink-50)', cursor: 'pointer', transition: 'all .18s' }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = d === 7 ? 'var(--accent)' : 'var(--line-strong)'; e.currentTarget.style.color = d === 7 ? 'var(--accent)' : 'var(--ink-50)' }}>
                                                    {d} days
                                                    {d === 7 && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', background: 'var(--accent)', color: '#fff', padding: '1px 5px', borderRadius: 100 }}>rec</span>}
                                                </button>
                                            ))}
                                        </div>
                                        <FieldHint>Sets departure from tomorrow and calculates return automatically.</FieldHint>
                                    </Field>

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
                                        No worries — saved as <strong>Planning.</strong>{' '}
                                        <button onClick={undoSkip} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontWeight: 500, fontFamily: 'inherit', fontSize: 12.5, padding: 0 }}>Add dates anytime.</button>
                                    </span>
                                </div>
                            )}

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

                    {/* â”€â”€ STEP 3: Preferences â”€â”€ */}
                    {!success && step === 3 && (
                        <div>
                            <div style={ss.eyebrow}>Step 3 of {TOTAL}</div>
                            <div style={ss.title}>Help AI plan <em style={ss.em}>your trip.</em></div>
                            <div style={ss.sub}>A few quick picks. AI uses these to build your itinerary just right.</div>

                            {/* AI auto-fill */}
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
                                    onClick={() => setForm((f) => ({ ...f, activities: ['culture','food'], pace: 'balanced', budget: 'smart', specialNeeds: [] }))}
                                    style={{ padding: '6px 14px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 100, fontSize: 11.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                                    Auto-fill
                                </button>
                            </div>

                            {/* Q1: Activities */}
                            <PrefBlock num={1} label="What's your vibe?" hint="select all that apply">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {ACTIVITIES.map((a) => (
                                        <CheckboxOption
                                            key={a.key}
                                            selected={form.activities.includes(a.key)}
                                            onClick={() => setField('activities', toggleKey(form.activities, a.key))}
                                            icon={a.icon}
                                            label={a.label}
                                        />
                                    ))}
                                </div>
                            </PrefBlock>

                            {/* Q2: Trip pace */}
                            <PrefBlock num={2} label="Trip pace">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {PACES.map((p) => (
                                        <RadioOption
                                            key={p.key}
                                            selected={form.pace === p.key}
                                            onClick={() => setField('pace', p.key as Pace)}
                                            icon={p.icon}
                                            label={p.label}
                                            description={p.description}
                                        />
                                    ))}
                                </div>
                            </PrefBlock>

                            {/* Q3: Budget */}
                            <PrefBlock num={3} label="Overall budget">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {BUDGETS.map((b) => (
                                        <RadioOption
                                            key={b.key}
                                            selected={form.budget === b.key}
                                            onClick={() => setField('budget', b.key as Budget)}
                                            icon={b.icon}
                                            label={b.label}
                                            description={b.description}
                                        />
                                    ))}
                                </div>
                            </PrefBlock>

                            {/* Q4: Special needs */}
                            <PrefBlock num={4} label="Anything we should know?" hint="optional">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {SPECIAL_NEEDS.map((s) => (
                                        <CheckboxOption
                                            key={s.key}
                                            selected={form.specialNeeds.includes(s.key)}
                                            onClick={() => setField('specialNeeds', toggleKey(form.specialNeeds, s.key))}
                                            icon={s.icon}
                                            label={s.label}
                                        />
                                    ))}
                                </div>
                                <FieldHint>Nothing fits? That&apos;s totally fine — AI will still do its thing.</FieldHint>
                            </PrefBlock>
                        </div>
                    )}

                    {/* â”€â”€ STEP 4: Documents & Links â”€â”€ */}
                    {!success && step === 4 && (
                        <div>
                            <div style={ss.eyebrow}>Step 4 of {TOTAL}</div>
                            <div style={ss.title}>Add your <em style={ss.em}>references.</em></div>
                            <div style={ss.sub}>Upload travel documents and save useful links — all in one place.</div>

                            {/* File upload */}
                            <Field label="Travel documents">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                    style={{ border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--line-strong)'}`, borderRadius: 12, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', background: dragOver ? 'var(--accent-bg)' : 'var(--bg)', transition: 'all .18s' }}
                                >
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: dragOver ? 'rgba(44,95,78,.12)' : 'var(--ink-05)', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: dragOver ? 'var(--accent)' : 'var(--ink-25)' }}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
                                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                    </div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: dragOver ? 'var(--accent)' : 'var(--ink)', marginBottom: 4 }}>
                                        {dragOver ? 'Drop files here' : 'Click to upload or drag & drop'}
                                    </div>
                                    <div style={{ fontSize: 11.5, color: 'var(--ink-25)' }}>PDF, JPG, PNG, DOC, DOCX, XLSX · Max {MAX_FILE_MB} MB each</div>
                                </div>
                                <input ref={fileInputRef} type="file" multiple accept={ACCEPTED_TYPES} style={{ display: 'none' }} onChange={(e) => addFiles(e.target.files)} />
                                {fileErr && <FieldErr>{fileErr}</FieldErr>}

                                {form.files.length > 0 && (
                                    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {form.files.map((file, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 10 }}>
                                                <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--ink-05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-50)', flexShrink: 0 }}>
                                                    {getFileIcon(file.name)}
                                                </span>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                                                    <div style={{ fontSize: 11, color: 'var(--ink-25)', marginTop: 1 }}>{formatBytes(file.size)}</div>
                                                </div>
                                                <button onClick={() => removeFile(i)} style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--line-strong)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-25)', flexShrink: 0, transition: 'all .15s' }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--error)'; e.currentTarget.style.color = 'var(--error)' }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-25)' }}>
                                                    <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 9, height: 9 }}><path d="M2 2l6 6M8 2l-6 6" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Field>

                            {/* Links */}
                            <Field label="Useful links">
                                <FieldHint>Save bookings, maps, tour pages, or any travel reference.</FieldHint>
                                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <input type="url" value={linkInput.url} onChange={(e) => { setLinkInput((p) => ({ ...p, url: e.target.value })); setLinkErr('') }}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLink() } }}
                                        placeholder="https://booking.com/your-hotel" style={ss.input} />
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <input type="text" value={linkInput.title} onChange={(e) => setLinkInput((p) => ({ ...p, title: e.target.value }))}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLink() } }}
                                            placeholder="Label — e.g. Hotel booking, Flight ticket" style={{ ...ss.input, flex: 1 }} />
                                        <button onClick={addLink}
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '0 18px', background: 'var(--ink)', color: 'var(--bg)', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, transition: 'background .18s' }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent)')}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--ink)')}>
                                            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ width: 11, height: 11 }}><path d="M6 1v10M1 6h10" /></svg>
                                            Add
                                        </button>
                                    </div>
                                </div>
                                {linkErr && <FieldErr>{linkErr}</FieldErr>}

                                {form.links.length > 0 && (
                                    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {form.links.map((link, i) => {
                                            const displayTitle = link.title || (() => { try { return new URL(link.url).hostname.replace('www.','') } catch { return link.url } })()
                                            return (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 10 }}>
                                                    <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--ink-05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-50)', flexShrink: 0 }}>
                                                        {getLinkIcon(link.url)}
                                                    </span>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayTitle}</div>
                                                        <a href={link.url} target="_blank" rel="noopener noreferrer"
                                                            style={{ fontSize: 11, color: 'var(--accent)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', textDecoration: 'none' }}>
                                                            {link.url}
                                                        </a>
                                                    </div>
                                                    <button onClick={() => removeLink(i)} style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--line-strong)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-25)', flexShrink: 0, transition: 'all .15s' }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--error)'; e.currentTarget.style.color = 'var(--error)' }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-25)' }}>
                                                        <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 9, height: 9 }}><path d="M2 2l6 6M8 2l-6 6" /></svg>
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                {form.files.length === 0 && form.links.length === 0 && (
                                    <div style={{ marginTop: 16, padding: '14px 16px', background: 'var(--bg-warm)', borderRadius: 10, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                        <svg viewBox="0 0 16 16" fill="none" stroke="var(--warm)" strokeWidth="1.5" strokeLinecap="round" style={{ width: 14, height: 14, flexShrink: 0, marginTop: 1 }}>
                                            <circle cx="8" cy="8" r="6" /><path d="M8 5v4M8 11v.5" />
                                        </svg>
                                        <div>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>Pro tip</div>
                                            <div style={{ fontSize: 11.5, color: 'var(--ink-50)', lineHeight: 1.55 }}>
                                                Save your hotel confirmation, flight booking, and map links here — everything in one place when you travel.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {(form.files.length > 0 || form.links.length > 0) && (
                                    <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                                        {form.files.length > 0 && (
                                            <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                                                {form.files.length} file{form.files.length > 1 ? 's' : ''} attached
                                            </span>
                                        )}
                                        {form.links.length > 0 && (
                                            <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                                                {form.links.length} link{form.links.length > 1 ? 's' : ''} saved
                                            </span>
                                        )}
                                    </div>
                                )}
                            </Field>
                        </div>
                    )}

                    {/* â”€â”€ Footer nav â”€â”€ */}
                    {!success && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
                            {step > 1 ? (
                                <button onClick={goBack}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: 'transparent', color: 'var(--ink-50)', fontSize: 13, fontWeight: 500, border: '1px solid var(--line-strong)', borderRadius: 100, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ink)'; e.currentTarget.style.color = 'var(--ink)' }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-50)' }}>
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
                                <button onClick={goNext} disabled={submitting}
                                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px 26px', background: 'var(--ink)', color: 'var(--bg)', fontSize: 13, fontWeight: 600, borderRadius: 100, border: 'none', cursor: submitting ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'background .22s', opacity: submitting ? .6 : 1, minWidth: 140 }}
                                    onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = 'var(--accent)' }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--ink)' }}>
                                    {submitting
                                        ? <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', animation: 'spin .7s linear infinite', display: 'block' }} />
                                        : <>{step < TOTAL ? 'Continue' : 'Create trip'}<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 13, height: 13 }}><path d="M4 2l4 4-4 4" /></svg></>
                                    }
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @media (max-width: 600px) { .steps-label { display: none !important; } }
            `}</style>
        </>
    )
}

/* â”€â”€â”€ Shared style tokens â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const ss = {
    eyebrow: { fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 } as React.CSSProperties,
    title:   { fontFamily: 'var(--font-fraunces)', fontSize: 26, fontWeight: 500, letterSpacing: '-.03em', lineHeight: 1.15, color: 'var(--ink)', marginBottom: 4 } as React.CSSProperties,
    sub:     { fontSize: 13.5, color: 'var(--ink-50)', marginBottom: 28, lineHeight: 1.6 } as React.CSSProperties,
    em:      { fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' } as React.CSSProperties,
    input:   { width: '100%', height: 46, padding: '0 14px', background: 'var(--bg)', border: '1px solid var(--line-strong)', borderRadius: 10, fontSize: 14, color: 'var(--ink)', fontFamily: 'inherit', outline: 'none', transition: 'border-color .18s, background .18s' } as React.CSSProperties,
}

/* â”€â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--ink-25)', marginBottom: 8 }}>{label}</label>
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
function PrefBlock({ num, label, hint, children }: { num: number; label: string; hint?: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: '50%', background: 'var(--accent-bg)', color: 'var(--accent)', fontSize: 9, fontWeight: 700 }}>{num}</span>
                {label}
                {hint && <span style={{ fontSize: 10.5, fontWeight: 400, color: 'var(--ink-25)' }}>{hint}</span>}
            </div>
            {children}
        </div>
    )
}

