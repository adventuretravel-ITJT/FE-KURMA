'use client'

import { Activity, CurrencyCode, RATES_TO_IDR } from './types'

interface Props {
  act: Activity
  baseCurr: CurrencyCode
  currSymbol: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const CAT_BADGE: Record<string, { bg: string; color: string }> = {
  culture:  { bg: 'rgba(59,130,246,.07)',  color: '#1d4ed8' },
  food:     { bg: 'rgba(245,158,11,.08)',  color: '#92400e' },
  nature:   { bg: 'rgba(34,197,94,.08)',   color: '#166534' },
  shopping: { bg: 'rgba(59,130,246,.07)',  color: '#1d4ed8' },
  activity: { bg: 'rgba(236,72,153,.08)', color: '#9d174d' },
  stay:     { bg: 'rgba(184,149,106,.1)', color: '#7a5e36' },
  transport:{ bg: 'rgba(139,92,246,.08)', color: '#5b21b6' },
}

function Badge({ label, cat }: { label: string; cat?: string }) {
  const s = (cat ? CAT_BADGE[cat] : null) ?? { bg: 'var(--accent-bg)', color: 'var(--accent)' }
  return (
    <span style={{
      fontSize: '9.5px', fontWeight: 600, letterSpacing: '.04em',
      padding: '2px 7px', borderRadius: 100,
      background: s.bg, color: s.color,
    }}>
      {label}
    </span>
  )
}

export default function ActivityCard({ act, baseCurr, currSymbol, onEdit, onDelete }: Props) {
  const isTransport = act.type === 'transport'

  const convertedCost = act.cost != null && act.costCurr
    ? Math.round(act.cost * (RATES_TO_IDR[act.costCurr as CurrencyCode] ?? 1) / (RATES_TO_IDR[baseCurr] ?? 1))
    : null

  return (
    <div
      style={{
        background: isTransport ? 'var(--bg-warm)' : 'var(--bg-card)',
        border: `1px ${isTransport ? 'dashed' : 'solid'} var(--line)`,
        borderRadius: 11,
        padding: '13px 15px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 11,
        transition: 'all .2s',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--line-strong)'
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(17,17,16,.05)'
        const actions = e.currentTarget.querySelector<HTMLElement>('.act-actions')
        if (actions) actions.style.opacity = '1'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isTransport ? 'var(--line)' : 'var(--line)'
        e.currentTarget.style.boxShadow = 'none'
        const actions = e.currentTarget.querySelector<HTMLElement>('.act-actions')
        if (actions) actions.style.opacity = '0'
      }}
    >
      {/* Time */}
      <div style={{ fontSize: 11, color: 'var(--ink-25)', minWidth: 40, paddingTop: 2, flexShrink: 0 }}>
        {isTransport ? (act.departs ?? '—') : (act.time ?? '—')}
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {isTransport ? (
          <>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 6 }}>
              {act.mode === 'flight' ? '✈️' : act.mode === 'train' ? '🚆' : act.mode === 'bus' ? '🚌' : '🚗'}{' '}
              {act.name || `${act.fromName ?? act.from} → ${act.toName ?? act.to}`}
            </div>
            {act.from && act.to && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{act.from}</div>
                  <div style={{ fontSize: 9, color: 'var(--ink-25)' }}>{act.fromName}</div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '0 6px' }}>
                  <div style={{ width: '100%', height: 1, background: 'var(--ink-25)', position: 'relative' }}>
                    <div style={{ position: 'absolute', right: -3, top: -3, width: 6, height: 6, borderTop: '1px solid var(--ink-25)', borderRight: '1px solid var(--ink-25)', transform: 'rotate(45deg)' }} />
                  </div>
                  {act.dur && <div style={{ fontSize: 9, color: 'var(--ink-25)' }}>{act.dur}</div>}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{act.to}</div>
                  <div style={{ fontSize: 9, color: 'var(--ink-25)' }}>{act.toName}</div>
                </div>
              </div>
            )}
            {act.bookingRef && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 9px', background: 'rgba(17,17,16,.04)', borderRadius: 6, marginTop: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--ink-25)', flexShrink: 0 }}>Ref</span>
                <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--ink)', fontFamily: 'monospace' }}>{act.bookingRef}</span>
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 2 }}>
              {act.name}
            </div>
            {act.note && (
              <div style={{ fontSize: '11.5px', color: 'var(--ink-50)', lineHeight: 1.5 }}>{act.note}</div>
            )}
            {act.tip && (
              <div style={{ fontSize: 11, color: 'var(--ink-25)', fontStyle: 'italic', marginTop: 3 }}>💡 {act.tip}</div>
            )}
          </>
        )}

        {/* Cost + badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 5 }}>
          {convertedCost != null && (
            <span style={{ fontSize: '11.5px', color: convertedCost === 0 ? 'var(--accent-light)' : 'var(--accent)', fontFamily: 'Fraunces, serif' }}>
              {convertedCost === 0 ? 'Free' : `${currSymbol}${convertedCost.toLocaleString()}`}
            </span>
          )}
          {act.cat && <Badge label={act.cat} cat={act.cat} />}
          {act.bookingRef && !isTransport && (
            <span style={{ fontSize: '9.5px', fontWeight: 600, padding: '2px 7px', borderRadius: 100, background: 'rgba(239,68,68,.07)', color: '#b91c1c' }}>
              Booked
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="act-actions" style={{ display: 'flex', gap: 3, opacity: 0, transition: 'opacity .18s', flexShrink: 0 }}>
        {onEdit && (
          <button
            onClick={() => onEdit(act.id)}
            style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-25)', transition: 'all .15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-warm)'; e.currentTarget.style.color = 'var(--ink)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-25)' }}
            title="Edit"
          >
            <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12 }}>
              <path d="M8.5 2.5l2 2L4 11H2v-2l6.5-6.5z" />
            </svg>
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(act.id)}
            style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-25)', transition: 'all .15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(229,62,62,.1)'; e.currentTarget.style.color = '#e53e3e' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-25)' }}
            title="Delete"
          >
            <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12 }}>
              <path d="M2 3h9M5 3V2h3v1M10 3l-.6 8a1 1 0 01-1 .9H4.6a1 1 0 01-1-.9L3 3" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
