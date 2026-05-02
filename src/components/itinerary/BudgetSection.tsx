'use client'

import { useState } from 'react'
import { Day, CurrencyCode, RATES_TO_IDR, CURRENCIES } from './types'

interface Props {
  days: Day[]
  baseCurr: CurrencyCode
  onCurrChange: (c: CurrencyCode) => void
}

const CATS = ['Transport', 'Activity', 'Food', 'Stay', 'Shopping'] as const
const DOT_COLORS = ['#5b21b6', '#9d174d', '#92400e', '#7a5e36', '#1d4ed8']

export default function BudgetSection({ days, baseCurr, onCurrChange }: Props) {
  const [open, setOpen] = useState(false)
  const [showCurrModal, setShowCurrModal] = useState(false)

  const curr = CURRENCIES.find((c) => c.code === baseCurr) ?? CURRENCIES[0]

  const totals: Record<string, number> = { Transport: 0, Activity: 0, Food: 0, Stay: 0, Shopping: 0 }
  days.forEach((d) => {
    d.acts.forEach((a) => {
      const amt = ((a.cost ?? 0) * (RATES_TO_IDR[a.costCurr as CurrencyCode] ?? 1)) / (RATES_TO_IDR[baseCurr] ?? 1)
      if (a.type === 'transport') totals.Transport += amt
      else if (a.cat === 'food') totals.Food += amt
      else if (a.cat === 'stay') totals.Stay += amt
      else if (a.cat === 'shopping') totals.Shopping += amt
      else totals.Activity += amt
    })
  })
  const grand = Object.values(totals).reduce((s, v) => s + v, 0)

  return (
    <>
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--line)',
          borderRadius: 12,
          padding: '14px 16px',
          marginBottom: 20,
          transition: 'border-color .18s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--line-strong)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--line)')}
      >
        <div
          onClick={() => setOpen((o) => !o)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
        >
          <div>
            <div style={{ fontSize: '10.5px', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-25)' }}>
              Total Budget
            </div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 500, letterSpacing: '-.02em', color: 'var(--ink)', marginTop: 4 }}>
              {curr.symbol}{Math.round(grand).toLocaleString()}{' '}
              <small style={{ fontFamily: 'inherit', fontSize: 11, color: 'var(--ink-25)', fontWeight: 400 }}>estimated</small>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowCurrModal(true) }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px',
                border: '1px solid var(--line-strong)', borderRadius: 100,
                fontSize: '11.5px', fontWeight: 500, color: 'var(--ink-50)', background: 'transparent',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ink-25)'; e.currentTarget.style.color = 'var(--ink)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-50)' }}
            >
              {curr.flag} {curr.code}
              <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 10, height: 10 }}>
                <path d="M2 3.5l3 3 3-3" />
              </svg>
            </button>
            <div style={{
              width: 18, height: 18, borderRadius: '50%', border: '1px solid var(--line-strong)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform .2s', transform: open ? 'rotate(180deg)' : undefined,
            }}>
              <svg viewBox="0 0 10 10" fill="none" stroke="var(--ink-25)" strokeWidth="2" strokeLinecap="round" style={{ width: 10, height: 10 }}>
                <path d="M2 3.5l3 3 3-3" />
              </svg>
            </div>
          </div>
        </div>

        {open && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
            {/* Bar */}
            {grand > 0 && (
              <div style={{ height: 3, background: 'var(--line)', borderRadius: 2, overflow: 'hidden', marginBottom: 12 }}>
                <div style={{ display: 'flex', height: '100%', borderRadius: 2, overflow: 'hidden' }}>
                  {CATS.map((cat, i) => {
                    const pct = grand > 0 ? (totals[cat] / grand) * 100 : 0
                    return pct > 0 ? (
                      <div key={cat} style={{ width: `${pct}%`, background: DOT_COLORS[i], transition: 'width .4s' }} />
                    ) : null
                  })}
                </div>
              </div>
            )}
            {/* Rows */}
            {CATS.map((cat, i) => {
              const val = totals[cat] ?? 0
              const pct = grand > 0 ? Math.round((val / grand) * 100) : 0
              return (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: DOT_COLORS[i], flexShrink: 0 }} />
                  <div style={{ fontSize: 12, color: 'var(--ink-50)', flex: 1 }}>{cat}</div>
                  <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--ink)', fontFamily: 'Fraunces, serif' }}>
                    {curr.symbol}{Math.round(val).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--ink-25)', minWidth: 32, textAlign: 'right' }}>{pct}%</div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Currency modal */}
      {showCurrModal && (
        <>
          <div
            onClick={() => setShowCurrModal(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 600,
              background: 'rgba(17,17,16,.4)',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            }}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 601,
            background: 'var(--bg-card)', borderRadius: '18px 18px 0 0',
            maxHeight: '70vh', overflowY: 'auto',
          }}>
            <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: 16, fontWeight: 500 }}>Currency</span>
              <button onClick={() => setShowCurrModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-25)', fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            {CURRENCIES.map((c) => (
              <div
                key={c.code}
                onClick={() => { onCurrChange(c.code); setShowCurrModal(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '13px 18px', cursor: 'pointer',
                  borderBottom: '1px solid var(--line)',
                  background: c.code === baseCurr ? 'var(--accent-bg)' : 'transparent',
                  transition: 'background .15s',
                }}
                onMouseEnter={(e) => { if (c.code !== baseCurr) e.currentTarget.style.background = 'var(--bg-warm)' }}
                onMouseLeave={(e) => { if (c.code !== baseCurr) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ fontSize: 20 }}>{c.flag}</span>
                <span style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--ink)', flex: 1 }}>{c.name}</span>
                <span style={{ fontSize: 12, color: 'var(--ink-25)' }}>{c.code}</span>
                {c.code === baseCurr && (
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" style={{ width: 8, height: 8 }}>
                      <path d="M2 5l2 2.5 4-4" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}
