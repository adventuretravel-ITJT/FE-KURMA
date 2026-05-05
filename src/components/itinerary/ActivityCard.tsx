'use client'

import { useRef, useState } from 'react'
import { Activity, ActivityFile, CurrencyCode, RATES_TO_IDR } from './types'
import { PLACES, getPlace } from './placesData'

interface Props {
  act: Activity
  baseCurr: CurrencyCode
  currSymbol: string
  onDelete?: (id: string) => void
  onEdit?: (act: Activity) => void
  onFileAdd?: (actId: string, file: ActivityFile) => void
  onFileRemove?: (actId: string, idx: number) => void
}

const CAT_BADGE: Record<string, { bg: string; color: string }> = {
  culture:   { bg: 'rgba(59,130,246,.07)',  color: '#1d4ed8' },
  food:      { bg: 'rgba(245,158,11,.08)',  color: '#92400e' },
  nature:    { bg: 'rgba(34,197,94,.08)',   color: '#166534' },
  shopping:  { bg: 'rgba(59,130,246,.07)',  color: '#1d4ed8' },
  activity:  { bg: 'rgba(236,72,153,.08)', color: '#9d174d' },
  stay:      { bg: 'rgba(184,149,106,.1)', color: '#7a5e36' },
  transport: { bg: 'rgba(139,92,246,.08)', color: '#5b21b6' },
  place:     { bg: 'rgba(44,95,78,.07)',   color: '#2c5f4e' },
}

function Badge({ label, cat }: { label: string; cat?: string }) {
  const s = (cat ? CAT_BADGE[cat] : null) ?? { bg: 'var(--accent-bg)', color: 'var(--accent)' }
  return (
    <span style={{
      fontSize: '9.5px', fontWeight: 600, letterSpacing: '.04em',
      padding: '2px 7px', borderRadius: 100,
      background: s.bg, color: s.color, textTransform: 'capitalize',
    }}>
      {label}
    </span>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {[0,1,2,3,4].map((i) => (
        <svg key={i} viewBox="0 0 10 10" style={{ width: 10, height: 10 }}>
          <path d="M5 1l1.2 2.5 2.8.4-2 2 .5 2.8L5 7.5 2.5 8.7l.5-2.8-2-2 2.8-.4z"
            fill={i < Math.floor(rating) ? 'var(--warm, #d97706)' : 'var(--line)'}
          />
        </svg>
      ))}
      <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--warm, #d97706)', marginLeft: 2 }}>{rating}</span>
    </span>
  )
}

function FileSection({ act, onFileAdd, onFileRemove }: {
  act: Activity
  onFileAdd?: (actId: string, file: ActivityFile) => void
  onFileRemove?: (actId: string, idx: number) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const files = act.files ?? []

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f || !onFileAdd) return
    const kb = Math.round(f.size / 1024)
    const size = kb < 1024 ? `${kb} KB` : `${(kb / 1024).toFixed(1)} MB`
    onFileAdd(act.id, { name: f.name, type: f.type, size })
    e.target.value = ''
  }

  if (!onFileAdd && files.length === 0 && !act.bookingRef) return null

  return (
    <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--line)' }}>
      {/* Attach file button */}
      {onFileAdd && (
        <label style={{ cursor: 'pointer', display: 'inline-block', marginBottom: files.length > 0 ? 6 : 0 }}>
          <input ref={inputRef} type="file" style={{ display: 'none' }} onChange={handleFile} />
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', border: '1px solid var(--line-strong)',
            borderRadius: 6, fontSize: '11.5px', fontWeight: 500, color: 'var(--ink-50)',
            background: 'var(--bg-warm)', cursor: 'pointer', transition: 'all .18s',
          }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.borderColor = 'var(--accent)'
              el.style.color = 'var(--accent)'
              el.style.background = 'var(--accent-bg)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.borderColor = 'var(--line-strong)'
              el.style.color = 'var(--ink-50)'
              el.style.background = 'var(--bg-warm)'
            }}
          >
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ width: 12, height: 12 }}>
              <path d="M2 10.5V12h10v-1.5M7 2v7M4 5l3-3 3 3" />
            </svg>
            Attach file
          </span>
        </label>
      )}

      {/* File chips */}
      {files.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: onFileAdd ? 6 : 0 }}>
          {files.map((f, i) => (
            <div key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 8px', background: 'var(--bg)', border: '1px solid var(--line-strong)',
              borderRadius: 6, fontSize: 11, color: 'var(--ink-50)',
            }}>
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: 10, height: 10 }}>
                <path d="M7 1H3a1 1 0 00-1 1v8a1 1 0 001 1h6a1 1 0 001-1V4L7 1z" />
                <path d="M7 1v3h3" />
              </svg>
              <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
              {onFileRemove && (
                <button
                  onClick={(e) => { e.stopPropagation(); onFileRemove(act.id, i) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-25)', lineHeight: 1, padding: 0, fontSize: 14 }}
                >×</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Booking ref */}
      {act.bookingRef && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
          <span style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-25)' }}>Ref</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--ink)', fontFamily: 'monospace' }}>{act.bookingRef}</span>
        </div>
      )}
    </div>
  )
}

/* ── Place Card (expandable) ─────────────────────────── */
function PlaceCard({ act, place, convertedCost, currSymbol, onDelete, onEdit, onFileAdd, onFileRemove }: {
  act: Activity
  place: NonNullable<ReturnType<typeof getPlace>>
  convertedCost: number | null
  currSymbol: string
  onDelete?: (id: string) => void
  onEdit?: (act: Activity) => void
  onFileAdd?: Props['onFileAdd']
  onFileRemove?: Props['onFileRemove']
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${expanded ? 'var(--accent-10, rgba(44,95,78,.1))' : 'var(--line)'}`,
        borderRadius: 11,
        overflow: 'hidden',
        transition: 'border-color .2s',
        cursor: 'pointer',
      }}
      onClick={() => setExpanded((p) => !p)}
    >
      {/* ── Top row ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: '13px 15px', position: 'relative' }}>
        {/* Thumbnail */}
        <img
          src={place.photo}
          alt={place.name}
          loading="lazy"
          style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
        />

        {/* Body */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.3, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {act.name}
            </div>
            {act.time && act.time !== '—' && (
              <span style={{ fontSize: 11, color: 'var(--ink-25)', whiteSpace: 'nowrap', paddingTop: 1, flexShrink: 0 }}>{act.time}</span>
            )}
          </div>

          <StarRating rating={place.rating} />

          <div style={{ display: 'flex', gap: 5, marginTop: 5, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: 'var(--ink-25)', display:'inline-flex', alignItems:'center', gap:3 }}><svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{width:10,height:10}}><circle cx="7" cy="7" r="5.5"/><path d="M7 4v3l2 1"/></svg>{place.visitTime}</span>
            <span style={{ fontSize: 10, color: 'var(--ink-25)' }}>·</span>
            <span style={{ fontSize: 10, color: place.price === 'Free' ? 'var(--accent-light, #38795f)' : 'var(--ink-50)' }}>
              {convertedCost != null && convertedCost > 0 ? `${currSymbol}${convertedCost.toLocaleString()}` : place.price}
            </span>
            {place.reserv && (
              <span style={{ fontSize: '9.5px', fontWeight: 600, padding: '2px 6px', borderRadius: 100, background: 'rgba(239,68,68,.07)', color: '#b91c1c' }}>Reservation</span>
            )}
          </div>

          <div style={{ marginTop: 5 }}>
            <Badge label="Place" cat="place" />
          </div>
        </div>

        {/* Chevron */}
        <div style={{
          width: 22, height: 22, borderRadius: 6, border: `1px solid ${expanded ? 'var(--accent)' : 'var(--line-strong)'}`,
          background: expanded ? 'var(--accent)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          transition: 'all .2s',
        }}>
          <svg viewBox="0 0 10 10" fill="none" stroke={expanded ? '#fff' : 'var(--ink-25)'} strokeWidth="2" strokeLinecap="round"
            style={{ width: 10, height: 10, transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform .25s cubic-bezier(.34,1.2,.64,1)' }}>
            <path d="M3 2l4 3-4 3" />
          </svg>
        </div>
      </div>

      {/* ── Expand Drawer ── */}
      <div
        style={{
          maxHeight: expanded ? 900 : 0,
          overflow: 'hidden',
          transition: 'max-height .35s cubic-bezier(.4,0,.2,1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero photo */}
        <img
          src={place.drawerPhoto || place.photo}
          alt={place.name}
          loading="lazy"
          style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
        />

        <div style={{ padding: '14px 15px' }}>
          {/* Eyebrow + title */}
          <div style={{ fontSize: '9.5px', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-25)', marginBottom: 4 }}>
            {place.eyebrow}
          </div>
          <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 16, fontWeight: 500, letterSpacing: '-.02em', color: 'var(--ink)', marginBottom: 8 }}>
            {place.name}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--ink-50)', lineHeight: 1.6, marginBottom: 12 }}>
            {place.desc}
          </div>

          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            {[
              { label: 'Open hours', val: place.open },
              { label: 'Entry', val: place.price },
              { label: 'Visit time', val: place.visitTime },
              { label: 'Crowd', val: place.crowd },
            ].map(({ label, val }) => (
              <div key={label}>
                <div style={{ fontSize: '9.5px', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-25)', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 12, color: 'var(--ink)' }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Tip */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '9px 12px', background: 'var(--accent-bg)', borderRadius: 8, marginBottom: 12 }}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{width:14,height:14,flexShrink:0,marginTop:1}}><path d="M8 2a4 4 0 011 7.9V11H7v-1.1A4 4 0 018 2z"/><path d="M7 13h2"/></svg>
            <span style={{ fontSize: 12, color: 'var(--ink-50)', fontStyle: 'italic', lineHeight: 1.55 }}>{place.tip}</span>
          </div>

          {/* Subspots */}
          {place.subspots.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '9.5px', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-25)', marginBottom: 8 }}>
                Spots di sini
                <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
              </div>
              {place.subspots.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: i < place.subspots.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <div style={{
                    width: 5, height: 5, borderRadius: '50%', marginTop: 6, flexShrink: 0,
                    background: s.type === 'food' ? 'var(--warm, #d97706)' : s.type === 'shop' ? '#166534' : 'var(--accent)',
                  }} />
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--ink)', lineHeight: 1.3 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-50)', marginTop: 1, lineHeight: 1.4 }}>{s.note}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* File section */}
          <FileSection act={act} onFileAdd={onFileAdd} onFileRemove={onFileRemove} />
        </div>

        {/* Drawer footer */}
        <div style={{
          display: 'flex', gap: 8, padding: '10px 15px',
          borderTop: '1px solid var(--line)', background: 'var(--bg-warm)',
        }}>
          <a
            href={place.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '8px 12px', borderRadius: 8, background: 'var(--bg-card)',
              border: '1px solid var(--line-strong)', fontSize: 12, fontWeight: 500,
              color: 'var(--ink-50)', textDecoration: 'none', transition: 'all .18s',
            }}
          >
            <svg viewBox="0 0 16 16" fill="currentColor" style={{ width: 12, height: 12 }}>
              <path d="M8 1C5.8 1 4 2.8 4 5c0 3.5 4 9 4 9s4-5.5 4-9c0-2.2-1.8-4-4-4zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
            </svg>
            Get Directions
          </a>
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(act) }}
              style={{
                padding: '8px 12px', borderRadius: 8, border: '1px solid var(--line-strong)',
                background: 'var(--bg-card)', fontSize: 12, fontWeight: 500,
                color: 'var(--ink-50)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-50)' }}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(act.id) }}
              style={{
                padding: '8px 12px', borderRadius: 8, border: '1px solid var(--line-strong)',
                background: 'var(--bg-card)', fontSize: 12, fontWeight: 500,
                color: 'var(--ink-25)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#e53e3e'; e.currentTarget.style.color = '#e53e3e'; e.currentTarget.style.background = 'rgba(229,62,62,.06)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-25)'; e.currentTarget.style.background = 'var(--bg-card)' }}
            >
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ width: 11, height: 11 }}>
                <path d="M2 3h8M4 3V2h4v1M3 3l.7 7.5a.5.5 0 00.5.5h4.6a.5.5 0 00.5-.5L10 3" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Main export ─────────────────────────────────────── */
export default function ActivityCard({ act, baseCurr, currSymbol, onDelete, onEdit, onFileAdd, onFileRemove }: Props) {
  const isTransport = act.type === 'transport'
  const place = act.placeId ? getPlace(act.placeId) : undefined

  const convertedCost = act.cost != null && act.costCurr
    ? Math.round(act.cost * (RATES_TO_IDR[act.costCurr as CurrencyCode] ?? 1) / (RATES_TO_IDR[baseCurr] ?? 1))
    : null

  /* ── Place card ── */
  if (place) {
    return (
      <PlaceCard
        act={act}
        place={place}
        convertedCost={convertedCost}
        currSymbol={currSymbol}
        onDelete={onDelete}
        onEdit={onEdit}
        onFileAdd={onFileAdd}
        onFileRemove={onFileRemove}
      />
    )
  }

  /* ── Transport card ── */
  if (isTransport) {
    return (
      <div
        style={{
          background: 'var(--bg-warm)',
          border: '1px dashed var(--line)',
          borderRadius: 11, padding: '13px 15px',
          display: 'flex', alignItems: 'flex-start', gap: 11,
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--line-strong)'
          const a = e.currentTarget.querySelector<HTMLElement>('.act-actions')
          if (a) a.style.opacity = '1'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--line)'
          const a = e.currentTarget.querySelector<HTMLElement>('.act-actions')
          if (a) a.style.opacity = '0'
        }}
      >
        <div style={{ fontSize: 11, color: 'var(--ink-25)', minWidth: 40, paddingTop: 2, flexShrink: 0 }}>
          {act.departs ?? '—'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 6, display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ fontSize: 15 }}>
              {act.mode === 'flight' ? '✈️' : act.mode === 'train' ? '🚆' : act.mode === 'bus' ? '🚌' : '🚗'}
            </span>
            {act.mode === 'flight' ? 'Flight' : act.mode === 'train' ? 'Train' : act.mode === 'bus' ? 'Bus' : 'Car'}
          </div>
          {act.from && act.to && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{act.from}</div>
                <div style={{ fontSize: 9, color: 'var(--ink-25)' }}>{act.fromName}</div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '0 6px' }}>
                <div style={{ width: '100%', height: 1, background: 'var(--ink-25)', position: 'relative' }}>
                  <div style={{ position: 'absolute', right: -3, top: -3, width: 6, height: 6, borderTop: '1px solid var(--ink-25)', borderRight: '1px solid var(--ink-25)', transform: 'rotate(45deg)' }} />
                </div>
                {act.dur && <div style={{ fontSize: 9, color: 'var(--ink-25)' }}>{act.dur}</div>}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{act.to}</div>
                <div style={{ fontSize: 9, color: 'var(--ink-25)' }}>{act.toName}</div>
              </div>
            </div>
          )}
          {convertedCost != null && (
            <div style={{ fontSize: '11.5px', color: convertedCost === 0 ? 'var(--accent-light, #38795f)' : 'var(--accent)', fontFamily: 'var(--font-fraunces)', marginTop: 4 }}>
              {convertedCost === 0 ? 'Free' : `${currSymbol}${convertedCost.toLocaleString()}`}
            </div>
          )}
          <FileSection act={act} onFileAdd={onFileAdd} onFileRemove={onFileRemove} />
        </div>
        <div className="act-actions" style={{ display: 'flex', gap: 3, opacity: 0, transition: 'opacity .18s', flexShrink: 0 }}>
          {onEdit && (
            <ActionBtn title="Edit" onClick={() => onEdit(act)}>
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: 11, height: 11 }}>
                <path d="M8.5 1.5l2 2L3 11H1V9L8.5 1.5z" />
              </svg>
            </ActionBtn>
          )}
          {onDelete && (
            <ActionBtn title="Delete" danger onClick={() => onDelete(act.id)}>
              <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: 12, height: 12 }}>
                <path d="M2 3h9M5 3V2h3v1M10 3l-.6 8a1 1 0 01-1 .9H4.6a1 1 0 01-1-.9L3 3" />
              </svg>
            </ActionBtn>
          )}
        </div>
      </div>
    )
  }

  /* ── Regular activity card ── */
  return (
    <div
      style={{
        background: 'var(--bg-card)', border: '1px solid var(--line)',
        borderRadius: 11, padding: '13px 15px',
        display: 'flex', alignItems: 'flex-start', gap: 11,
        transition: 'all .2s', position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--line-strong)'
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(17,17,16,.05)'
        const a = e.currentTarget.querySelector<HTMLElement>('.act-actions')
        if (a) a.style.opacity = '1'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--line)'
        e.currentTarget.style.boxShadow = 'none'
        const a = e.currentTarget.querySelector<HTMLElement>('.act-actions')
        if (a) a.style.opacity = '0'
      }}
    >
      <div style={{ fontSize: 11, color: 'var(--ink-25)', minWidth: 40, paddingTop: 2, flexShrink: 0 }}>
        {act.time ?? '—'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 2 }}>{act.name}</div>
        {act.note && <div style={{ fontSize: '11.5px', color: 'var(--ink-50)', lineHeight: 1.5 }}>{act.note}</div>}
        {act.tip && <div style={{ fontSize: 11, color: 'var(--ink-25)', fontStyle: 'italic', marginTop: 3, display:'flex', alignItems:'flex-start', gap:4 }}><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{width:11,height:11,flexShrink:0,marginTop:1}}><path d="M8 2a4 4 0 011 7.9V11H7v-1.1A4 4 0 018 2z"/><path d="M7 13h2"/></svg>{act.tip}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 5 }}>
          {convertedCost != null && (
            <span style={{ fontSize: '11.5px', color: convertedCost === 0 ? 'var(--accent-light, #38795f)' : 'var(--accent)', fontFamily: 'var(--font-fraunces)' }}>
              {convertedCost === 0 ? 'Free' : `${currSymbol}${convertedCost.toLocaleString()}`}
            </span>
          )}
          {act.cat && <Badge label={act.cat} cat={act.cat} />}
          {act.bookingRef && (
            <span style={{ fontSize: '9.5px', fontWeight: 600, padding: '2px 7px', borderRadius: 100, background: 'rgba(239,68,68,.07)', color: '#b91c1c' }}>
              Booked
            </span>
          )}
        </div>
        <FileSection act={act} onFileAdd={onFileAdd} onFileRemove={onFileRemove} />
      </div>
      <div className="act-actions" style={{ display: 'flex', gap: 3, opacity: 0, transition: 'opacity .18s', flexShrink: 0 }}>
        {onEdit && (
          <ActionBtn title="Edit" onClick={() => onEdit(act)}>
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: 11, height: 11 }}>
              <path d="M8.5 1.5l2 2L3 11H1V9L8.5 1.5z" />
            </svg>
          </ActionBtn>
        )}
        {onDelete && (
          <ActionBtn title="Delete" danger onClick={() => onDelete(act.id)}>
            <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: 12, height: 12 }}>
              <path d="M2 3h9M5 3V2h3v1M10 3l-.6 8a1 1 0 01-1 .9H4.6a1 1 0 01-1-.9L3 3" />
            </svg>
          </ActionBtn>
        )}
      </div>
    </div>
  )
}

function ActionBtn({ title, onClick, danger, children }: {
  title: string; onClick: () => void; danger?: boolean; children: React.ReactNode
}) {
  const [hov, setHov] = useState(false)
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 26, height: 26, borderRadius: 6, border: 'none',
        background: hov ? (danger ? 'rgba(229,62,62,.1)' : 'var(--bg-warm)') : 'transparent',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hov && danger ? '#e53e3e' : 'var(--ink-25)',
        transition: 'all .15s', fontFamily: 'inherit', padding: 0,
      }}
    >
      {children}
    </button>
  )
}
