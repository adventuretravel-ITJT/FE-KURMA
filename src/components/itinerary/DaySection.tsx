'use client'

import React, { useRef, useState } from 'react'
import { Day, Activity, ActivityFile, CurrencyCode } from './types'
import ActivityCard from './ActivityCard'
import { CITY_DATA } from './cityData'

interface Props {
  day: Day
  baseCurr: CurrencyCode
  currSymbol: string
  isFirst: boolean
  isToday?: boolean
  onAddActivity: (dayId: string, type: string) => void
  onDeleteActivity: (dayId: string, actId: string) => void
  onEditActivity: (dayId: string, act: Activity) => void
  onFileAdd: (dayId: string, actId: string, file: ActivityFile) => void
  onFileRemove: (dayId: string, actId: string, idx: number) => void
  onDeleteDay: (dayId: string) => void
  onLabelChange: (dayId: string, label: string) => void
  onOpenCityModal: (dayId: string) => void
  onOpenOptimizer: (dayId: string) => void
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function fmtDate(dateStr?: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return `${DAYS_OF_WEEK[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`
}

const DAY_SUGGESTIONS: Record<string, string[]> = {
  tokyo: ['Tokyo — Arrival', 'Tokyo — East Side', 'Tokyo — West Side', 'Tokyo — Akihabara & Ueno', 'Tokyo — Shibuya & Harajuku', 'Tokyo — Shinjuku Night', 'Tokyo — Asakusa & Skytree', 'Tokyo — Tsukiji & Ginza', 'Tokyo — Departure'],
  kyoto: ['Kyoto — Higashiyama', 'Kyoto — Arashiyama', 'Kyoto — Fushimi Inari', 'Kyoto — Gion & Pontocho', 'Kyoto — Nishiki Market', 'Kyoto — Kinkaku-ji', "Kyoto — Philosopher's Path", 'Kyoto — Arrival', 'Kyoto — Departure'],
  osaka: ['Osaka — Dotonbori & Food', 'Osaka — Castle & Umeda', 'Osaka — Shinsekai', 'Osaka — Day Trip', 'Osaka — Arrival', 'Osaka — Departure'],
  hakone: ['Hakone — Ropeway & Onsen', 'Hakone — Fuji View', 'Hakone — Open Air Museum', 'Hakone — Arrival', 'Hakone — Departure'],
  nara: ['Nara — Deer Park & Temples', 'Nara — Todai-ji & Kasuga', 'Nara — Half Day', 'Nara — Arrival', 'Nara — Departure'],
  bali: ['Bali — Ubud', 'Bali — Seminyak', 'Bali — Canggu', 'Bali — Uluwatu', 'Bali — Arrival', 'Bali — Departure'],
  singapore: ['Singapore — Marina Bay', 'Singapore — Chinatown & Hawker', 'Singapore — Gardens by the Bay', 'Singapore — Arrival', 'Singapore — Departure'],
}
const ALL_SUGGESTIONS = Object.values(DAY_SUGGESTIONS).flat()

const SD_ITEMS: { type: string; label: string; icon: React.ReactNode; bg: string }[] = [
  { type: 'transport', label: 'Transport', bg: '#5b21b6', icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{width:14,height:14}}><rect x="3" y="2" width="10" height="9" rx="2"/><path d="M3 8h10M6 11l-2 3M10 11l2 3"/><circle cx="5.5" cy="5.5" r="1" fill="currentColor" stroke="none"/><circle cx="10.5" cy="5.5" r="1" fill="currentColor" stroke="none"/></svg> },
  { type: 'hotel',     label: 'Hotel',     bg: '#7a5e36', icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{width:14,height:14}}><rect x="2" y="3" width="12" height="11" rx="1"/><path d="M8 3v11M5 7h1.5M9.5 7H11M5 10h1.5M9.5 10H11"/></svg> },
  { type: 'add',       label: 'Add',       bg: 'var(--ink)', icon: <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{width:12,height:12}}><path d="M6 1v10M1 6h10"/></svg> },
]

export default function DaySection({
  day, baseCurr, currSymbol, isFirst, isToday,
  onAddActivity, onDeleteActivity, onEditActivity,
  onFileAdd, onFileRemove,
  onDeleteDay, onLabelChange, onOpenCityModal, onOpenOptimizer,
}: Props) {
  const cityInfo = CITY_DATA[day.city]
  const fabRef   = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [fabOpen, setFabOpen] = useState(false)
  const [dialPos, setDialPos] = useState({ bottom: 0, right: 0 })
  const [editing, setEditing] = useState(false)
  const [editVal, setEditVal] = useState(day.label)
  const [suggestions, setSuggestions] = useState<string[]>([])

  function startEdit() {
    setEditVal(day.label)
    setEditing(true)
    const city = day.city
    const initial = (DAY_SUGGESTIONS[city] ?? ALL_SUGGESTIONS).slice(0, 5)
    setSuggestions(initial)
    setTimeout(() => { inputRef.current?.select() }, 20)
  }

  function commitEdit() {
    const v = editVal.trim()
    if (v && v !== day.label) onLabelChange(day.id, v)
    setEditing(false)
    setSuggestions([])
  }

  function onInputChange(val: string) {
    setEditVal(val)
    if (!val.trim()) {
      const initial = (DAY_SUGGESTIONS[day.city] ?? ALL_SUGGESTIONS).slice(0, 5)
      setSuggestions(initial)
    } else {
      const q = val.toLowerCase()
      setSuggestions(ALL_SUGGESTIONS.filter((s) => s.toLowerCase().includes(q)).slice(0, 6))
    }
  }

  function pickSuggestion(s: string) {
    onLabelChange(day.id, s)
    setEditing(false)
    setSuggestions([])
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      const v = editVal.trim()
      if (v) onLabelChange(day.id, v)
      setEditing(false)
      setSuggestions([])
    }
    if (e.key === 'Escape') {
      setEditing(false)
      setSuggestions([])
    }
  }

  function handleFabClick() {
    if (fabRef.current) {
      const rect = fabRef.current.getBoundingClientRect()
      setDialPos({
        bottom: window.innerHeight - rect.top + 8,
        right:  window.innerWidth  - rect.right,
      })
    }
    setFabOpen((p) => !p)
  }

  return (
    <section
      id={day.id}
      style={{
        marginBottom: 2,
        scrollMarginTop: 'calc(60px + 16px)',
        ...(isToday ? { borderLeft: '3px solid var(--accent)', paddingLeft: 10, marginLeft: -13 } : {}),
      }}
    >
      {/* Day header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 0 10px', borderBottom: '1px solid var(--line)',
        marginBottom: 10, position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg)', flexWrap: 'wrap',
      }}>
        {/* Day number + today badge */}
        <div style={{
          fontFamily: 'var(--font-fraunces)', fontSize: 26, fontWeight: 300,
          color: 'var(--ink-25)', lineHeight: 1, minWidth: 36, flexShrink: 0,
          position: 'relative', paddingTop: isToday ? 10 : 0,
        }}>
          {String(day.num).padStart(2, '0')}
        </div>

        {/* Title + date + city */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Inline editable title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
            {editing ? (
              <>
                <input
                  ref={inputRef}
                  type="text"
                  value={editVal}
                  onChange={(e) => onInputChange(e.target.value)}
                  onKeyDown={onKeyDown}
                  onBlur={() => setTimeout(commitEdit, 120)}
                  style={{
                    fontFamily: 'var(--font-fraunces)', fontSize: 15, fontWeight: 500,
                    letterSpacing: '-.02em', color: 'var(--ink)',
                    border: 'none', borderBottom: '1.5px solid var(--accent)',
                    background: 'transparent', outline: 'none',
                    width: '100%', lineHeight: 1.3, padding: 0,
                  }}
                />
                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                    background: 'var(--bg-card)', border: '1px solid var(--line-strong)',
                    borderRadius: 10, overflow: 'hidden', zIndex: 50,
                    boxShadow: '0 6px 20px rgba(17,17,16,.1)', minWidth: 220,
                  }}>
                    {suggestions.map((s) => (
                      <div
                        key={s}
                        onMouseDown={(e) => { e.preventDefault(); pickSuggestion(s) }}
                        style={{
                          padding: '9px 12px', fontSize: '12.5px', color: 'var(--ink)',
                          cursor: 'pointer', borderBottom: '1px solid var(--line)',
                          transition: 'background .12s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-bg)'; e.currentTarget.style.color = 'var(--accent)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink)' }}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <span
                  onClick={startEdit}
                  style={{
                    fontFamily: 'var(--font-fraunces)', fontSize: 15, fontWeight: 500,
                    letterSpacing: '-.02em', color: 'var(--ink)', cursor: 'text', lineHeight: 1.3,
                  }}
                >
                  {day.label}
                </span>
                <button
                  onClick={startEdit}
                  className="day-title-edit-btn"
                  title="Rename"
                  style={{
                    width: 18, height: 18, borderRadius: 4, border: 'none',
                    background: 'transparent', cursor: 'pointer', color: 'var(--ink-25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 0, transition: 'all .15s', flexShrink: 0, opacity: 0,
                  }}
                >
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: 11, height: 11 }}>
                    <path d="M8.5 1.5l2 2L3 11H1V9L8.5 1.5z" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {day.date && (
            <div style={{ fontSize: 11, color: 'var(--ink-25)', marginTop: 1 }}>{fmtDate(day.date)}</div>
          )}

          {/* City badge */}
          <button
            onClick={() => onOpenCityModal(day.id)}
            title="Change city"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', background: 'var(--accent-bg)',
              borderRadius: 100, fontSize: 10, fontWeight: 600, color: 'var(--accent)',
              cursor: 'pointer', marginTop: 4, transition: 'all .15s',
              fontFamily: 'inherit', border: 'none',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent-bg)'; e.currentTarget.style.color = 'var(--accent)' }}
          >
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{width:11,height:11,flexShrink:0}}><path d="M7 1a4 4 0 014 4c0 3-4 8-4 8S3 8 3 5a4 4 0 014-4z"/><circle cx="7" cy="5" r="1.5"/></svg>
            {cityInfo?.name ?? day.city}
            <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ width: 9, height: 9, opacity: .7 }}>
              <path d="M7 1.5l1.5 1.5L3 8.5H1.5V7L7 1.5z" />
            </svg>
          </button>
        </div>

        {/* Header actions */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
          {/* Desktop: inline add buttons */}
          <div className="day-header-inline-btns" style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => onAddActivity(day.id, 'add')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '5px 12px', border: '1px solid var(--line-strong)',
                borderRadius: 100, fontSize: 11, fontWeight: 500, color: 'var(--ink-50)',
                background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-bg)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-50)'; e.currentTarget.style.background = 'transparent' }}
            >
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 10, height: 10 }}>
                <path d="M6 1v10M1 6h10" />
              </svg>
              {' '}Add
            </button>
            <button
              onClick={() => onAddActivity(day.id, 'transport')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '5px 10px', border: '1px solid var(--line-strong)',
                borderRadius: 100, fontSize: 11, fontWeight: 500, color: 'var(--ink-50)',
                background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(139,92,246,.5)'; e.currentTarget.style.color = 'rgba(109,62,216,1)'; e.currentTarget.style.background = 'rgba(139,92,246,.06)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-50)'; e.currentTarget.style.background = 'transparent' }}
            >
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 10, height: 10 }}>
                <path d="M6 1v10M1 6h10" />
              </svg>
              {' '}Transport
            </button>
          </div>

          {/* Mobile: FAB trigger */}
          <div className="day-add-fab-wrap" style={{ display: 'none', position: 'relative' }}>
            <button
              ref={fabRef}
              onClick={handleFabClick}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: fabOpen ? 'var(--accent)' : 'var(--ink)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(17,17,16,.18)', transition: 'all .22s', flexShrink: 0,
              }}
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"
                style={{ width: 14, height: 14, transition: 'transform .22s', transform: fabOpen ? 'rotate(45deg)' : 'none' }}>
                <path d="M8 2v12M2 8h12" />
              </svg>
            </button>
          </div>

          {/* Route optimizer button */}
          <button
            onClick={() => onOpenOptimizer(day.id)}
            title="Adjust plan with AI"
            style={{
              display: 'inline-flex', alignItems: 'center', padding: '5px 8px',
              border: '1px solid var(--accent-10, rgba(44,95,78,.1))',
              borderRadius: 100, background: 'var(--accent-bg)',
              cursor: 'pointer', transition: 'all .18s', fontSize: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)'; const svg = e.currentTarget.querySelector('svg'); if (svg) (svg as SVGElement).style.stroke = '#fff' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent-bg)'; e.currentTarget.style.borderColor = 'var(--accent-10, rgba(44,95,78,.1))'; const svg = e.currentTarget.querySelector('svg'); if (svg) (svg as SVGElement).style.stroke = 'var(--accent)' }}
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, transition: 'stroke .18s' }}>
              <circle cx="5" cy="17" r="2.5" />
              <path d="M7.5 17h7a3 3 0 000-6H5a3 3 0 010-6H15" />
              <circle cx="17" cy="3" r="2.5" />
            </svg>
          </button>

          {/* Delete day button */}
          <button
            onClick={() => onDeleteDay(day.id)}
            title="Remove day"
            style={{
              display: 'inline-flex', alignItems: 'center', padding: '5px 8px',
              border: '1px solid var(--line-strong)', borderRadius: 100,
              color: 'var(--ink-25)', background: 'transparent',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#e53e3e'; e.currentTarget.style.color = '#e53e3e'; e.currentTarget.style.background = 'rgba(229,62,62,.06)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-25)'; e.currentTarget.style.background = 'transparent' }}
          >
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 10, height: 10 }}>
              <path d="M2 3h8M4 3V2h4v1M3 3l.7 7.5a.5.5 0 00.5.5h4.6a.5.5 0 00.5-.5L10 3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Speed dial overlay — mobile only, shown above FAB */}
      {fabOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 370 }} onClick={() => setFabOpen(false)} />
          <div style={{
            position: 'fixed',
            bottom: dialPos.bottom,
            right: dialPos.right,
            zIndex: 380,
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 7,
          }}>
            {SD_ITEMS.map(({ type, label, icon, bg }) => (
              <div
                key={type}
                onClick={() => { onAddActivity(day.id, type); setFabOpen(false) }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
              >
                <span style={{
                  background: bg, color: '#fff', fontSize: '11.5px', fontWeight: 600,
                  padding: '6px 12px', borderRadius: 100, whiteSpace: 'nowrap',
                  boxShadow: '0 2px 10px rgba(17,17,16,.2)', fontFamily: 'inherit',
                }}>
                  {label}
                </span>
                <span style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--bg-card)', border: '1px solid var(--line-strong)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, boxShadow: '0 2px 6px rgba(17,17,16,.08)', flexShrink: 0,
                }}>
                  {icon}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Activities */}
      {day.acts.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 10 }}>
          {day.acts.map((act) => (
            <ActivityCard
              key={act.id}
              act={act}
              baseCurr={baseCurr}
              currSymbol={currSymbol}
              onDelete={(id) => onDeleteActivity(day.id, id)}
              onEdit={(act) => onEditActivity(day.id, act)}
              onFileAdd={(actId, file) => onFileAdd(day.id, actId, file)}
              onFileRemove={(actId, idx) => onFileRemove(day.id, actId, idx)}
            />
          ))}
        </div>
      ) : (
        <div style={{
          border: '1.5px dashed var(--line-strong)', borderRadius: 11,
          padding: '24px 20px', textAlign: 'center', marginBottom: 10,
        }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--bg-warm)', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 16 16" fill="none" stroke="var(--ink-25)" strokeWidth="1.5" strokeLinecap="round" style={{ width: 14, height: 14 }}>
              <path d="M8 3v10M3 8h10" />
            </svg>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-25)', marginBottom: 12, lineHeight: 1.5 }}>
            Belum ada aktivitas. Tambahkan tempat, aktivitas, atau transportasi.
          </div>
        </div>
      )}

      <style>{`
        .day-info:hover .day-title-edit-btn { opacity: 1 !important; }
      `}</style>
    </section>
  )
}
