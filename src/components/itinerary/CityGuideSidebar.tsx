'use client'

import { useEffect, useState } from 'react'
import { WeatherData } from './types'
import { CityInfo, CITY_DATA, getCityInfo } from './cityData'
import BestTimeCalendar from './BestTimeCalendar'

const API = process.env.NEXT_PUBLIC_API_URL

interface Props {
  cities: string[]
  tripMonth?: number
}

// Map API response shape to CityInfo
function apiToCityInfo(d: Record<string, unknown>): CityInfo {
  return {
    name: String(d.name ?? ''),
    kanji: d.kanji ? String(d.kanji) : undefined,
    country: String(d.country ?? ''),
    flag: String(d.flag_emoji ?? '🌍'),
    icon: String(d.icon ?? '⛅'),
    lat: Number(d.lat ?? 0),
    lon: Number(d.lon ?? 0),
    bestMonths: Array.isArray(d.best_months) ? (d.best_months as number[]) : [],
    okMonths: Array.isArray(d.ok_months) ? (d.ok_months as number[]) : [],
    season: String(d.season ?? d.climate ?? ''),
    desc: String(d.description ?? ''),
    checklist: Array.isArray(d.checklist) ? (d.checklist as string[]) : [],
    tips: Array.isArray(d.tips)
      ? (d.tips as Array<{ icon?: string; title?: string; note?: string }>).map(t => ({ icon: String(t.icon ?? ''), title: String(t.title ?? ''), note: String(t.note ?? '') }))
      : [],
    eats: Array.isArray(d.eats)
      ? (d.eats as Array<{ name?: string; price?: string }>).map(e => ({ name: String(e.name ?? ''), price: String(e.price ?? '') }))
      : [],
  }
}

function useWeather(cityName: string) {
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!cityName) return
    setLoading(true)
    fetch(`/api/weather?city=${encodeURIComponent(cityName)}`)
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [cityName])

  return { data, loading }
}

function WeatherCard({ cityName, cityInfo }: { cityName: string; cityInfo: CityInfo | null }) {
  const { data, loading } = useWeather(cityName)

  return (
    <div style={{ background: 'var(--bg-warm)', borderRadius: 10, padding: 13, marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 14, fontWeight: 500, letterSpacing: '-.02em', color: 'var(--ink)' }}>
            {cityInfo?.name ?? cityName}
            {cityInfo?.kanji && <span style={{ fontSize: 11, color: 'var(--ink-25)', marginLeft: 4 }}>{cityInfo.kanji}</span>}
          </div>
          <div style={{ fontSize: 10, color: 'var(--ink-25)', marginTop: 2, letterSpacing: '.04em' }}>
            {cityInfo?.season ?? 'Live weather'}
          </div>
        </div>
        <div style={{ fontSize: 22, lineHeight: 1 }}>
          {loading ? '⏳' : (data?.emoji ?? cityInfo?.icon ?? '🌡️')}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
        {loading ? (
          <div style={{ fontSize: 12, color: 'var(--ink-25)' }}>Loading weather…</div>
        ) : data ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 17, lineHeight: 1, color: '#C0392B' }}>{data.tempMax}°</div>
              <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-25)' }}>High</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 17, lineHeight: 1, color: '#2563eb' }}>{data.tempMin}°</div>
              <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-25)' }}>Low</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 17, lineHeight: 1, color: 'var(--accent)' }}>{data.windspeed}<span style={{ fontSize: 11 }}>km/h</span></div>
              <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-25)' }}>Wind</div>
            </div>
          </>
        ) : (
          <div style={{ fontSize: 11, color: 'var(--ink-25)' }}>Weather unavailable</div>
        )}
      </div>

      {data && (
        <div style={{ fontSize: 11, color: 'var(--ink-50)', lineHeight: 1.6, borderTop: '1px solid var(--line)', paddingTop: 9, marginTop: 4 }}>
          {data.desc}
        </div>
      )}
    </div>
  )
}

function Section({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '14px 0 8px', fontSize: '9.5px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-25)' }}>
      {label}
      <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
    </div>
  )
}

function useCityInfo(citySlug: string): CityInfo | null {
  const [info, setInfo] = useState<CityInfo | null>(() => getCityInfo(citySlug))

  useEffect(() => {
    const local = getCityInfo(citySlug)
    if (local) { setInfo(local); return }

    // Not in hardcoded data — try API by name match
    const displayName = citySlug.replace(/_/g, ' ')
    fetch(`${API}/api/city-guides?search=${encodeURIComponent(displayName)}&is_active=true`)
      .then(r => r.json())
      .then(d => {
        if (d.status === 'success' && d.data?.length > 0) {
          const match = d.data.find((c: { name: string }) =>
            c.name.toLowerCase() === displayName.toLowerCase()
          ) ?? d.data[0]
          setInfo(apiToCityInfo(match as Record<string, unknown>))
        }
      })
      .catch(() => {})
  }, [citySlug])

  return info
}

export default function CityGuideSidebar({ cities, tripMonth }: Props) {
  const [activeCity, setActiveCity] = useState(cities[0] ?? '')

  useEffect(() => {
    if (cities.length > 0 && !cities.includes(activeCity)) setActiveCity(cities[0])
  }, [cities, activeCity])

  if (cities.length === 0) return null

  const cityInfo = useCityInfo(activeCity)
  const displayName = cityInfo?.name ?? activeCity.replace(/_/g, ' ')

  return (
    <aside className="scrollbar-hide" style={{
      borderLeft: '1px solid var(--line)',
      background: 'var(--bg-card)',
      overflowY: 'auto',
      overflowX: 'hidden',
      height: '100%',
      padding: '20px 14px 40px 16px',
    }}>
      <span style={{ fontSize: '9.5px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-25)', marginBottom: 12, display: 'block' }}>
        City Guide
      </span>

      {/* City tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
        {cities.map((c) => {
          const info = CITY_DATA[c]
          const name = info?.name ?? c.replace(/_/g, ' ')
          const on = c === activeCity
          return (
            <button
              key={c}
              onClick={() => setActiveCity(c)}
              style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '.04em',
                padding: '4px 9px', border: `1px solid ${on ? 'var(--ink)' : 'var(--line-strong)'}`,
                borderRadius: 100, color: on ? 'var(--bg)' : 'var(--ink-50)',
                background: on ? 'var(--ink)' : 'none', cursor: 'pointer',
                transition: 'all .18s', fontFamily: 'inherit',
              }}
            >
              {name}
            </button>
          )
        })}
      </div>

      {/* Weather card */}
      <WeatherCard cityName={displayName} cityInfo={cityInfo} />

      {/* Best time calendar */}
      {cityInfo && cityInfo.bestMonths.length > 0 && (
        <>
          <Section label="Best Time" />
          <BestTimeCalendar city={cityInfo} tripMonth={tripMonth} />
        </>
      )}

      {/* Checklist */}
      {cityInfo && cityInfo.checklist.length > 0 && (
        <>
          <Section label="Pack / Prep" />
          <div>
            {cityInfo.checklist.map((item, i) => (
              <CheckItem key={i} label={item} />
            ))}
          </div>
        </>
      )}

      {/* Tips */}
      {cityInfo && cityInfo.tips.length > 0 && (
        <>
          <Section label="Local Tips" />
          <div>
            {cityInfo.tips.map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 9, padding: '7px 0', borderBottom: i < cityInfo.tips.length - 1 ? '1px solid var(--line)' : 'none', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{tip.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink)' }}>{tip.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-50)', lineHeight: 1.5, marginTop: 1 }}>{tip.note}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Eats */}
      {cityInfo && cityInfo.eats.length > 0 && (
        <>
          <Section label="Must Eat" />
          <div>
            {cityInfo.eats.map((eat, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: i < cityInfo.eats.length - 1 ? '1px solid var(--line)' : 'none' }}>
                <span style={{ fontSize: 12, color: 'var(--ink)' }}>{eat.name}</span>
                <span style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-fraunces)' }}>{eat.price}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {!cityInfo && (
        <div style={{ fontSize: '11.5px', color: 'var(--ink-25)', lineHeight: 1.6, marginTop: 8 }}>
          No city guide data yet for <strong>{displayName}</strong>. Weather data is live.
        </div>
      )}
    </aside>
  )
}

function CheckItem({ label }: { label: string }) {
  const [done, setDone] = useState(false)
  return (
    <div
      onClick={() => setDone((d) => !d)}
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--line)', cursor: 'pointer', userSelect: 'none' }}
    >
      <div style={{
        width: 13, height: 13, border: `1.5px solid ${done ? 'var(--accent)' : 'var(--line-strong)'}`,
        borderRadius: 3, flexShrink: 0, background: done ? 'var(--accent)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s',
      }}>
        {done && (
          <svg viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" style={{ width: 7, height: 7 }}>
            <path d="M2 5l2 2.5 4-4" />
          </svg>
        )}
      </div>
      <span style={{ fontSize: '11.5px', color: done ? 'var(--ink-25)' : 'var(--ink-50)', textDecoration: done ? 'line-through' : 'none', transition: 'all .15s', lineHeight: 1.4 }}>
        {label}
      </span>
    </div>
  )
}
