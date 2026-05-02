'use client'

import { Day } from './types'

interface Props {
  days: Day[]
  activeDayId: string | null
  onDayClick: (id: string) => void
  totalActs: number
}

export default function TOCSidebar({ days, activeDayId, onDayClick, totalActs }: Props) {
  const maxActs = Math.max(1, days.reduce((s, d) => s + d.acts.length, 0))
  const pct = Math.round((totalActs / Math.max(totalActs, days.length * 3)) * 100)

  const fmtDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr + 'T00:00:00')
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`
  }

  return (
    <aside style={{
      borderRight: '1px solid var(--line)',
      background: 'var(--bg-card)',
      overflowY: 'auto',
      padding: '20px 0 40px',
    }}>
      {/* Scrollbar style injected globally for this element */}
      <span style={{
        fontSize: '9.5px', fontWeight: 600, letterSpacing: '.1em',
        textTransform: 'uppercase', color: 'var(--ink-25)',
        padding: '0 16px', marginBottom: 8, display: 'block',
      }}>
        Days
      </span>

      {days.map((day) => {
        const active = day.id === activeDayId
        return (
          <div
            key={day.id}
            onClick={() => onDayClick(day.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '7px 16px', cursor: 'pointer',
              borderLeft: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
              background: active ? 'var(--accent-bg)' : 'transparent',
              transition: 'all .18s',
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.background = 'var(--bg-warm)'
                e.currentTarget.style.borderLeftColor = 'var(--line-strong)'
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderLeftColor = 'transparent'
              }
            }}
          >
            <span style={{
              fontFamily: 'Fraunces, serif', fontSize: 12,
              color: active ? 'var(--accent)' : 'var(--ink-25)',
              minWidth: 20, transition: 'color .18s',
            }}>
              {day.num}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 12, fontWeight: active ? 600 : 500,
                color: active ? 'var(--ink)' : 'var(--ink-50)',
                transition: 'color .18s',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {day.label}
              </div>
              {day.date && (
                <div style={{ fontSize: '9.5px', color: 'var(--ink-25)', marginTop: 1 }}>
                  {fmtDate(day.date)}
                </div>
              )}
            </div>
            <span style={{ fontSize: 10, color: 'var(--ink-25)', flexShrink: 0 }}>
              {day.acts.length > 0 ? `${day.acts.length}` : ''}
            </span>
          </div>
        )
      })}

      {/* Separator */}
      <div style={{ height: 1, background: 'var(--line)', margin: '12px 16px' }} />

      {/* Progress */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ink-25)', marginBottom: 5 }}>
          <span>Activities</span>
          <span>{totalActs}</span>
        </div>
        <div style={{ height: 3, background: 'var(--line)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', background: 'var(--accent)', borderRadius: 2,
            width: `${Math.min(100, pct)}%`, transition: 'width .4s',
          }} />
        </div>
      </div>
    </aside>
  )
}
