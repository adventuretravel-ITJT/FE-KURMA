'use client'

import { CITY_DATA } from './cityData'

interface Props {
  dayId: string
  currentCity: string
  onSelect: (dayId: string, city: string) => void
  onClose: () => void
}

export default function CityPickerModal({ dayId, currentCity, onSelect, onClose }: Props) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(17,17,16,.48)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)', borderRadius: 18,
          width: '100%', maxWidth: 360, overflow: 'hidden',
          animation: 'cmIn .22s cubic-bezier(.22,1,.36,1)',
        }}
      >
        <div style={{
          padding: '18px 20px 14px', borderBottom: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: 'var(--font-fraunces)', fontSize: 16, fontWeight: 500, letterSpacing: '-.02em', color: 'var(--ink)' }}>
            Ganti kota
          </span>
          <button
            onClick={onClose}
            style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--line-strong)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-50)' }}
          >
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 12, height: 12 }}>
              <path d="M2 2l8 8M10 2l-8 8" />
            </svg>
          </button>
        </div>
        <div style={{ maxHeight: '62vh', overflowY: 'auto' }}>
          {Object.entries(CITY_DATA).map(([key, cd]) => {
            const isActive = key === currentCity
            return (
              <div
                key={key}
                onClick={() => { onSelect(dayId, key); onClose() }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
                  cursor: 'pointer', borderBottom: '1px solid var(--line)',
                  background: isActive ? 'var(--accent-bg)' : 'transparent',
                  transition: 'background .15s',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--bg-warm)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? 'var(--accent-bg)' : 'transparent' }}
              >
                <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{cd.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>
                    {cd.name}{cd.kanji ? ` ${cd.kanji}` : ''}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-25)', marginTop: 1 }}>{cd.season}</div>
                </div>
                {isActive && (
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: 7, height: 5, borderLeft: '1.5px solid #fff', borderBottom: '1.5px solid #fff', transform: 'rotate(-45deg) translateY(-1px)' }} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <style>{`@keyframes cmIn{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}
