'use client'

import { useRef } from 'react'
import { Day, Activity, CurrencyCode } from './types'
import ActivityCard from './ActivityCard'
import { CITY_DATA } from './cityData'

interface Props {
  day: Day
  baseCurr: CurrencyCode
  currSymbol: string
  isFirst: boolean
  onAddActivity: (dayId: string, type: Activity['type']) => void
  onEditActivity: (dayId: string, actId: string) => void
  onDeleteActivity: (dayId: string, actId: string) => void
  onCityChange: (dayId: string, city: string) => void
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function fmtDate(dateStr?: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return `${DAYS_OF_WEEK[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`
}

export default function DaySection({
  day, baseCurr, currSymbol, isFirst,
  onAddActivity, onEditActivity, onDeleteActivity, onCityChange,
}: Props) {
  const cityInfo = CITY_DATA[day.city]

  return (
    <section
      id={day.id}
      style={{
        marginBottom: 2,
        scrollMarginTop: 'calc(60px + 16px)',
      }}
    >
      {/* Day header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 0 10px', borderBottom: '1px solid var(--line)',
        marginBottom: 10, position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg)', flexWrap: 'wrap',
      }}>
        {/* Day number */}
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 300, color: 'var(--ink-25)', lineHeight: 1, minWidth: 36, flexShrink: 0 }}>
          {day.num}
        </div>

        {/* Title + date + city */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 15, fontWeight: 500, letterSpacing: '-.02em', color: 'var(--ink)', lineHeight: 1.3 }}>
            {day.label}
          </div>
          {day.date && (
            <div style={{ fontSize: 11, color: 'var(--ink-25)', marginTop: 1 }}>{fmtDate(day.date)}</div>
          )}
          {/* City badge */}
          <button
            onClick={() => {
              const cities = Object.keys(CITY_DATA)
              const idx = cities.indexOf(day.city)
              const next = cities[(idx + 1) % cities.length]
              onCityChange(day.id, next)
            }}
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
            {cityInfo?.icon ?? '📍'} {cityInfo?.name ?? day.city}
            <svg viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ width: 8, height: 8, opacity: .7 }}>
              <path d="M4.5 1.5l-.001 6M1.5 4.5l3 3 3-3" />
            </svg>
          </button>
        </div>

        {/* Add activity buttons (desktop) */}
        <div className="day-header-inline-btns" style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            { type: 'activity' as const, label: '+ Activity', color: 'var(--ink)' },
            { type: 'transport' as const, label: '+ Transport', color: '#5b21b6' },
            { type: 'place' as const, label: '+ Place', color: 'var(--accent)' },
          ].map(({ type, label, color }) => (
            <button
              key={type}
              onClick={() => onAddActivity(day.id, type)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '5px 10px', border: '1px solid var(--line-strong)',
                borderRadius: 100, fontSize: 11, fontWeight: 600, color,
                background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all .18s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = color + '10' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.background = 'transparent' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Activities */}
      {day.acts.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 10 }}>
          {day.acts.map((act) => (
            <ActivityCard
              key={act.id}
              act={act}
              baseCurr={baseCurr}
              currSymbol={currSymbol}
              onEdit={(id) => onEditActivity(day.id, id)}
              onDelete={(id) => onDeleteActivity(day.id, id)}
            />
          ))}
        </div>
      ) : (
        <div style={{
          border: '1.5px dashed var(--line-strong)', borderRadius: 11,
          padding: '24px 20px', textAlign: 'center', marginBottom: 10,
        }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--bg-warm)', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 15 15" fill="none" stroke="var(--ink-25)" strokeWidth="1.5" strokeLinecap="round" style={{ width: 14, height: 14 }}>
              <circle cx="7.5" cy="7.5" r="5.5" /><path d="M7.5 5v5M5 7.5h5" />
            </svg>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-25)', marginBottom: 12, lineHeight: 1.5 }}>
            No activities yet. Add your first activity.
          </div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { type: 'activity' as const, label: 'Add activity' },
              { type: 'transport' as const, label: 'Add transport' },
            ].map(({ type, label }) => (
              <button
                key={type}
                onClick={() => onAddActivity(day.id, type)}
                style={{
                  padding: '7px 14px', border: '1px solid var(--line-strong)', borderRadius: 8,
                  fontSize: 12, fontWeight: 500, color: 'var(--ink-50)', background: 'transparent',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-50)' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
