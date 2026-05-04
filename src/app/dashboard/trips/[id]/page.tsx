'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@/src/contexts/UserContext'
import {
  Trip, Day, Activity, ActivityFile, ItineraryData, CurrencyCode, CURRENCIES,
} from '@/src/components/itinerary/types'
import { DESTINATION_TO_CITY, CITY_DATA } from '@/src/components/itinerary/cityData'
import { PLACES, searchPlaces, getPlace, PlaceData } from '@/src/components/itinerary/placesData'
import TOCSidebar from '@/src/components/itinerary/TOCSidebar'
import DaySection from '@/src/components/itinerary/DaySection'
import SuggestedStay from '@/src/components/itinerary/SuggestedStay'
import BudgetSection from '@/src/components/itinerary/BudgetSection'
import CityGuideSidebar from '@/src/components/itinerary/CityGuideSidebar'
import ConfirmModal from '@/src/components/itinerary/ConfirmModal'
import CityPickerModal from '@/src/components/itinerary/CityPickerModal'

/* ── Helpers ─────────────────────────────────────── */
function genId() { return 'a' + Date.now() + Math.floor(Math.random() * 9999) }

function buildInitialDays(trip: Trip): Day[] {
  const defaultCity = DESTINATION_TO_CITY[trip.destination] ?? Object.keys(CITY_DATA)[0]
  const start = trip.start_date ? new Date(trip.start_date + 'T00:00:00') : new Date()
  const end = trip.end_date ? new Date(trip.end_date + 'T00:00:00') : null

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

/* ── Panel types ──────────────────────────────────── */
type PanelType = 'add' | 'transport' | 'hotel'

interface PanelState {
  dayId: string
  panelType: PanelType
  editId?: string       // if set → edit mode, replace existing activity
  initialData?: Activity
}

const CAT_OPTIONS: { key: string; label: string; icon: React.ReactNode }[] = [
  { key: 'culture',  label: 'Culture',  icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:15,height:15}}><path d="M2 14h12M3 6v8M6 6v8M10 6v8M13 6v8M1 6h14M8 2l7 4H1z"/></svg> },
  { key: 'food',     label: 'Food',     icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:15,height:15}}><path d="M5 2v4a2 2 0 004 0V2M7 8v6M12 2v12"/></svg> },
  { key: 'nature',   label: 'Nature',   icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:15,height:15}}><path d="M3 13c1-4 4-7 9-7-1 4-4 7-9 7zM3 13l4-4"/></svg> },
  { key: 'shopping', label: 'Shopping', icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:15,height:15}}><path d="M3 4h10l1 9H2L3 4zM6 4a2 2 0 014 0"/></svg> },
  { key: 'activity', label: 'Activity', icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:15,height:15}}><circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="2.5"/></svg> },
  { key: 'stay',     label: 'Stay',     icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:15,height:15}}><path d="M2 12V6a1 1 0 011-1h10a1 1 0 011 1v6M1 14h14M2 12h12v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1z"/><circle cx="5.5" cy="9" r="1"/></svg> },
]

const TRANSPORT_MODES = [
  { key: 'train',  label: 'Train'  },
  { key: 'flight', label: 'Flight' },
  { key: 'bus',    label: 'Bus'    },
  { key: 'car',    label: 'Car'    },
]

/* ── Add Panel ────────────────────────────────────── */
function AddPanel({ panel, onSave, onClose }: {
  panel: PanelState
  onSave: (dayId: string, act: Activity) => void
  onClose: () => void
}) {
  const { panelType, initialData } = panel
  const isEdit = !!panel.editId

  // Shared
  const [cost, setCost]         = useState(initialData?.cost?.toString() ?? '')
  const [costCurr, setCostCurr] = useState<CurrencyCode>((initialData?.costCurr as CurrencyCode) ?? 'IDR')
  const [note, setNote]         = useState(initialData?.note ?? '')
  const [bookRef, setRef]       = useState(initialData?.bookingRef ?? '')

  // 'add' / place type
  const [name, setName]               = useState(initialData?.type !== 'transport' ? (initialData?.name ?? '') : '')
  const [time, setTime]               = useState(initialData?.time ?? '')
  const [cat, setCat]                 = useState(initialData?.cat ?? 'culture')
  const [placeSearch, setPlaceSearch] = useState('')
  const [placeResults, setPlaceResults] = useState<PlaceData[]>([])
  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(
    initialData?.placeId ? (getPlace(initialData.placeId) ?? null) : null
  )
  const [manualMode, setManualMode] = useState(!initialData?.placeId && !!initialData?.name && initialData?.type !== 'transport' && initialData?.type !== 'hotel')

  // 'transport' type
  const [mode, setMode]       = useState(initialData?.mode ?? 'train')
  const [from, setFrom]       = useState(initialData?.from ?? '')
  const [to, setTo]           = useState(initialData?.to ?? '')
  const [departs, setDeparts] = useState(initialData?.departs ?? '')
  const [dur, setDur]         = useState(initialData?.dur ?? '')

  // 'hotel' type
  const [hotelName, setHotelName] = useState(initialData?.type === 'hotel' || initialData?.cat === 'stay' ? initialData?.name ?? '' : '')
  const [checkin, setCheckin]     = useState(initialData?.time ?? '')

  function onPlaceSearchChange(val: string) {
    setPlaceSearch(val)
    setSelectedPlace(null)
    if (val.trim()) {
      setPlaceResults(searchPlaces(val, 5))
    } else {
      setPlaceResults([])
    }
  }

  function selectPlace(p: PlaceData) {
    setSelectedPlace(p)
    setPlaceSearch(p.name)
    setPlaceResults([])
    setManualMode(false)
  }

  function useManual() {
    setManualMode(true)
    setName(placeSearch)
    setSelectedPlace(null)
    setPlaceResults([])
  }

  const title = panelType === 'transport'
    ? (isEdit ? 'Edit transport' : 'Add transport')
    : panelType === 'hotel'
      ? (isEdit ? 'Edit hotel / stay' : 'Add hotel / stay')
      : (isEdit ? 'Edit activity' : 'Add place or activity')

  function canSave() {
    if (panelType === 'transport') return !!from.trim()
    if (panelType === 'hotel')     return !!hotelName.trim()
    return !!(selectedPlace || manualMode ? name.trim() : false) || !!selectedPlace
  }

  function handleSave() {
    if (!canSave()) return
    const costNum = parseFloat(cost) || 0
    const curr = CURRENCIES.find((c) => c.code === costCurr) ?? CURRENCIES[0]
    const fmt = costNum === 0 ? 'Free' : `${curr.symbol}${costNum.toLocaleString()}`
    const baseId = panel.editId ?? genId()

    if (panelType === 'transport') {
      onSave(panel.dayId, {
        id: baseId, type: 'transport',
        name: name.trim() || `${from.trim()} → ${to.trim()}`,
        mode, from: from.trim(), fromName: from.trim(),
        to: to.trim(), toName: to.trim(),
        departs, dur,
        cost: costNum, costCurr, costFmt: fmt,
        note, bookingRef: bookRef, files: initialData?.files ?? [],
      })
    } else if (panelType === 'hotel') {
      onSave(panel.dayId, {
        id: baseId, type: 'activity',
        name: hotelName.trim(),
        time: checkin,
        cost: costNum, costCurr, costFmt: fmt,
        cat: 'stay', note, bookingRef: bookRef, files: initialData?.files ?? [],
      })
    } else if (selectedPlace) {
      onSave(panel.dayId, {
        id: baseId, type: 'place',
        name: selectedPlace.name, time,
        placeId: selectedPlace.id,
        cat: selectedPlace.cat,
        cost: costNum, costCurr, costFmt: fmt,
        note, bookingRef: bookRef, files: initialData?.files ?? [],
      })
    } else {
      onSave(panel.dayId, {
        id: baseId, type: 'activity',
        name: name.trim(), time, cat,
        cost: costNum, costCurr, costFmt: fmt,
        note, bookingRef: bookRef, files: initialData?.files ?? [],
      })
    }
    onClose()
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 295, background: 'rgba(17,17,16,.18)' }} />
      <aside style={{
        position: 'fixed', top: 60, right: 0, bottom: 0, width: 360,
        background: 'var(--bg-card)', borderLeft: '1px solid var(--line)',
        zIndex: 300, display: 'flex', flexDirection: 'column',
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

          {panelType === 'add' && (
            <>
              {/* Place search */}
              <SpField label="Place or activity">
                <div style={{ position: 'relative' }}>
                  <svg viewBox="0 0 16 16" fill="none" stroke="var(--ink-25)" strokeWidth="1.5" strokeLinecap="round"
                    style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, pointerEvents: 'none', zIndex: 1 }}>
                    <circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5l3 3" />
                  </svg>
                  <input
                    autoFocus
                    type="text"
                    value={selectedPlace ? selectedPlace.name : placeSearch}
                    onChange={(e) => { setSelectedPlace(null); setManualMode(false); onPlaceSearchChange(e.target.value) }}
                    placeholder="Search a place or type name…"
                    style={{
                      width: '100%', height: 40, padding: '0 12px 0 34px',
                      background: selectedPlace ? 'var(--accent-bg)' : 'var(--bg)',
                      border: `1px solid ${selectedPlace ? 'var(--accent-10, rgba(44,95,78,.1))' : 'var(--line-strong)'}`,
                      borderRadius: 8, fontSize: 13, color: 'var(--ink)', fontFamily: 'inherit',
                      outline: 'none', transition: 'border-color .18s',
                    }}
                    onFocus={(e) => { if (!selectedPlace) { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'var(--bg-card)' } }}
                    onBlur={(e) => { if (!selectedPlace) { e.target.style.borderColor = 'var(--line-strong)'; e.target.style.background = 'var(--bg)' } }}
                  />
                  {/* Dropdown results */}
                  {placeResults.length > 0 && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0,
                      background: 'var(--bg-card)', border: '1px solid var(--line-strong)',
                      borderRadius: 10, overflow: 'hidden', zIndex: 20,
                      boxShadow: '0 8px 24px rgba(17,17,16,.08)',
                    }}>
                      {placeResults.map((p) => (
                        <div
                          key={p.id}
                          onMouseDown={(e) => { e.preventDefault(); selectPlace(p) }}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid var(--line)', transition: 'background .15s' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-warm)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <img src={p.photo} alt={p.name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{p.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--ink-25)' }}>{p.city.charAt(0).toUpperCase() + p.city.slice(1)} · {p.cat}</div>
                          </div>
                        </div>
                      ))}
                      <div
                        onMouseDown={(e) => { e.preventDefault(); useManual() }}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', cursor: 'pointer', fontSize: 12, color: 'var(--ink-50)', transition: 'background .15s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-warm)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 10, height: 10 }}><path d="M6 1v10M1 6h10" /></svg>
                        Add &ldquo;{placeSearch}&rdquo; manually
                      </div>
                    </div>
                  )}
                  {/* No results hint */}
                  {placeSearch && placeResults.length === 0 && !selectedPlace && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0,
                      background: 'var(--bg-card)', border: '1px solid var(--line-strong)',
                      borderRadius: 10, overflow: 'hidden', zIndex: 20,
                    }}>
                      <div
                        onMouseDown={(e) => { e.preventDefault(); useManual() }}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', cursor: 'pointer', fontSize: 12, color: 'var(--ink-50)', transition: 'background .15s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-warm)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 10, height: 10 }}><path d="M6 1v10M1 6h10" /></svg>
                        Add &ldquo;{placeSearch}&rdquo; manually
                      </div>
                    </div>
                  )}
                </div>
                {/* Place preview card */}
                {selectedPlace && (
                  <div style={{ marginTop: 10, background: 'var(--bg-warm)', borderRadius: 10, overflow: 'hidden' }}>
                    <img src={selectedPlace.photo} alt={selectedPlace.name} style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ fontFamily: 'Fraunces, serif', fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginBottom: 3 }}>{selectedPlace.name}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 6 }}>
                        {[
                          { label: 'Hours', val: selectedPlace.open },
                          { label: 'Entry', val: selectedPlace.price },
                          { label: 'Visit', val: selectedPlace.visitTime },
                          { label: 'Crowd', val: selectedPlace.crowd },
                        ].map(({ label, val }) => (
                          <div key={label}>
                            <div style={{ fontSize: '9.5px', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-25)' }}>{label}</div>
                            <div style={{ fontSize: 11.5, color: 'var(--ink)' }}>{val}</div>
                          </div>
                        ))}
                      </div>
                      {selectedPlace.tip && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 11, color: 'var(--ink-50)', fontStyle: 'italic', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--line)' }}>
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{width:12,height:12,flexShrink:0,marginTop:1}}><path d="M8 2a4 4 0 011 7.9V11H7v-1.1A4 4 0 018 2z"/><path d="M7 13h2"/></svg>
                          {selectedPlace.tip}
                        </div>
                      )}
                      <button
                        onClick={() => { setSelectedPlace(null); setPlaceSearch('') }}
                        style={{ marginTop: 8, fontSize: 11, color: 'var(--ink-25)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
                      >
                        ✕ Clear selection
                      </button>
                    </div>
                  </div>
                )}
                {/* Manual name input */}
                {manualMode && !selectedPlace && (
                  <div style={{ marginTop: 8 }}>
                    <SpInput value={name} onChange={setName} placeholder="Activity name…" autoFocus />
                  </div>
                )}
              </SpField>
              <SpField label="Time">
                <SpInput value={time} onChange={setTime} placeholder="09:00" />
              </SpField>
              {/* Category — only for manual mode */}
              {!selectedPlace && <SpField label="Category">
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
              </SpField>}
            </>
          )}

          {panelType === 'transport' && (
            <>
              <SpField label="Mode">
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 4 }}>
                  {TRANSPORT_MODES.map((m) => {
                    const on = mode === m.key
                    return (
                      <button key={m.key} onClick={() => setMode(m.key)} style={{
                        flex: 1, minWidth: 60, padding: '7px 5px',
                        border: `1px solid ${on ? 'rgba(139,92,246,.4)' : 'var(--line-strong)'}`,
                        borderRadius: 7, fontSize: 11, fontWeight: on ? 600 : 500,
                        color: on ? 'rgba(109,62,216,1)' : 'var(--ink-50)',
                        background: on ? 'rgba(139,92,246,.07)' : 'transparent',
                        cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
                      }}>
                        {m.label}
                      </button>
                    )
                  })}
                </div>
              </SpField>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <SpField label="From">
                  <SpInput value={from} onChange={setFrom} placeholder="Tokyo / CGK" autoFocus />
                </SpField>
                <SpField label="To">
                  <SpInput value={to} onChange={setTo} placeholder="Kyoto / NRT" />
                </SpField>
                <SpField label="Departs">
                  <SpInput value={departs} onChange={setDeparts} placeholder="08:20" />
                </SpField>
                <SpField label="Duration">
                  <SpInput value={dur} onChange={setDur} placeholder="2h 15m" />
                </SpField>
              </div>
            </>
          )}

          {panelType === 'hotel' && (
            <>
              <SpField label="Hotel name">
                <SpInput value={hotelName} onChange={setHotelName} placeholder="e.g. Shinjuku Granbell Hotel" autoFocus />
              </SpField>
              <SpField label="Check-in time">
                <SpInput value={checkin} onChange={setCheckin} placeholder="15:00" />
              </SpField>
            </>
          )}

          {/* Cost */}
          <SpField label={panelType === 'hotel' ? 'Cost / night' : 'Cost'}>
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

          {/* Notes */}
          <SpField label="Notes">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tips, reminders, details…"
              rows={3}
              style={{ width: '100%', minHeight: 68, padding: '9px 12px', resize: 'vertical', background: 'var(--bg)', border: '1px solid var(--line-strong)', borderRadius: 8, fontSize: 13, color: 'var(--ink)', fontFamily: 'inherit', outline: 'none', lineHeight: 1.6 }}
            />
          </SpField>

          {/* Booking ref */}
          <SpField label="Booking reference">
            <SpInput value={bookRef} onChange={setRef} placeholder="e.g. GA-884-2025" />
          </SpField>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 18px', borderTop: '1px solid var(--line)', display: 'flex', gap: 8, position: 'sticky', bottom: 0, background: 'var(--bg-card)' }}>
          <button onClick={onClose} style={{ padding: '10px 14px', background: 'transparent', color: 'var(--ink-50)', border: '1px solid var(--line-strong)', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave()}
            style={{ flex: 1, padding: 10, background: 'var(--ink)', color: 'var(--bg)', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background .18s', opacity: canSave() ? 1 : .4 }}
            onMouseEnter={(e) => { if (canSave()) e.currentTarget.style.background = 'var(--accent)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--ink)' }}
          >
            {isEdit ? 'Save changes' : 'Add'}
          </button>
        </div>
      </aside>
    </>
  )
}

function SpField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-25)', marginBottom: 6 }}>{label}</label>}
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
      onBlur={(e) => { e.target.style.borderColor = 'var(--line-strong)'; e.target.style.background = 'var(--bg)' }}
    />
  )
}

/* ── Main Page ────────────────────────────────────── */
export default function TripItineraryPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? ''
  const router = useRouter()
  const { onToggleSidebar } = useUser()

  const [trip, setTrip]           = useState<Trip | null>(null)
  const [days, setDays]           = useState<Day[]>([])
  const [currency, setCurrency]   = useState<CurrencyCode>('IDR')
  const [loading, setLoading]     = useState(true)
  const [notFound, setNotFound]   = useState(false)
  const [panel, setPanel]         = useState<PanelState | null>(null)
  const [activeDayId, setActiveDayId] = useState<string | null>(null)
  const [toast, setToast]         = useState('')
  const [showMobileToc, setShowMobileToc] = useState(false)
  const [confirmState, setConfirmState] = useState<{
    type: 'activity' | 'day'; title: string; sub: string; dayId: string; actId?: string
  } | null>(null)
  const [cityPickerState, setCityPickerState] = useState<{ dayId: string; currentCity: string } | null>(null)
  const [sheetDays, setSheetDays]       = useState(false)
  const [sheetToday, setSheetToday]     = useState(false)
  const [sheetCity, setSheetCity]       = useState(false)
  const [sheetKurma, setSheetKurma]     = useState(false)
  const [sheetShare, setSheetShare]     = useState(false)
  const [sheetOptimizer, setSheetOptimizer] = useState(false)
  const [kurmaMessages, setKurmaMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([])
  const [kurmaInput, setKurmaInput]     = useState('')
  const [kurmaLoading, setKurmaLoading] = useState(false)
  const [shareCopied, setShareCopied]   = useState(false)
  const [mobileActive, setMobileActive] = useState<'days' | 'today' | 'guide' | 'share' | null>(null)
  const kurmaEndRef = useRef<HTMLDivElement | null>(null)
  const toastRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saveTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialized = useRef(false)

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
      }).catch(() => { })
    }, 1200)
  }, [id, trip])

  function showToast(msg: string) {
    setToast(msg)
    if (toastRef.current) clearTimeout(toastRef.current)
    toastRef.current = setTimeout(() => setToast(''), 2600)
  }

  async function sendKurma(overrideText?: string) {
    const text = (overrideText ?? kurmaInput).trim()
    if (!text || kurmaLoading) return
    setKurmaInput('')
    setKurmaMessages((prev) => [...prev, { role: 'user', text }])
    setKurmaLoading(true)
    setTimeout(() => kurmaEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    try {
      const ctx = trip
        ? `Trip: "${trip.name}". Destination: ${trip.destination}. Dates: ${trip.start_date ?? '?'} to ${trip.end_date ?? '?'}. Days planned: ${days.length}.`
        : ''
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are Kurma, a friendly and concise AI travel assistant built into KurmaGo. ${ctx} Answer travel questions helpfully and briefly. Use bullet points for lists. Respond in the same language the user writes in.`,
          messages: [{ role: 'user', content: text }],
        }),
      })
      const data = await resp.json()
      const aiText = data.content?.[0]?.text ?? 'Maaf, ada masalah. Coba lagi ya.'
      setKurmaMessages((prev) => [...prev, { role: 'ai', text: aiText }])
    } catch {
      setKurmaMessages((prev) => [...prev, { role: 'ai', text: 'Koneksi bermasalah. Coba lagi.' }])
    }
    setKurmaLoading(false)
    setTimeout(() => kurmaEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  function copyShareLink() {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    navigator.clipboard?.writeText(url).then(() => {
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    })
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

  function handleAddActivity(dayId: string, panelType: string) {
    setPanel({ dayId, panelType: panelType as PanelType })
  }

  function handleEditActivity(dayId: string, act: Activity) {
    const panelType: PanelType =
      act.type === 'transport' ? 'transport'
      : act.cat === 'stay' ? 'hotel'
      : 'add'
    setPanel({ dayId, panelType, editId: act.id, initialData: act })
  }

  function handleSaveActivity(dayId: string, act: Activity) {
    setDays((prev) => {
      const next = prev.map((d) => {
        if (d.id !== dayId) return d
        if (panel?.editId) {
          return { ...d, acts: d.acts.map((a) => a.id === panel.editId ? act : a) }
        }
        return { ...d, acts: [...d.acts, act] }
      })
      saveItinerary(next, currency)
      return next
    })
    showToast(panel?.editId ? 'Updated' : 'Activity added')
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

  function handleFileAdd(dayId: string, actId: string, file: ActivityFile) {
    setDays((prev) => {
      const next = prev.map((d) => {
        if (d.id !== dayId) return d
        return { ...d, acts: d.acts.map((a) => a.id === actId ? { ...a, files: [...(a.files ?? []), file] } : a) }
      })
      saveItinerary(next, currency)
      return next
    })
  }

  function handleFileRemove(dayId: string, actId: string, idx: number) {
    setDays((prev) => {
      const next = prev.map((d) => {
        if (d.id !== dayId) return d
        return { ...d, acts: d.acts.map((a) => a.id === actId ? { ...a, files: (a.files ?? []).filter((_, i) => i !== idx) } : a) }
      })
      saveItinerary(next, currency)
      return next
    })
  }

  function handleLabelChange(dayId: string, label: string) {
    setDays((prev) => {
      const next = prev.map((d) => d.id === dayId ? { ...d, label } : d)
      saveItinerary(next, currency)
      return next
    })
  }

  function handleOpenCityModal(dayId: string) {
    const day = days.find((d) => d.id === dayId)
    if (day) setCityPickerState({ dayId, currentCity: day.city })
  }

  function handleCitySelect(dayId: string, city: string) {
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
    showToast('Day added')
  }

  function removeDay(dayId: string) {
    setDays((prev) => {
      const next = prev.filter((d) => d.id !== dayId).map((d, i) => ({ ...d, num: i + 1 }))
      saveItinerary(next, currency)
      return next
    })
    showToast('Day removed')
  }

  function requestDeleteActivity(dayId: string, actId: string) {
    const act = days.find((d) => d.id === dayId)?.acts.find((a) => a.id === actId)
    setConfirmState({
      type: 'activity', dayId, actId,
      title: 'Delete activity',
      sub: act?.name ? `Remove "${act.name}"? This cannot be undone.` : 'This action cannot be undone.',
    })
  }

  function requestDeleteDay(dayId: string) {
    if (days.length <= 1) { showToast('At least 1 day is required'); return }
    const d = days.find((day) => day.id === dayId)
    setConfirmState({
      type: 'day', dayId,
      title: 'Remove day',
      sub: `Day ${d?.num ?? ''}${d?.label ? ` · ${d.label}` : ''} and all its activities will be lost.`,
    })
  }

  function handleConfirmDelete() {
    if (!confirmState) return
    if (confirmState.type === 'activity' && confirmState.actId) {
      handleDeleteActivity(confirmState.dayId, confirmState.actId)
    } else if (confirmState.type === 'day') {
      removeDay(confirmState.dayId)
    }
    setConfirmState(null)
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const todayDay = days.find((d) => d.date === todayStr)

  const currObj = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0]
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
            onClick={() => setSheetShare(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: 'var(--ink)', color: 'var(--bg)', fontSize: 12, fontWeight: 600, borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'background .18s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--ink)')}
          >
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: 13, height: 13 }}><circle cx="10.5" cy="2.5" r="1.5" /><circle cx="3.5" cy="7" r="1.5" /><circle cx="10.5" cy="11.5" r="1.5" /><path d="M5 6.2l4-2.6M5 7.8l4 2.6" /></svg>
            <span className="nav-settings-label">Share</span>
          </button>
          <Link
            href={`/dashboard/trips/${id}/settings`}
            style={{ display: 'inline-flex', alignItems: 'center', padding: '7px 10px', background: 'transparent', color: 'var(--ink-50)', fontSize: 12, fontWeight: 500, borderRadius: 8, border: '1px solid var(--line-strong)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s', textDecoration: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ink)'; e.currentTarget.style.color = 'var(--ink)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-50)' }}
          >
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: 13, height: 13 }}><circle cx="7" cy="7" r="2.5" /><path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.9 2.9l1 1M10.1 10.1l1 1M10.1 2.9l-1 1M3.9 10.1l-1 1" /></svg>
          </Link>
        </div>
      </nav>

      {/* Mobile TOC sheet */}
      {showMobileToc && (
        <>
          <div onClick={() => setShowMobileToc(false)} style={{ position: 'fixed', inset: 0, zIndex: 490, background: 'rgba(17,17,16,.4)' }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 500, background: 'var(--bg-card)', borderRadius: '18px 18px 0 0', maxHeight: '70vh', overflowY: 'auto' }}>
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
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: '1px solid var(--line)', cursor: 'pointer', background: on ? 'var(--accent-bg)' : 'transparent' }}
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
        <div className="itin-toc" style={{ overflow: 'hidden' }}>
          <TOCSidebar
            days={days}
            activeDayId={activeDayId}
            todayDayId={todayDay?.id}
            onDayClick={handleTocClick}
            onAddDay={addDay}
            onDeleteDay={requestDeleteDay}
            onOpenCityModal={handleOpenCityModal}
          />
        </div>

        {/* CENTER: Main scroll */}
        <main className="scrollbar-hide" style={{
          overflowY: 'auto', overflowX: 'hidden',
          padding: '28px 28px 120px',
          height: 'calc(100vh - 60px)',
        }}>
          {/* Trip header */}
          <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--line)' }}>
            <div style={{ fontSize: 26, marginBottom: 8, lineHeight: 1 }}>
              {trip?.destination_flag ?? (
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--ink-25)" strokeWidth="1.4" strokeLinecap="round" style={{width:26,height:26}}><path d="M3 20V5l6 3 6-3 6 3v15l-6-3-6 3-6-3z"/><path d="M9 8v10M15 5v10"/></svg>
              )}
            </div>
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

          {/* From-scratch banner */}
          {days.length === 0 || totalActs === 0 ? (
            <div style={{ background: 'var(--bg-card)', border: '1.5px dashed var(--line-strong)', borderRadius: 14, padding: '32px 24px', textAlign: 'center', marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--accent-bg)', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" style={{ width: 20, height: 20 }}><path d="M12 5v14M5 12h14" /></svg>
              </div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 16, fontWeight: 500, letterSpacing: '-.02em', color: 'var(--ink)', marginBottom: 6 }}>Itinerary masih kosong</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-50)', lineHeight: 1.6, marginBottom: 16, maxWidth: 300, margin: '0 auto 16px' }}>Tambahkan hari dan aktivitas secara manual, atau gunakan Kurma AI untuk membantu merencanakan perjalananmu.</div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={addDay} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'transparent', color: 'var(--ink-50)', fontSize: 12, fontWeight: 500, borderRadius: 100, border: '1px solid var(--line-strong)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ink)'; e.currentTarget.style.color = 'var(--ink)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-50)' }}>
                  + Tambah hari
                </button>
                <button onClick={() => setSheetKurma(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'var(--ink)', color: 'var(--bg)', fontSize: 12.5, fontWeight: 600, borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .22s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--ink)' }}>
                  ✦ Ask Kurma
                </button>
              </div>
            </div>
          ) : null}

          {/* Budget */}
          <BudgetSection days={days} baseCurr={currency} onCurrChange={handleCurrChange} />

          {/* Days */}
          {days.map((day, i) => {
            const nextDay = days[i + 1]
            const hasStay = day.acts.some((a) => a.cat === 'stay')
            const showSuggest = !hasStay && nextDay && day.city !== nextDay.city
            return (
              <React.Fragment key={day.id}>
                <DaySection
                  day={day}
                  baseCurr={currency}
                  currSymbol={currObj.symbol}
                  isFirst={i === 0}
                  isToday={day.date === todayStr}
                  onAddActivity={handleAddActivity}
                  onDeleteActivity={requestDeleteActivity}
                  onEditActivity={handleEditActivity}
                  onFileAdd={handleFileAdd}
                  onFileRemove={handleFileRemove}
                  onDeleteDay={requestDeleteDay}
                  onLabelChange={handleLabelChange}
                  onOpenCityModal={handleOpenCityModal}
                  onOpenOptimizer={() => setSheetOptimizer(true)}
                />
                {showSuggest && (
                  <SuggestedStay
                    cityA={day.city}
                    cityB={nextDay.city}
                    baseCurr={currency}
                    currSymbol={currObj.symbol}
                  />
                )}
              </React.Fragment>
            )
          })}

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
        <div className="itin-guide" style={{ overflow: 'hidden' }}>
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
        position: 'fixed', bottom: 'calc(58px + 16px)', left: '50%',
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

      {/* ── MOBILE NAV ── */}
      <nav className="itin-mobile-nav" style={{
        display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 390,
        height: 58, background: 'rgba(251,250,248,.96)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--line)', alignItems: 'center', padding: 0,
      }}>
        <button
          onClick={() => { setSheetDays(true); setMobileActive('days') }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 4px', cursor: 'pointer', border: 'none', background: 'none', fontFamily: 'inherit' }}
        >
          <svg viewBox="0 0 20 20" fill="none" stroke={mobileActive === 'days' ? 'var(--accent)' : 'var(--ink-25)'} strokeWidth="1.5" strokeLinecap="round" style={{ width: 20, height: 20 }}>
            <path d="M4 6h12M4 10h8M4 14h10" />
          </svg>
          <span style={{ fontSize: '9.5px', color: mobileActive === 'days' ? 'var(--accent)' : 'var(--ink-25)', fontWeight: mobileActive === 'days' ? 600 : 500 }}>Days</span>
        </button>
        <button
          onClick={() => { setSheetToday(true); setMobileActive('today') }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 4px', cursor: 'pointer', border: 'none', background: 'none', fontFamily: 'inherit' }}
        >
          <svg viewBox="0 0 20 20" fill="none" stroke={mobileActive === 'today' ? 'var(--accent)' : 'var(--ink-25)'} strokeWidth="1.5" strokeLinecap="round" style={{ width: 20, height: 20 }}>
            <circle cx="10" cy="10" r="7" /><path d="M10 6v4l2.5 2.5" />
          </svg>
          <span style={{ fontSize: '9.5px', color: mobileActive === 'today' ? 'var(--accent)' : 'var(--ink-25)', fontWeight: mobileActive === 'today' ? 600 : 500 }}>Today</span>
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingBottom: 4 }}>
          <button
            onClick={() => setSheetKurma(true)}
            style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--ink)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(17,17,16,.25)', transition: 'background .22s', marginBottom: 2 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--ink)' }}
          >
            <svg viewBox="0 0 22 22" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" style={{ width: 20, height: 20 }}>
              <path d="M11 4C8 4 6 6 6 8.5c0 2 1.2 3.7 3 4.5v1.5l1.5-.5 1.5.5V13c1.8-.8 3-2.5 3-4.5C15 6 13 4 11 4z" />
              <path d="M8 18h6M9 20h4" />
            </svg>
          </button>
          <span style={{ fontSize: 9, color: 'var(--ink-25)', fontWeight: 600, letterSpacing: '.02em', marginTop: -2 }}>Kurma</span>
        </div>
        <button
          onClick={() => { setSheetCity(true); setMobileActive('guide') }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 4px', cursor: 'pointer', border: 'none', background: 'none', fontFamily: 'inherit' }}
        >
          <svg viewBox="0 0 20 20" fill="none" stroke={mobileActive === 'guide' ? 'var(--accent)' : 'var(--ink-25)'} strokeWidth="1.5" strokeLinecap="round" style={{ width: 20, height: 20 }}>
            <path d="M10 2C6.7 2 4 4.7 4 8c0 4.4 6 10 6 10s6-5.6 6-10c0-3.3-2.7-6-6-6z" /><circle cx="10" cy="8" r="2" />
          </svg>
          <span style={{ fontSize: '9.5px', color: mobileActive === 'guide' ? 'var(--accent)' : 'var(--ink-25)', fontWeight: mobileActive === 'guide' ? 600 : 500 }}>City Guide</span>
        </button>
        <button
          onClick={() => { setSheetShare(true); setMobileActive('share') }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 4px', cursor: 'pointer', border: 'none', background: 'none', fontFamily: 'inherit' }}
        >
          <svg viewBox="0 0 20 20" fill="none" stroke={mobileActive === 'share' ? 'var(--accent)' : 'var(--ink-25)'} strokeWidth="1.5" strokeLinecap="round" style={{ width: 20, height: 20 }}>
            <circle cx="14" cy="4" r="2" /><circle cx="5" cy="10" r="2" /><circle cx="14" cy="16" r="2" />
            <path d="M7 9l5-3.5M7 11l5 3.5" />
          </svg>
          <span style={{ fontSize: '9.5px', color: mobileActive === 'share' ? 'var(--accent)' : 'var(--ink-25)', fontWeight: mobileActive === 'share' ? 600 : 500 }}>Share</span>
        </button>
      </nav>

      {/* ── DAYS BOTTOM SHEET ── */}
      {sheetDays && (
        <>
          <div onClick={() => setSheetDays(false)} style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(17,17,16,.4)' }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 401, background: 'var(--bg-card)', borderRadius: '18px 18px 0 0', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ width: 36, height: 4, background: 'var(--line-strong)', borderRadius: 2, margin: '12px auto 0', cursor: 'pointer' }} onClick={() => setSheetDays(false)} />
            <div style={{ padding: '14px 18px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: 16, fontWeight: 500, letterSpacing: '-.02em', color: 'var(--ink)' }}>Jump to day</span>
              <button onClick={() => setSheetDays(false)} style={{ color: 'var(--ink-25)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, lineHeight: 1, display:'flex' }}><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{width:14,height:14}}><path d="M1 1l10 10M11 1L1 11"/></svg></button>
            </div>
            {days.map((d) => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px', cursor: 'pointer', borderBottom: '1px solid var(--line)', background: d.id === activeDayId ? 'var(--accent-bg)' : 'transparent' }}>
                <span style={{ fontFamily: 'Fraunces, serif', fontSize: 15, color: d.id === activeDayId ? 'var(--accent)' : 'var(--ink-25)', minWidth: 26, flexShrink: 0 }}
                  onClick={() => { handleTocClick(d.id); setSheetDays(false) }}>
                  {d.num}
                </span>
                <div style={{ flex: 1, minWidth: 0 }} onClick={() => { handleTocClick(d.id); setSheetDays(false) }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 500, color: d.id === activeDayId ? 'var(--accent)' : 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.label}</div>
                  {d.date && <div style={{ fontSize: 11, color: 'var(--ink-25)', marginTop: 1 }}>{d.date}</div>}
                </div>
                <span style={{ fontSize: 11, color: 'var(--ink-25)', flexShrink: 0 }} onClick={() => { handleTocClick(d.id); setSheetDays(false) }}>
                  {d.acts.length > 0 ? `${d.acts.length}` : ''}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); requestDeleteDay(d.id) }}
                  style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--line-strong)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-25)', transition: 'all .15s', flexShrink: 0 }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#e53e3e'; e.currentTarget.style.color = '#e53e3e'; e.currentTarget.style.background = 'rgba(229,62,62,.06)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-25)'; e.currentTarget.style.background = 'transparent' }}
                >
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: 12, height: 12 }}>
                    <path d="M2 3h8M4 3V2h4v1M3 3l.7 7.5a.5.5 0 00.5.5h4.6a.5.5 0 00.5-.5L10 3" />
                  </svg>
                </button>
              </div>
            ))}
            <div style={{ height: 20 }} />
          </div>
        </>
      )}

      {/* ── TODAY BOTTOM SHEET ── */}
      {sheetToday && (
        <>
          <div onClick={() => setSheetToday(false)} style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(17,17,16,.4)' }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 401, background: 'var(--bg-card)', borderRadius: '18px 18px 0 0', maxHeight: '88vh', overflowY: 'auto' }}>
            <div style={{ width: 36, height: 4, background: 'var(--line-strong)', borderRadius: 2, margin: '12px auto 0', cursor: 'pointer' }} onClick={() => setSheetToday(false)} />
            <div style={{ padding: '14px 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: 16, fontWeight: 500, letterSpacing: '-.02em', color: 'var(--ink)' }}>Today</span>
              <button onClick={() => setSheetToday(false)} style={{ fontSize: 22, color: 'var(--ink-25)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, lineHeight: 1 }}>×</button>
            </div>
            {todayDay ? (
              <>
                <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid var(--line)', marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4 }}>TODAY</div>
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 500, letterSpacing: '-.03em', color: 'var(--ink)' }}>
                    {CITY_DATA[todayDay.city]?.name ?? todayDay.city}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-25)', marginTop: 2 }}>{todayDay.date}</div>
                </div>
                {todayDay.acts.length === 0 ? (
                  <div style={{ padding: '32px 18px', textAlign: 'center', color: 'var(--ink-50)', fontSize: 13 }}>
                    No activities planned for today.
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-25)', padding: '0 18px', marginBottom: 10 }}>Your schedule</div>
                    {todayDay.acts.map((act, i) => (
                      <div key={act.id} style={{ display: 'flex', gap: 0, padding: '0 18px 16px' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-50)', minWidth: 48, paddingTop: 2, flexShrink: 0 }}>
                          {act.departs ?? act.time ?? '—'}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0, margin: '0 10px' }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', border: `2px solid ${i === 0 ? 'var(--accent)' : 'var(--line-strong)'}`, background: i === 0 ? 'var(--accent)' : 'var(--bg-card)', flexShrink: 0, marginTop: 3 }} />
                          {i < todayDay.acts.length - 1 && (
                            <div style={{ flex: 1, width: 2, background: 'var(--line)', marginTop: 4, minHeight: 20 }} />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--ink)', marginBottom: 3 }}>{act.name}</div>
                          {act.note && <div style={{ fontSize: '11.5px', color: 'var(--ink-50)', lineHeight: 1.5 }}>{act.note}</div>}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            ) : (
              <div style={{ padding: '32px 18px', textAlign: 'center' }}>
                <div style={{ marginBottom: 12, display:'flex', justifyContent:'center' }}><svg viewBox="0 0 40 40" fill="none" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" style={{width:40,height:40}}><rect x="5" y="8" width="30" height="26" rx="3"/><path d="M5 16h30M14 5v6M26 5v6"/></svg></div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 500, color: 'var(--ink)', marginBottom: 8 }}>
                  {trip?.start_date && new Date(trip.start_date + 'T00:00:00') > new Date()
                    ? "Trip hasn't started yet"
                    : "Today isn't on your itinerary"}
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink-50)', lineHeight: 1.6 }}>
                  {trip?.start_date && new Date(trip.start_date + 'T00:00:00') > new Date()
                    ? `Your trip starts ${trip.start_date}`
                    : 'Add a date to a day to see it here'}
                </div>
              </div>
            )}
            <div style={{ height: 20 }} />
          </div>
        </>
      )}

      {/* ── CITY GUIDE BOTTOM SHEET ── */}
      {sheetCity && (
        <>
          <div onClick={() => setSheetCity(false)} style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(17,17,16,.4)' }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 401, background: 'var(--bg-card)', borderRadius: '18px 18px 0 0', maxHeight: '88vh', overflowY: 'auto' }}>
            <div style={{ width: 36, height: 4, background: 'var(--line-strong)', borderRadius: 2, margin: '12px auto 0', cursor: 'pointer' }} onClick={() => setSheetCity(false)} />
            <div style={{ padding: '14px 18px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', marginBottom: 4 }}>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: 16, fontWeight: 500, letterSpacing: '-.02em', color: 'var(--ink)' }}>City Guide</span>
              <button onClick={() => setSheetCity(false)} style={{ fontSize: 22, color: 'var(--ink-25)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: '0 4px 24px' }}>
              <CityGuideSidebar cities={uniqCities} tripMonth={tripMonth} />
            </div>
          </div>
        </>
      )}

      {/* ── CONFIRM MODAL ── */}
      {confirmState && (
        <ConfirmModal
          title={confirmState.title}
          sub={confirmState.sub}
          confirmLabel={confirmState.type === 'day' ? 'Remove' : 'Delete'}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmState(null)}
        />
      )}

      {/* ── CITY PICKER MODAL ── */}
      {cityPickerState && (
        <CityPickerModal
          dayId={cityPickerState.dayId}
          currentCity={cityPickerState.currentCity}
          onSelect={handleCitySelect}
          onClose={() => setCityPickerState(null)}
        />
      )}

      {/* ── ASK KURMA BOTTOM SHEET ── */}
      <>
        <div
          onClick={() => setSheetKurma(false)}
          style={{
            display: sheetKurma ? 'block' : 'none',
            position: 'fixed', inset: 0, zIndex: 400,
            background: sheetKurma ? 'rgba(17,17,16,.4)' : 'rgba(17,17,16,0)',
            transition: 'background .25s',
          }}
        />
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 401,
          background: 'var(--bg-card)', borderRadius: '18px 18px 0 0',
          maxHeight: '85vh', overflowY: 'auto',
          transform: sheetKurma ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform .32s cubic-bezier(.32,.72,0,1)',
        }}>
          <div style={{ width: 36, height: 4, background: 'var(--line-strong)', borderRadius: 2, margin: '12px auto 0', cursor: 'pointer' }} onClick={() => setSheetKurma(false)} />
          <div style={{ padding: '14px 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 14 }}>
            <div>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: 16, fontWeight: 500, letterSpacing: '-.02em', color: 'var(--ink)' }}>Ask Kurma</span>
              <div style={{ fontSize: 11, color: 'var(--ink-25)', marginTop: 2 }}>AI travel assistant</div>
            </div>
            <button onClick={() => setSheetKurma(false)} style={{ fontSize: 22, color: 'var(--ink-25)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, lineHeight: 1 }}>×</button>
          </div>
          <div style={{ padding: '16px 18px 24px' }}>
            {kurmaMessages.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                {kurmaMessages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                    <div style={{
                      maxWidth: '82%', padding: '10px 13px',
                      borderRadius: msg.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                      background: msg.role === 'user' ? 'var(--ink)' : 'var(--accent-bg)',
                      border: msg.role === 'ai' ? '1px solid var(--accent-10)' : 'none',
                      fontSize: 13, lineHeight: 1.6,
                      color: msg.role === 'user' ? '#fff' : 'var(--ink)',
                      whiteSpace: 'pre-wrap',
                    }}>
                      {msg.role === 'ai' && (
                        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>Kurma</div>
                      )}
                      {msg.text}
                    </div>
                  </div>
                ))}
                {kurmaLoading && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', color: 'var(--ink-25)', fontSize: 12.5 }}>
                    {[0, 1, 2].map((j) => (
                      <div key={j} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: `kpulse 1.2s ${j * 0.2}s ease-in-out infinite` }} />
                    ))}
                  </div>
                )}
                <div ref={kurmaEndRef} />
              </div>
            )}
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <textarea
                value={kurmaInput}
                onChange={(e) => setKurmaInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendKurma() } }}
                placeholder="Tanya Kurma apa saja… cari halal food, translate, tips…"
                rows={2}
                style={{ width: '100%', padding: '12px 44px 12px 14px', background: 'var(--bg)', border: '1.5px solid var(--line-strong)', borderRadius: 12, fontSize: 14, color: 'var(--ink)', fontFamily: 'inherit', outline: 'none', resize: 'none', lineHeight: 1.5, minHeight: 52, transition: 'border-color .18s' }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent)' }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--line-strong)' }}
              />
              <button
                onClick={() => sendKurma()}
                disabled={!kurmaInput.trim() || kurmaLoading}
                style={{ position: 'absolute', bottom: 27, right: 10, width: 30, height: 30, borderRadius: 8, background: kurmaInput.trim() ? 'var(--ink)' : 'var(--line-strong)', border: 'none', cursor: kurmaInput.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .18s' }}
              >
                <svg viewBox="0 0 14 14" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" style={{ width: 13, height: 13 }}><path d="M12 7L2 2l2 5-2 5z" /></svg>
              </button>
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-25)', marginBottom: 8 }}>Coba ini</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[
                { label: 'Halal food nearby', prompt: 'Rekomendasikan halal food di sekitar tujuan kami' },
                { label: 'Kita telat 2 jam', prompt: 'Kami terlambat 2 jam hari ini, apa yang harus kami skip atau sesuaikan?' },
                { label: 'Skip outdoor', prompt: 'Hujan deras hari ini, rekomendasikan aktivitas indoor' },
                { label: 'Translate teks', prompt: 'Tolong bantu terjemahkan teks ini: ' },
                { label: 'Hari santai', prompt: 'Rekomendasikan aktivitas santai dan rileks untuk hari ini' },
                { label: 'Tips hemat', prompt: 'Berikan tips menghemat biaya selama perjalanan ini' },
              ].map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => sendKurma(chip.prompt)}
                  style={{ padding: '7px 12px', border: '1px solid var(--line-strong)', borderRadius: 100, fontSize: 12, fontWeight: 500, color: 'var(--ink-50)', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-bg)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-50)'; e.currentTarget.style.background = 'transparent' }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <style>{`@keyframes kpulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}`}</style>
      </>

      {/* ── SHARE MODAL ── */}
      {sheetShare && (
        <>
          <div onClick={() => { setSheetShare(false); setMobileActive(null) }} style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(17,17,16,.4)' }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 401, background: 'var(--bg-card)', borderRadius: '18px 18px 0 0', maxHeight: '60vh', overflowY: 'auto' }}>
            <div style={{ width: 36, height: 4, background: 'var(--line-strong)', borderRadius: 2, margin: '12px auto 0', cursor: 'pointer' }} onClick={() => setSheetShare(false)} />
            <div style={{ padding: '14px 18px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: 16, fontWeight: 500, letterSpacing: '-.02em', color: 'var(--ink)' }}>Share itinerary</span>
              <button onClick={() => setSheetShare(false)} style={{ color: 'var(--ink-25)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, lineHeight: 1, display:'flex' }}><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{width:14,height:14}}><path d="M1 1l10 10M11 1L1 11"/></svg></button>
            </div>
            <div style={{ padding: '16px 18px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: 'var(--bg-warm)', borderRadius: 8 }}>
                <span style={{ fontSize: 11.5, color: 'var(--ink-50)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                  {typeof window !== 'undefined' ? window.location.href : ''}
                </span>
                <button
                  onClick={copyShareLink}
                  style={{ padding: '5px 12px', background: shareCopied ? 'var(--accent)' : 'var(--ink)', color: 'var(--bg)', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background .18s', whiteSpace: 'nowrap' }}
                >
                  {shareCopied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  {
                    label: 'WhatsApp', bg: '#e8f5e9', color: '#2e7d32',
                    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{width:14,height:14}}><path d="M20 11.5a8 8 0 01-11.3 7.3L4 21l2.2-4.7A8 8 0 1120 11.5z"/></svg>,
                  },
                  {
                    label: 'Email', bg: '#e3f2fd', color: '#1565c0',
                    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{width:14,height:14}}><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 8l9 6 9-6"/></svg>,
                  },
                ].map((opt) => (
                  <button key={opt.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', border: '1px solid var(--line-strong)', borderRadius: 8, cursor: 'pointer', background: 'transparent', fontFamily: 'inherit', transition: 'all .18s', width: '100%' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ink-25)'; e.currentTarget.style.background = 'var(--bg-warm)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.background = 'transparent' }}>
                    <div style={{ width: 26, height: 26, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: opt.bg, color: opt.color }}>{opt.icon}</div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink)' }}>{opt.label}</span>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-warm)', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink)' }}>Anyone with the link</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-25)' }}>Can view · Cannot edit</div>
                </div>
                <div style={{ width: 36, height: 20, borderRadius: 100, background: 'var(--accent)', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ position: 'absolute', right: 2, top: 2, width: 16, height: 16, borderRadius: '50%', background: '#fff' }} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── OPTIMIZER SHEET ── */}
      {sheetOptimizer && (
        <>
          <div onClick={() => setSheetOptimizer(false)} style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(17,17,16,.4)' }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 401, background: 'var(--bg-card)', borderRadius: '18px 18px 0 0', maxHeight: '60vh', overflowY: 'auto' }}>
            <div style={{ width: 36, height: 4, background: 'var(--line-strong)', borderRadius: 2, margin: '12px auto 0', cursor: 'pointer' }} onClick={() => setSheetOptimizer(false)} />
            <div style={{ padding: '14px 18px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: 16, fontWeight: 500, letterSpacing: '-.02em', color: 'var(--ink)' }}>Adjust plan</span>
              <button onClick={() => setSheetOptimizer(false)} style={{ fontSize: 22, color: 'var(--ink-25)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: '14px 18px 32px' }}>
              {[
                { label: 'Ask Kurma AI', meta: 'Get AI-powered suggestions for your plan', action: () => { setSheetOptimizer(false); setSheetKurma(true) } },
                { label: 'Reorganize days', meta: 'Reorder your days for a better flow', action: () => setSheetOptimizer(false) },
                { label: 'Add a rest day', meta: 'Insert a free day with no activities', action: () => { addDay(); setSheetOptimizer(false); showToast('Rest day added') } },
              ].map((opt) => (
                <div key={opt.label} onClick={opt.action} style={{ padding: '12px 14px', background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: 10, cursor: 'pointer', marginBottom: 8, transition: 'all .18s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-bg)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.background = 'var(--bg-card)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{opt.label}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-50)', marginTop: 2 }}>{opt.meta}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .day-header-inline-btns { display: none !important; }
          .day-add-fab-wrap       { display: inline-flex !important; }
          .itin-grid              { grid-template-columns: 1fr !important; }
          .itin-toc               { display: none !important; }
          .itin-guide             { display: none !important; }
          .itin-mobile-nav        { display: flex !important; }
          .mobile-toc-btn         { display: inline-flex !important; }
          .nav-settings-label     { display: none; }
          .act-actions            { opacity: 1 !important; }
        }
        @media (min-width: 901px) {
          .itin-mobile-nav { display: none !important; }
        }
        @media (max-width: 600px) {
          main { padding: 16px 16px 80px !important; }
        }
        @keyframes kpulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}
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
      <div style={{ marginBottom: 16, display:'flex', justifyContent:'center' }}><svg viewBox="0 0 40 40" fill="none" stroke="var(--ink-25)" strokeWidth="1.4" strokeLinecap="round" style={{width:40,height:40}}><path d="M4 33V8l11 5 10-5 11 5v25l-11-5-10 5-11-5z"/><path d="M15 13v20M25 8v20"/></svg></div>
      <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 500, color: 'var(--ink)', marginBottom: 8 }}>Trip not found</div>
      <div style={{ fontSize: 13.5, color: 'var(--ink-50)', marginBottom: 24 }}>This trip doesn&apos;t exist or you don&apos;t have access.</div>
      <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 22px', background: 'var(--ink)', color: 'var(--bg)', fontSize: 13, fontWeight: 600, borderRadius: 100, textDecoration: 'none' }}>
        Back to dashboard
      </Link>
    </div>
  )
}
