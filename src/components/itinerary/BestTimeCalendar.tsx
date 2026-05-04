'use client'

import { CityInfo, MONTH_NAMES, getMonthRating } from './cityData'

interface Props {
  city: CityInfo
  tripMonth?: number
}

export default function BestTimeCalendar({ city, tripMonth }: Props) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginBottom: 8 }}>
        {MONTH_NAMES.map((mon, idx) => {
          const rating = getMonthRating(city, idx)
          const isPeak = rating === 'best'
          const isTripMonth = tripMonth === idx
          return (
            <span
              key={mon}
              style={{
                fontSize: 9,
                padding: '2px 5px',
                borderRadius: 3,
                background: isPeak ? 'var(--accent-bg)' : 'var(--bg-card)',
                color: isPeak ? 'var(--accent)' : 'var(--ink-25)',
                border: `1px solid ${isPeak ? 'var(--accent-10)' : 'var(--line)'}`,
                fontWeight: isTripMonth ? 700 : 500,
                outline: isTripMonth ? '2px solid var(--accent)' : undefined,
                outlineOffset: isTripMonth ? '1px' : undefined,
              }}
            >
              {mon}
            </span>
          )
        })}
      </div>
      {city.desc && (
        <div style={{ fontSize: '10.5px', color: 'var(--ink-25)', lineHeight: 1.5 }}>
          {city.desc}
        </div>
      )}
    </div>
  )
}
