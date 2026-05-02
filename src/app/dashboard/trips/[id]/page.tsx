'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@/src/contexts/UserContext'
import {
  Trip, Day, Activity, ItineraryData, CurrencyCode, CURRENCIES,
} from '@/src/components/itinerary/types'
import { DESTINATION_TO_CITY, CITY_DATA } from '@/src/components/itinerary/cityData'
import TOCSidebar from '@/src/components/itinerary/TOCSidebar'
import DaySection from '@/src/components/itinerary/DaySection'
import BudgetSection from '@/src/components/itinerary/BudgetSection'
import CityGuideSidebar from '@/src/components/itinerary/CityGuideSidebar'

/* ── Helpers ─────────────────────────────────────── */
function genId() { return 'a' + Date.now() + Math.floor(Math.random() * 9999) }

function buildInitialDays(trip: Trip): Day[] {
  const defaultCity = DESTINATION_TO_CITY[trip.destination] ?? Object.keys(CITY_DATA)[0]
  const start = trip.start_date ? new Date(trip.start_date + 'T00:00:00') : new Date()
  const end   = trip.end_date   ? new Date(trip.end_date   + 'T00:00:00') : null

  const numDays = end
    ? Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1)
    : 7

  return Array.from({ length: numDays }, (_, i) => {
    const d = new Date(start); d.setDate(d.getDate() + i)
    return {
      id: `day-${i + 1}`,
      num: i + 1,
      label: i === 0
        ? `${CITY_DATA[defaultCity]?.name ?? trip.destination} — Arrival`
        : i === numDays - 1
          ? 'Departure'
          : `${CITY_DATA[defaultCity]?.name ?? trip.destination} — Day ${i + 1}`,
      date: d.toISOString().split('T')[0],
      city: defaultCity,
      acts: [],
    }
  })
}

/* ── Add / Edit Panel ─────────────────────────────── */
interface PanelState {
  dayId: string
  actType: Activity['type']
  existing?: Activity
}

const CAT_OPTIONS = [
  { key: 'culture',  label: 'Culture', icon: '🏛️' },
  { key: 'food',     label: 'Food',    icon: '🍜' },
  { key: 'nature',   label: 'Nature',  icon: '🌿' },
  { key: 'shopping', label: 'Shopping',icon: '🛍️' },
  { key: 'activity', label: 'Activity',icon: '🎯' },
  { key: 'stay',     label: 'Stay',    icon: '🏨' },
]

const TRANSPORT_MODES = ['flight', 'train', 'bus', 'car', 'ferry', 'other']

function AddPanel({ panel, onSave, onClose }: {
  panel: PanelState
  onSave: (dayId: string, act: Activity) => void
  onClose: () => void
}) {
  const isTransport = panel.actType === 'transport'
  const ex = panel.existing

  const [name, setName]           = useState(ex?.name ?? '')
  const [time, setTime]           = useState(ex?.time ?? '')
  const [cat, setCat]             = useState(ex?.cat ?? 'activity')
  const [cost, setCost]           = useState(ex?.cost != null ? String(ex.cost) : '')
  const [costCurr, setCostCurr]   = useState<CurrencyCode>((ex?.costCurr as CurrencyCode) ?? 'IDR')
  const [note, setNote]           = useState(ex?.note ?? '')
  const [bookingRef, setRef]      = useState(ex?.bookingRef ?? '')
  // transport
  const [mode, setMode]           = useState(ex?.mode ?? 'flight')
  const [from, setFrom]           = useState(ex?.from ?? '')
  const [fromName, setFromName]   = useState(ex?.fromName ?? '')
  const [to, setTo]               = useState(ex?.to ?? '')
  const [toName, setToName]       = useState(ex?.toName ?? '')
  const [departs, setDeparts]     = useState(ex?.departs ?? '')
  const [dur, setDur]             = useState(ex?.dur ?? '')

  function handleSave() {
    const costNum = parseFloat(cost) || 0
    const curr = CURRENCIES.find((c) => c.code === costCurr) ?? CURRENCIES[0]
    const fmt = costNum === 0 ? 'Free' : `${curr.symbol}${costNum.toLocaleString()}`

    if (isTransport) {
      onSave(panel.dayId, {
        id: ex?.id ?? genId(),
        type: 'transport',
        name: name || `${fromName || from} → ${toName || to}`,
        mode, from, fromName, to, toName, departs, dur,
        cost: costNum, costCurr, costFmt: fmt,
        note, bookingRef, files: ex?.files ?? [],
      })
    } else {
      onSave(panel.dayId, {
        id: ex?.id ?? genId(),
        type: panel.actType,
        name, time, cat, cost: costNum, costCurr, costFmt: fmt,
        note, bookingRef, files: ex?.files ?? [],
      })
    }
    onClose()
  }

  const title = ex ? 'Edit' : isTransport ? 'Add Transport' : panel.actType === 'place' ? 'Add Place' : 'Add Activity'

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 295, background: 'rgba(17,17,16,.18)' }}
      />
      {/* Panel */}
      <aside style={{
        position: 'fixed', top: 60, right: 0, bottom: 0, width: 360,
        background: 'var(--bg-card)', borderLeft: '1px solid var(--line)',
        zIndex: 300, display: 'flex', flexDirection: 'column',
        transform: 'translateX(0)', transition: 'transform .28s cubic-bezier(.22,1,.36,1)',
        overflowY: 'auto',
      }}>
        {/* Head */}
        <div style={{ padding: '18px 18px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 2, borderBottom: '1px solid var(--line)' }}>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: 15, fontWeight: 500, letterSpacing: '-.02em', color: 'var(--ink)' }}>{title}</span>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--line-strong)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-50)' }}>
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 12, height: 12 }}><path d="M2 2l8 8M10 2l-8 8" /></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 18px', flex: 1 }}>
          {isTransport ? (
            <>
              <SpField label="Mode">
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {TRANSPORT_MODES.map((m) => {
                    const on = mode === m
                    return (
                      <button key={m} onClick={() => setMode(m)} style={{
                        padding: '6px 11px', border: `1px solid ${on ? 'rgba(139,92,246,.4)' : 'var(--line-strong)'}`,
                        borderRadius: 7, fontSize: 11, fontWeight: on ? 600 : 500,
                        color: on ? 'rgba(109,62,216,1)' : 'var(--ink-50)',
                        background: on ? 'rgba(139,92,246,.07)' : 'transparent',
                        cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
                      }}>
                        {m}
                      </button>
                    )
                  })}
                </div>
              </SpField>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <SpField label="From Code"><SpInput value={from} onChange={setFrom} placeholder="CGK" /></SpField>
                <SpField label="From City"><SpInput value={fromName} onChange={setFromName} placeholder="Jakarta" /></SpField>
                <SpField label="To Code"><SpInput value={to} onChange={setTo} placeholder="NRT" /></SpField>
                <SpField label="To City"><SpInput value={toName} onChange={setToName} placeholder="Narita" /></SpField>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <SpField label="Departs"><SpInput value={departs} onChange={setDeparts} placeholder="06:40" /></SpField>
                <SpField label="Duration"><SpInput value={dur} onChange={setDur} placeholder="7h 30m" /></SpField>
              </div>
            </>
          ) : (
            <>
              <SpField label="Activity name">
                <SpInput value={name} onChange={setName} placeholder="e.g. Senso-ji Temple" autoFocus />
              </SpField>
              <SpField label="Time">
                <SpInput value={time} onChange={setTime} placeholder="09:00" />
              </SpField>
              <SpField label="Category">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 5 }}>
                  {CAT_OPTIONS.map((c) => {
                    const on = cat === c.key
                    return (
                      <button key={c.key} onClick={() => setCat(c.key)} style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                        padding: '9px 6px', border: `1px solid ${on ? 'var(--accent)' : 'var(--line-strong)'}`,
                        borderRadius: 8, cursor: 'pointer', background: on ? 'var(--accent-bg)' : 'transparent',
                        fontFamily: 'inherit', transition: 'all .18s',
                      }}>
                        <span style={{ fontSize: 15 }}>{c.icon}</span>
                        <span style={{ fontSize: 10, fontWeight: 500, color: on ? 'var(--accent)' : 'var(--ink-50)' }}>{c.label}</span>
                      </button>
                    )
                  })}
                </div>
              </SpField>
            </>
          )}

          {/* Cost */}
          <SpField label="Cost">
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                value={costCurr}
                onChange={(e) => setCostCurr(e.target.value as CurrencyCode)}
                style={{ height: 40, padding: '0 10px', background: 'var(--bg)', border: '1px solid var(--line-strong)', borderRadius: 8, fontSize: 13, color: 'var(--ink)', fontFamily: 'inherit', outline: 'none', minWidth: 80, cursor: 'pointer' }}
              >
                {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
              </select>
              <SpInput value={cost} onChange={setCost} placeholder="0 = Free" style={{ flex: 1 }} />
            </div>
          </SpField>

          {/* Note */}
          <SpField label="Note">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any tips or reminders…"
              rows={3}
              style={{ width: '100%', minHeight: 68, padding: '9px 12px', resize: 'vertical', background: 'var(--bg)', border: '1px solid var(--line-strong)', borderRadius: 8, fontSize: 13, color: 'var(--ink)', fontFamily: 'inherit', outline: 'none', lineHeight: 1.6 }}
            />
          </SpField>

          {/* Booking ref */}
          <SpField label="Booking reference">
            <SpInput value={bookingRef} onChange={setRef} placeholder="e.g. GA-884-2025" />
          </SpField>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 18px', borderTop: '1px solid var(--line)', display: 'flex', gap: 8, position: 'sticky', bottom: 0, background: 'var(--bg-card)' }}>
          <button onClick={onClose} style={{ padding: '10px 14px', background: 'transparent', color: 'var(--ink-50)', border: '1px solid var(--line-strong)', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isTransport && !name.trim()}
            style={{ flex: 1, padding: 10, background: 'var(--ink)', color: 'var(--bg)', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background .18s', opacity: (!isTransport && !name.trim()) ? .4 : 1 }}
            onMouseEnter={(e) => { if (isTransport || name.trim()) e.currentTarget.style.background = 'var(--accent)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--ink)' }}
          >
            {ex ? 'Save changes' : 'Add'}
          </button>
        </div>
      </aside>
    </>
  )
}

function SpField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-25)', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}

function SpInput({ value, onChange, placeholder, autoFocus, style }: {
  value: string; onChange: (v: string) => void
  placeholder?: string; autoFocus?: boolean; style?: React.CSSProperties
}) {
  return (
    <input
      autoFocus={autoFocus}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', height: 40, padding: '0 12px',
        background: 'var(--bg)', border: '1px solid var(--line-strong)',
        borderRadius: 8, fontSize: 13, color: 'var(--ink)', fontFamily: 'inherit',
        outline: 'none', transition: 'border-color .18s, background .18s',
        ...style,
      }}
      onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'var(--bg-card)' }}
      onBlur={(e)  => { e.target.style.borderColor = 'var(--line-strong)'; e.target.style.background = 'var(--bg)' }}
    />
  )
}

/* ── Main Page ────────────────────────────────────── */
export default function TripItineraryPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? ''
  const router  = useRouter()
  const { onToggleSidebar } = useUser()

  const [trip, setTrip]       = useState<Trip | null>(null)
  const [days, setDays]       = useState<Day[]>([])
  const [currency, setCurrency] = useState<CurrencyCode>('IDR')
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [panel, setPanel]       = useState<PanelState | null>(null)
  const [activeDayId, setActiveDayId] = useState<string | null>(null)
  const [toast, setToast]       = useState('')
  const [showMobileToc, setShowMobileToc] = useState(false)
  const toastRef              = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saveTimer             = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialized           = useRef(false)

  /* ── Load trip ── */
  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null }
        return r.json()
      })
      .then((d) => {
        if (!d?.data) return
        const t: Trip = d.data
        setTrip(t)
        const existing = t.itinerary_data
        if (existing?.days) {
          setDays(existing.days)
          setCurrency((existing.currency as CurrencyCode) ?? 'IDR')
        } else {
          setDays(buildInitialDays(t))
        }
        initialized.current = true
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  /* ── Auto-save debounced ── */
  const saveItinerary = useCallback((newDays: Day[], newCurr: CurrencyCode) => {
    if (!initialized.current || !trip) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const token = localStorage.getItem('token')
      const payload: ItineraryData = {
        days: newDays,
        cities: [...new Set(newDays.map((d) => d.city))],
        currency: newCurr,
      }
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ itinerary_data: payload }),
      }).catch(() => {})
    }, 1200)
  }, [id, trip])

  function showToast(msg: string) {
    setToast(msg)
    if (toastRef.current) clearTimeout(toastRef.current)
    toastRef.current = setTimeout(() => setToast(''), 2600)
  }

  /* ── TOC scroll spy ── */
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActiveDayId(e.target.id) })
    }, { rootMargin: '-64px 0px -60% 0px' })
    days.forEach((d) => {
      const el = document.getElementById(d.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [days])

  /* ── Handlers ── */
  function handleTocClick(dayId: string) {
    document.getElementById(dayId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveDayId(dayId)
  }

  function handleAddActivity(dayId: string, type: Activity['type']) {
    setPanel({ dayId, actType: type })
  }

  function handleEditActivity(dayId: string, actId: string) {
    const day = days.find((d) => d.id === dayId)
    const act = day?.acts.find((a) => a.id === actId)
    if (act) setPanel({ dayId, actType: act.type, existing: act })
  }

  function handleSaveActivity(dayId: string, act: Activity) {
    setDays((prev) => {
      const next = prev.map((d) => {
        if (d.id !== dayId) return d
        const idx = d.acts.findIndex((a) => a.id === act.id)
        const acts = idx >= 0
          ? d.acts.map((a) => a.id === act.id ? act : a)
          : [...d.acts, act]
        return { ...d, acts }
      })
      saveItinerary(next, currency)
      return next
    })
    showToast(panel?.existing ? 'Activity updated' : 'Activity added')
  }

  function handleDeleteActivity(dayId: string, actId: string) {
    setDays((prev) => {
      const next = prev.map((d) =>
        d.id === dayId ? { ...d, acts: d.acts.filter((a) => a.id !== actId) } : d
      )
      saveItinerary(next, currency)
      return next
    })
    showToast('Deleted')
  }

  function handleCityChange(dayId: string, city: string) {
    setDays((prev) => {
      const next = prev.map((d) => d.id === dayId ? { ...d, city } : d)
      saveItinerary(next, currency)
      return next
    })
    showToast(`City: ${CITY_DATA[city]?.name ?? city}`)
  }

  function handleCurrChange(c: CurrencyCode) {
    setCurrency(c)
    saveItinerary(days, c)
  }

  function addDay() {
    setDays((prev) => {
      const last = prev[prev.length - 1]
      const lastDate = last?.date
      const newDate = lastDate
        ? (() => { const d = new Date(lastDate + 'T00:00:00'); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0] })()
        : undefined
      const newDay: Day = {
        id: `day-${prev.length + 1}-${Date.now()}`,
        num: prev.length + 1,
        label: `Day ${prev.length + 1}`,
        date: newDate,
        city: last?.city ?? Object.keys(CITY_DATA)[0],
        acts: [],
      }
      const next = [...prev, newDay]
      saveItinerary(next, currency)
      return next
    })
  }

  function removeDay(dayId: string) {
    setDays((prev) => {
      const next = prev.filter((d) => d.id !== dayId).map((d, i) => ({ ...d, num: i + 1 }))
      saveItinerary(next, currency)
      return next
    })
    showToast('Day removed')
  }

  const currObj  = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0]
  const totalActs = days.reduce((s, d) => s + d.acts.length, 0)
  const uniqCities = [...new Set(days.map((d) => d.city))]
  const tripMonth = trip?.start_date ? new Date(trip.start_date + 'T00:00:00').getMonth() : undefined
  const nights = trip?.start_date && trip?.end_date
    ? Math.round((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / 86400000)
    : null

  /* ── Render ── */
  if (loading) return <ItinerarySkeleton />
  if (notFound) return <NotFoundState />

  return (
    <>
      {/* ── TOPNAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 60, background: 'rgba(251,250,248,.94)',
        backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--line)',
        display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14,
      }}>
        <button
          onClick={onToggleSidebar}
          style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--line-strong)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-50)', flexShrink: 0 }}
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{ width: 14, height: 14 }}><path d="M2 4h12M2 8h12M2 12h12" /></svg>
        </button>

        <Link href="/dashboard"
          style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500, color: 'var(--ink-50)', textDecoration: 'none', flexShrink: 0, transition: 'color .18s', whiteSpace: 'nowrap' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-50)')}
        >
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: 14, height: 14 }}><path d="M9 2L4 7l5 5" /></svg>
          Dashboard
        </Link>

        <div style={{ width: 1, height: 18, background: 'var(--line-strong)', flexShrink: 0 }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 15, fontWeight: 500, letterSpacing: '-.02em', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {trip?.name ?? 'Itinerary'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-25)', marginTop: 1 }}>
            {trip?.start_date ? new Date(trip.start_date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}{nights != null ? ` · ${nights + 1} days` : ''}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* Mobile: TOC toggle */}
          <button
            className="mobile-toc-btn"
            onClick={() => setShowMobileToc(true)}
            style={{ display: 'none', width: 32, height: 32, borderRadius: 8, border: '1px solid var(--line-strong)', background: 'transparent', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-50)' }}
          >
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: 13, height: 13 }}><path d="M1 3h12M1 7h8M1 11h6" /></svg>
          </button>
          <button
            onClick={addDay}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: 'transparent', color: 'var(--ink-50)', fontSize: 12, fontWeight: 500, border: '1px solid var(--line-strong)', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ink)'; e.currentTarget.style.color = 'var(--ink)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-50)' }}
          >
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 11, height: 11 }}><path d="M6 1v10M1 6h10" /></svg>
            <span className="nav-day-label">Day</span>
          </button>
          <Link
            href={`/dashboard/trips/${id}/settings`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: 'var(--ink)', color: 'var(--bg)', fontSize: 12, fontWeight: 600, borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'background .18s', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--ink)')}
          >
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: 13, height: 13 }}><circle cx="7" cy="7" r="2.5" /><path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.9 2.9l1 1M10.1 10.1l1 1M10.1 2.9l-1 1M3.9 10.1l-1 1" /></svg>
            <span className="nav-settings-label">Settings</span>
          </Link>
        </div>
      </nav>

      {/* Mobile TOC sheet */}
      {showMobileToc && (
        <>
          <div
            onClick={() => setShowMobileToc(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 490, background: 'rgba(17,17,16,.4)' }}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 500,
            background: 'var(--bg-card)', borderRadius: '18px 18px 0 0',
            maxHeight: '70vh', overflowY: 'auto',
          }}>
            <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: 15, fontWeight: 500 }}>Days</span>
              <button onClick={() => setShowMobileToc(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-25)', fontSize: 22, lineHeight: 1 }}>×</button>
            </div>
            {days.map((day) => {
              const on = day.id === activeDayId
              return (
                <div
                  key={day.id}
                  onClick={() => { handleTocClick(day.id); setShowMobileToc(false) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px',
                    borderBottom: '1px solid var(--line)', cursor: 'pointer',
                    background: on ? 'var(--accent-bg)' : 'transparent',
                  }}
                >
                  <span style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 300, color: on ? 'var(--accent)' : 'var(--ink-25)', minWidth: 28 }}>{day.num}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: on ? 'var(--accent)' : 'var(--ink)' }}>{day.label}</div>
                    {day.date && <div style={{ fontSize: 11, color: 'var(--ink-25)', marginTop: 1 }}>{day.date}</div>}
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--ink-25)' }}>{day.acts.length} acts</span>
                </div>
              )
            })}
            <div style={{ height: 20 }} />
          </div>
        </>
      )}

      {/* ── 3-COLUMN BODY ── */}
      <div className="itin-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'var(--toc-w, 196px) 1fr var(--rp-w, 252px)',
        height: '100vh',
        paddingTop: 60,
      }}>
        {/* LEFT: TOC */}
        <div className="itin-toc">
          <TOCSidebar
            days={days}
            activeDayId={activeDayId}
            onDayClick={handleTocClick}
            totalActs={totalActs}
          />
        </div>

        {/* CENTER: Main scroll */}
        <main style={{
          overflowY: 'auto', overflowX: 'hidden',
          padding: '28px 28px 120px',
          height: 'calc(100vh - 60px)',
        }}>
          {/* Trip header */}
          <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--line)' }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>{trip?.destination_flag ?? '🗺️'}</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 500, letterSpacing: '-.03em', lineHeight: 1.1 }}>
              {trip?.name ?? 'Your Trip'} —{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' }}>
                {trip?.start_date ? new Date(trip.start_date + 'T00:00:00').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : 'Itinerary'}
              </em>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 12, alignItems: 'center' }}>
              <Stat n={String(days.length)} label="Days" />
              <div style={{ width: 1, height: 28, background: 'var(--line)' }} />
              <Stat n={String(totalActs)} label="Activities" />
              <div style={{ width: 1, height: 28, background: 'var(--line)' }} />
              <Stat n={uniqCities.map((c) => CITY_DATA[c]?.name ?? c).join(', ')} label="Cities" />
            </div>
          </div>

          {/* Budget */}
          <BudgetSection days={days} baseCurr={currency} onCurrChange={handleCurrChange} />

          {/* Days */}
          {days.map((day, i) => (
            <DaySection
              key={day.id}
              day={day}
              baseCurr={currency}
              currSymbol={currObj.symbol}
              isFirst={i === 0}
              onAddActivity={handleAddActivity}
              onEditActivity={handleEditActivity}
              onDeleteActivity={handleDeleteActivity}
              onCityChange={handleCityChange}
            />
          ))}

          {/* Add day button */}
          <button
            onClick={addDay}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', padding: 14, border: '1.5px dashed var(--line-strong)',
              borderRadius: 11, fontSize: '12.5px', fontWeight: 500, color: 'var(--ink-25)',
              background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all .18s', marginTop: 4,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-bg)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-25)'; e.currentTarget.style.background = 'transparent' }}
          >
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 13, height: 13 }}><path d="M7 1v12M1 7h12" /></svg>
            Add day
          </button>
        </main>

        {/* RIGHT: City guide */}
        <div className="itin-guide">
          <CityGuideSidebar cities={uniqCities} tripMonth={tripMonth} />
        </div>
      </div>

      {/* Add/Edit side panel */}
      {panel && (
        <AddPanel
          panel={panel}
          onSave={handleSaveActivity}
          onClose={() => setPanel(null)}
        />
      )}

      {/* Toast */}
      <div style={{
        position: 'fixed', bottom: 36, left: '50%',
        transform: `translateX(-50%) translateY(${toast ? 0 : 6}px)`,
        background: 'rgba(17,17,16,.9)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.85)',
        fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
        padding: '9px 18px', borderRadius: 100,
        opacity: toast ? 1 : 0, transition: 'all .22s',
        pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 999,
      }}>
        {toast}
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .day-header-inline-btns { display: none !important; }
          .itin-grid { grid-template-columns: 1fr !important; }
          .itin-toc  { display: none !important; }
          .itin-guide { display: none !important; }
          .mobile-toc-btn { display: inline-flex !important; }
          .nav-day-label { display: none; }
          .nav-settings-label { display: none; }
        }
        @media (max-width: 600px) {
          main { padding: 16px 16px 100px !important; }
        }
      `}</style>
    </>
  )
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <span style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 500, color: 'var(--ink)' }}>{n}</span>
      <span style={{ fontSize: '9.5px', fontWeight: 500, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-25)' }}>{label}</span>
    </div>
  )
}

function ItinerarySkeleton() {
  return (
    <div style={{ padding: '80px 28px 40px', maxWidth: 700, margin: '0 auto' }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ height: 18, background: 'var(--line)', borderRadius: 6, marginBottom: 12, width: i === 1 ? '60%' : i === 2 ? '40%' : '80%', animation: 'pulse-sk 1.4s ease infinite' }} />
      ))}
      <style>{`@keyframes pulse-sk{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )
}

function NotFoundState() {
  return (
    <div style={{ textAlign: 'center', padding: '120px 24px 0' }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>🗺️</div>
      <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 500, color: 'var(--ink)', marginBottom: 8 }}>Trip not found</div>
      <div style={{ fontSize: 13.5, color: 'var(--ink-50)', marginBottom: 24 }}>This trip doesn&apos;t exist or you don&apos;t have access.</div>
      <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 22px', background: 'var(--ink)', color: 'var(--bg)', fontSize: 13, fontWeight: 600, borderRadius: 100, textDecoration: 'none' }}>
        Back to dashboard
      </Link>
    </div>
  )
}
