'use client'

import { useState } from 'react'
import { CurrencyCode, RATES_TO_IDR } from './types'
import { getHotel } from './hotelData'

interface Props {
  cityA: string
  cityB: string
  baseCurr: CurrencyCode
  currSymbol: string
}

function StarRating({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: 2, marginBottom: 5 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 10 10" style={{ width: 11, height: 11, fill: i < count ? 'var(--warm, #c9913a)' : 'var(--line)' }}>
          <path d="M5 1l1.2 2.5 2.8.4-2 2 .5 2.8L5 7.5 2.5 8.7l.5-2.8-2-2 2.8-.4z" />
        </svg>
      ))}
    </div>
  )
}

export default function SuggestedStay({ cityA, cityB, baseCurr, currSymbol }: Props) {
  const [hovered, setHovered] = useState(false)
  const hotel = getHotel(cityA) ?? getHotel(cityB)
  if (!hotel) return null

  const price = Math.round(hotel.priceJPY * RATES_TO_IDR['JPY'] / (RATES_TO_IDR[baseCurr] ?? 1))

  return (
    <div style={{ margin: '12px 0' }}>
      {/* Divider label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: '9.5px', fontWeight: 600, letterSpacing: '.1em',
        textTransform: 'uppercase', color: 'var(--ink-25)', marginBottom: 10,
      }}>
        <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" style={{ width: 11, height: 11 }}>
          <rect x="2" y="3" width="12" height="11" rx="1" /><path d="M8 3v11M5 7h1.5M9.5 7H11M5 10h1.5M9.5 10H11" />
        </svg>
        Suggested stay
        <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      </div>

      {/* Hotel card */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {}}
        style={{
          background: 'var(--bg-card)',
          border: `1px solid ${hovered ? 'var(--line-strong)' : 'var(--line)'}`,
          borderRadius: 12, overflow: 'hidden',
          transition: 'all .2s', cursor: 'pointer',
          boxShadow: hovered ? '0 4px 16px rgba(17,17,16,.07)' : 'none',
        }}
      >
        {/* Photo */}
        <img
          src={hotel.photo}
          alt={hotel.name}
          loading="lazy"
          style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }}
        />

        {/* Body */}
        <div style={{ padding: '11px 13px 12px' }}>
          {/* AI Pick badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 9, fontWeight: 700, letterSpacing: '.06em',
            textTransform: 'uppercase', color: 'var(--accent)',
            background: 'var(--accent-bg)', padding: '2px 7px',
            borderRadius: 100, marginBottom: 6,
          }}>
            ✦ AI Pick
          </div>

          {/* Name */}
          <div style={{
            fontFamily: 'Fraunces, serif', fontSize: 14, fontWeight: 500,
            letterSpacing: '-.02em', color: 'var(--ink)', marginBottom: 3,
          }}>
            {hotel.name}
          </div>

          <StarRating count={hotel.stars} />

          {/* Brief */}
          <div style={{ fontSize: '11.5px', color: 'var(--ink-50)', lineHeight: 1.5, marginBottom: 8 }}>
            {hotel.brief}
          </div>

          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--ink-25)' }}>
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: 11, height: 11 }}>
                <path d="M7 1a4 4 0 014 4c0 3-4 8-4 8S3 8 3 5a4 4 0 014-4z" /><circle cx="7" cy="5" r="1.5" />
              </svg>
              {hotel.distanceNote}
            </div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 13, fontWeight: 500, color: 'var(--accent)' }}>
              {currSymbol}{price.toLocaleString()}{' '}
              <span style={{ fontFamily: 'var(--sans)', fontSize: 10, color: 'var(--ink-25)', fontWeight: 400 }}>/malam</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
