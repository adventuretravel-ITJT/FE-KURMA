'use client'

import { CityInfo, MONTH_NAMES, getMonthRating, MonthRating } from './cityData'

interface Props {
  city: CityInfo
  /** 0-indexed month of the trip's start_date (optional highlight) */
  tripMonth?: number
}

const RATING_STYLE: Record<MonthRating, { bg: string; color: string; border: string }> = {
  best:  { bg: 'var(--accent)',    color: '#fff',          border: 'var(--accent)' },
  ok:    { bg: 'var(--warm-bg)',   color: 'var(--warm)',   border: 'var(--warm-10)' },
  avoid: { bg: 'var(--ink-05)',    color: 'var(--ink-25)', border: 'var(--line)' },
}

export default function BestTimeCalendar({ city, tripMonth }: Props) {
  return (
    <div>
      <div style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-25)', marginBottom: 10 }}>
        Best Time to Visit
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
        {(['best', 'ok', 'avoid'] as MonthRating[]).map((r) => {
          const s = RATING_STYLE[r]
          const label = r === 'best' ? 'Best' : r === 'ok' ? 'Shoulder' : 'Avoid'
          return (
            <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: s.bg, border: `1px solid ${s.border}` }} />
              <span style={{ fontSize: '9px', color: 'var(--ink-25)', fontWeight: 500 }}>{label}</span>
            </div>
          )
        })}
      </div>

      {/* 12-month grid (3 columns × 4 rows) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
        {MONTH_NAMES.map((mon, idx) => {
          const rating = getMonthRating(city, idx)
          const s = RATING_STYLE[rating]
          const isTripMonth = tripMonth === idx
          return (
            <div
              key={mon}
              title={rating === 'best' ? 'Optimal' : rating === 'ok' ? 'Shoulder season' : 'Not recommended'}
              style={{
                padding: '5px 4px',
                borderRadius: 6,
                background: s.bg,
                border: `1.5px solid ${isTripMonth ? 'var(--ink)' : s.border}`,
                textAlign: 'center',
                position: 'relative',
                boxShadow: isTripMonth ? '0 0 0 2px var(--ink)' : undefined,
              }}
            >
              <div style={{ fontSize: '9.5px', fontWeight: isTripMonth ? 700 : 600, color: s.color }}>
                {mon}
              </div>
              {isTripMonth && (
                <div style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--ink)',
                  border: '1.5px solid var(--bg-card)',
                }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Best months note */}
      {city.bestMonths.length > 0 && (
        <div style={{ marginTop: 10, fontSize: '10.5px', color: 'var(--ink-50)', lineHeight: 1.5, fontStyle: 'italic' }}>
          {city.desc}
        </div>
      )}
    </div>
  )
}
