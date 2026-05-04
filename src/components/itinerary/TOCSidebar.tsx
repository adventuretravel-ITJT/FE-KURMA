'use client'

import { useState } from 'react'
import { Day } from './types'

interface Props {
  days: Day[]
  activeDayId: string | null
  todayDayId?: string
  onDayClick: (id: string) => void
  onAddDay: () => void
  onDeleteDay: (id: string) => void
  onOpenCityModal: (id: string) => void
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function fmtDate(dateStr?: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return `${DOW[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`
}

export default function TOCSidebar({
  days, activeDayId, todayDayId, onDayClick, onAddDay, onDeleteDay, onOpenCityModal,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const activeIdx = days.findIndex((d) => d.id === activeDayId)
  const pct = activeIdx >= 0 ? Math.round(((activeIdx + 1) / days.length) * 100) : 0

  return (
    <aside className="scrollbar-hide" style={{
      borderRight: '1px solid var(--line)',
      background: 'var(--bg-card)',
      overflowY: 'auto',
      height: '100%',
      padding: '20px 0 40px',
    }}>
      <span style={{
        fontSize: '9.5px', fontWeight: 600, letterSpacing: '.1em',
        textTransform: 'uppercase', color: 'var(--ink-25)',
        padding: '0 16px', marginBottom: 8, display: 'block',
      }}>
        Days
      </span>

      {days.map((day) => {
        const active = day.id === activeDayId
        const isToday = day.id === todayDayId
        const hovered = day.id === hoveredId

        return (
          <div
            key={day.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '7px 16px', cursor: 'pointer',
              borderLeft: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
              background: active ? 'var(--accent-bg)' : hovered ? 'var(--bg-warm)' : 'transparent',
              transition: 'all .18s', position: 'relative',
            }}
            onClick={() => onDayClick(day.id)}
            onMouseEnter={() => setHoveredId(day.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <span style={{
              fontFamily: 'Fraunces, serif', fontSize: 12,
              color: active ? 'var(--accent)' : 'var(--ink-25)',
              minWidth: 20, transition: 'color .18s', flexShrink: 0,
            }}>
              {String(day.num).padStart(2, '0')}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 12, fontWeight: active ? 600 : 500,
                color: active ? 'var(--ink)' : 'var(--ink-50)',
                transition: 'color .18s',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                {day.label}
                {isToday && (
                  <span style={{
                    display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--accent)', flexShrink: 0, verticalAlign: 'middle',
                  }} />
                )}
              </div>
              {day.date && (
                <div style={{ fontSize: '9.5px', color: 'var(--ink-25)', marginTop: 1 }}>
                  {fmtDate(day.date)}
                </div>
              )}
            </div>
            {/* Activity count — hidden when hovered to show actions */}
            {!hovered && day.acts.length > 0 && (
              <span style={{ fontSize: 10, color: 'var(--ink-25)', flexShrink: 0 }}>
                {day.acts.length}
              </span>
            )}

            {/* Hover action buttons */}
            {hovered && (
              <div
                style={{ display: 'flex', gap: 2, alignItems: 'center', flexShrink: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <TocActionBtn
                  title="Change city"
                  onClick={() => onOpenCityModal(day.id)}
                >
                  🏙
                </TocActionBtn>
                {days.length > 1 && (
                  <TocActionBtn
                    title="Delete day"
                    danger
                    onClick={() => onDeleteDay(day.id)}
                  >
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ width: 10, height: 10 }}>
                      <path d="M2 3h8M4 3V2h4v1M3 3l.7 7.5a.5.5 0 00.5.5h4.6a.5.5 0 00.5-.5L10 3" />
                    </svg>
                  </TocActionBtn>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* Separator */}
      <div style={{ height: 1, background: 'var(--line)', margin: '12px 16px' }} />

      {/* Add day button */}
      <button
        onClick={onAddDay}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          width: '100%', padding: '8px 16px',
          fontSize: 12, fontWeight: 500, color: 'var(--ink-25)',
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit', transition: 'color .15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink-25)' }}
      >
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 12, height: 12 }}>
          <path d="M6 1v10M1 6h10" />
        </svg>
        Add day
      </button>

      {/* Separator */}
      <div style={{ height: 1, background: 'var(--line)', margin: '12px 16px' }} />

      {/* Progress */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ink-25)', marginBottom: 5 }}>
          <span>Progress</span>
          <span>{pct}%</span>
        </div>
        <div style={{ height: 3, background: 'var(--line)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', background: 'var(--accent)', borderRadius: 2,
            width: `${pct}%`, transition: 'width .4s',
          }} />
        </div>
      </div>
    </aside>
  )
}

function TocActionBtn({ title, onClick, danger, children }: {
  title: string
  onClick: () => void
  danger?: boolean
  children: React.ReactNode
}) {
  const [hov, setHov] = useState(false)
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 20, height: 20, borderRadius: 4, border: 'none',
        background: hov ? (danger ? 'rgba(229,62,62,.1)' : 'var(--bg-warm)') : 'transparent',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hov && danger ? '#e53e3e' : 'var(--ink-25)',
        fontSize: 11, transition: 'all .15s', fontFamily: 'inherit', padding: 0,
      }}
    >
      {children}
    </button>
  )
}
