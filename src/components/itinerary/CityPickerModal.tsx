'use client'

import { useEffect, useState } from 'react'
import { CITY_DATA, CityInfo } from './cityData'

const API = process.env.NEXT_PUBLIC_API_URL

interface Props {
  dayId: string
  currentCity: string
  country?: string    // trip destination — filters available cities
  onSelect: (dayId: string, city: string) => void
  onClose: () => void
}

interface PickerEntry {
  slug: string
  name: string
  kanji?: string
  flag: string
  icon: string
  season: string
}

function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '_')
}

function fromCityData(key: string, cd: CityInfo): PickerEntry {
  return { slug: key, name: cd.name, kanji: cd.kanji, flag: cd.flag, icon: cd.icon, season: cd.season }
}

export default function CityPickerModal({ dayId, currentCity, country, onSelect, onClose }: Props) {
  const [apiEntries, setApiEntries] = useState<PickerEntry[]>([])
  const [loadingApi, setLoadingApi] = useState(true)

  // Fetch cities from API filtered by country
  useEffect(() => {
    const params = new URLSearchParams({ is_active: 'true' })
    if (country) params.set('country', country)

    fetch(`${API}/api/city-guides?${params}`)
      .then(r => r.json())
      .then(d => {
        if (d.status === 'success' && Array.isArray(d.data)) {
          setApiEntries(d.data.map((c: {
            name: string; kanji?: string; flag_emoji?: string; icon?: string;
            season?: string; climate?: string;
          }) => ({
            slug: nameToSlug(c.name),
            name: c.name,
            kanji: c.kanji ?? undefined,
            flag: c.flag_emoji ?? '🌍',
            icon: c.icon ?? '⛅',
            season: c.season ?? c.climate ?? '',
          })))
        }
      })
      .catch(() => {})
      .finally(() => setLoadingApi(false))
  }, [country])

  // Hardcoded cities filtered by country (used as fallback when API returns nothing)
  const hardcoded = Object.entries(CITY_DATA)
    .filter(([, cd]) => !country || cd.country === country)
    .map(([key, cd]) => fromCityData(key, cd))

  // Prefer API entries; supplement with hardcoded cities not yet in API
  const apiSlugs = new Set(apiEntries.map(e => e.slug))
  const fallback = hardcoded.filter(e => !apiSlugs.has(e.slug))
  const entries: PickerEntry[] = apiEntries.length > 0
    ? [...apiEntries, ...fallback]
    : hardcoded

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
          <div>
            <span style={{ fontFamily: 'var(--font-fraunces)', fontSize: 16, fontWeight: 500, letterSpacing: '-.02em', color: 'var(--ink)' }}>
              Ganti kota
            </span>
            {country && (
              <p style={{ fontSize: 11, color: 'var(--ink-25)', marginTop: 2 }}>{country} only</p>
            )}
          </div>
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
          {loadingApi && entries.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', fontSize: 13, color: 'var(--ink-25)' }}>Loading cities…</div>
          ) : entries.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', fontSize: 13, color: 'var(--ink-25)' }}>
              No cities found{country ? ` for ${country}` : ''}.
            </div>
          ) : (
            entries.map((entry) => {
              const isActive = entry.slug === currentCity
              return (
                <div
                  key={entry.slug}
                  onClick={() => { onSelect(dayId, entry.slug); onClose() }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
                    cursor: 'pointer', borderBottom: '1px solid var(--line)',
                    background: isActive ? 'var(--accent-bg)' : 'transparent',
                    transition: 'background .15s',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--bg-warm)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? 'var(--accent-bg)' : 'transparent' }}
                >
                  <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{entry.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>
                      {entry.name}{entry.kanji ? ` ${entry.kanji}` : ''}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ink-25)', marginTop: 1 }}>{entry.season}</div>
                  </div>
                  {isActive && (
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <div style={{ width: 7, height: 5, borderLeft: '1.5px solid #fff', borderBottom: '1.5px solid #fff', transform: 'rotate(-45deg) translateY(-1px)' }} />
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
      <style>{`@keyframes cmIn{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}
