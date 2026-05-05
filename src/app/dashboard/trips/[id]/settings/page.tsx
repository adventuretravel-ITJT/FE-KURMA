'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@/src/contexts/UserContext'
import { Trip } from '@/src/components/itinerary/types'

const TRAVEL_TYPES = ['solo', 'couple', 'family', 'group'] as const
const STATUSES     = ['draft', 'active', 'completed'] as const

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft:     { label: 'Planning',  color: '#92400e' },
  active:    { label: 'Active',    color: '#166534' },
  completed: { label: 'Completed', color: '#1d4ed8' },
}

const ACTIVITY_LABELS: Record<string, string> = {
  culture: 'Culture & History', food: 'Local Food', nature: 'Nature',
  shopping: 'City & Shopping',  sights: 'Sightseeing', parks: 'Theme Parks',
}
const PACE_LABELS: Record<string, string>   = { easy: 'Easy (2–3 spots/day)', balanced: 'Balanced (4–5 spots/day)', packed: 'Packed (maximise every hour)' }
const BUDGET_LABELS: Record<string, string> = { backpacker: 'Backpacker', smart: 'Smart', comfort: 'Comfort', splurge: 'Splurge' }
const SPECIAL_LABELS: Record<string, string> = {
  halal: 'Halal food', accessibility: 'Accessibility', stroller: 'Stroller-friendly',
  vegetarian: 'Vegetarian / Vegan', instagram: 'Instagrammable spots', offpath: 'Off the beaten path',
}

export default function TripSettingsPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? ''
  const router = useRouter()
  const { onToggleSidebar } = useUser()

  const [trip, setTrip]         = useState<Trip | null>(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState('')

  const [name, setName]         = useState('')
  const [startDate, setStart]   = useState('')
  const [endDate, setEnd]       = useState('')
  const [travelType, setTType]  = useState<string>('solo')
  const [status, setStatus]     = useState<string>('draft')

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          const t: Trip = d.data
          setTrip(t)
          setName(t.name ?? '')
          setStart(t.start_date ?? '')
          setEnd(t.end_date ?? '')
          setTType(t.travel_type ?? 'solo')
          setStatus(t.status ?? 'draft')
        }
      })
      .catch(() => setError('Failed to load trip'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSave() {
    if (!name.trim()) { setError('Trip name is required.'); return }
    setSaving(true); setError(''); setSaved(false)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: name.trim(),
          start_date:  startDate || null,
          end_date:    endDate   || null,
          travel_type: travelType,
          status,
        }),
      })
      if (!res.ok) throw new Error()
      const d = await res.json()
      setTrip(d.data)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return }
    setDeleting(true)
    try {
      const token = localStorage.getItem('token')
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      router.push('/dashboard')
    } catch {
      setError('Failed to delete.')
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  const nights = startDate && endDate
    ? Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)
    : null

  const quiz = trip?.quiz_data as Record<string, unknown> | null | undefined

  if (loading) return (
    <div style={{ padding: '80px 28px', textAlign: 'center', color: 'var(--ink-25)', fontSize: 13 }}>
      Loading…
    </div>
  )

  return (
    <>
      {/* Topnav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 60, background: 'rgba(251,250,248,.94)',
        backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--line)',
        display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14,
      }}>
        <button
          onClick={onToggleSidebar}
          style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--line-strong)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-50)', flexShrink: 0 }}
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{ width: 14, height: 14 }}><path d="M2 4h12M2 8h12M2 12h12" /></svg>
        </button>

        <Link href={`/dashboard/trips/${id}`}
          style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500, color: 'var(--ink-50)', textDecoration: 'none', flexShrink: 0, transition: 'color .18s', whiteSpace: 'nowrap' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-50)')}
        >
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: 14, height: 14 }}><path d="M9 2L4 7l5 5" /></svg>
          Itinerary
        </Link>

        <div style={{ width: 1, height: 18, background: 'var(--line-strong)', flexShrink: 0 }} />

        <div style={{ flex: 1, fontFamily: 'var(--font-fraunces)', fontSize: 15, fontWeight: 500, letterSpacing: '-.02em', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          Settings
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px',
            background: saved ? 'var(--accent)' : 'var(--ink)', color: 'var(--bg)',
            fontSize: 12, fontWeight: 600, borderRadius: 8, border: 'none',
            cursor: saving ? 'default' : 'pointer', fontFamily: 'inherit',
            transition: 'background .18s', opacity: saving ? .6 : 1, flexShrink: 0,
          }}
          onMouseEnter={(e) => { if (!saving && !saved) e.currentTarget.style.background = 'var(--accent)' }}
          onMouseLeave={(e) => { if (!saved) e.currentTarget.style.background = 'var(--ink)' }}
        >
          {saved ? (
            <>
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ width: 12, height: 12 }}><path d="M2 6l3 3 5-5" /></svg>
              Saved
            </>
          ) : saving ? 'Saving…' : 'Save changes'}
        </button>
      </nav>

      {/* Page body */}
      <div style={{ paddingTop: 60, maxWidth: 600, margin: '0 auto', padding: '80px 24px 80px' }}>

        <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 24, fontWeight: 500, letterSpacing: '-.03em', color: 'var(--ink)', marginBottom: 4 }}>
          Trip Settings
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-50)', marginBottom: 32, lineHeight: 1.6 }}>
          {trip?.destination_flag && <span style={{ marginRight: 6 }}>{trip.destination_flag}</span>}
          {trip?.destination}
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,.07)', border: '1px solid rgba(239,68,68,.18)', borderRadius: 10, fontSize: 12.5, color: '#b91c1c', marginBottom: 20 }}>
            {error}
          </div>
        )}

        {/* ── Trip Details ── */}
        <SectionHead label="Trip Details" />

        <SettingRow label="Trip name" required>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'var(--bg-card)' }}
            onBlur={(e)  => { e.target.style.borderColor = 'var(--line-strong)'; e.target.style.background = 'var(--bg)' }}
          />
        </SettingRow>

        <SettingRow label="Destination">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', height: 42, background: 'var(--bg-warm)', border: '1px solid var(--line)', borderRadius: 10, fontSize: 13, color: 'var(--ink-50)' }}>
            {trip?.destination_flag && <span>{trip.destination_flag}</span>}
            <span>{trip?.destination}</span>
            <span style={{ fontSize: 10, color: 'var(--ink-25)', marginLeft: 4 }}>· change via new trip</span>
          </div>
        </SettingRow>

        <SettingRow label="Travel dates">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-25)', marginBottom: 5 }}>Departure</div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStart(e.target.value); setError('') }}
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'var(--bg-card)' }}
                onBlur={(e)  => { e.target.style.borderColor = 'var(--line-strong)'; e.target.style.background = 'var(--bg)' }}
              />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-25)', marginBottom: 5 }}>Return</div>
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => { setEnd(e.target.value); setError('') }}
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'var(--bg-card)' }}
                onBlur={(e)  => { e.target.style.borderColor = 'var(--line-strong)'; e.target.style.background = 'var(--bg)' }}
              />
            </div>
          </div>
          {nights != null && nights >= 0 && (
            <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: 'var(--accent-bg)', borderRadius: 100, fontSize: 11, fontWeight: 500, color: 'var(--accent)' }}>
              {nights} nights · {nights + 1} days
            </div>
          )}
        </SettingRow>

        <SettingRow label="Travel type">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TRAVEL_TYPES.map((t) => {
              const on = travelType === t
              return (
                <button key={t} onClick={() => setTType(t)} style={{
                  padding: '7px 14px', border: `1.5px solid ${on ? 'var(--accent)' : 'var(--line-strong)'}`,
                  borderRadius: 8, fontSize: 12, fontWeight: on ? 600 : 500,
                  color: on ? 'var(--accent)' : 'var(--ink-50)',
                  background: on ? 'var(--accent-bg)' : 'transparent',
                  cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
                  transition: 'all .18s',
                }}>
                  {t === 'solo' ? 'Solo' : t === 'couple' ? 'Couple' : t === 'family' ? 'Family' : 'Group'}
                </button>
              )
            })}
          </div>
        </SettingRow>

        <SettingRow label="Trip status">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {STATUSES.map((s) => {
              const on = status === s
              const meta = STATUS_LABELS[s]
              return (
                <button key={s} onClick={() => setStatus(s)} style={{
                  padding: '7px 14px', border: `1.5px solid ${on ? meta.color : 'var(--line-strong)'}`,
                  borderRadius: 8, fontSize: 12, fontWeight: on ? 600 : 500,
                  color: on ? meta.color : 'var(--ink-50)',
                  background: on ? `${meta.color}10` : 'transparent',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s',
                }}>
                  {meta.label}
                </button>
              )
            })}
          </div>
        </SettingRow>

        {/* ── Quiz Preferences (read-only summary) ── */}
        {quiz && (
          <>
            <SectionHead label="Quiz Preferences" hint="saved from trip creation" />

            {Array.isArray(quiz.activities) && quiz.activities.length > 0 && (
              <InfoRow label="Activities">
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {(quiz.activities as string[]).map((a) => (
                    <Chip key={a}>{ACTIVITY_LABELS[a] ?? a}</Chip>
                  ))}
                </div>
              </InfoRow>
            )}
            {quiz.pace && (
              <InfoRow label="Pace"><Chip>{PACE_LABELS[quiz.pace as string] ?? String(quiz.pace)}</Chip></InfoRow>
            )}
            {quiz.budget && (
              <InfoRow label="Budget"><Chip>{BUDGET_LABELS[quiz.budget as string] ?? String(quiz.budget)}</Chip></InfoRow>
            )}
            {Array.isArray(quiz.special_needs) && quiz.special_needs.length > 0 && (
              <InfoRow label="Special needs">
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {(quiz.special_needs as string[]).map((s) => (
                    <Chip key={s}>{SPECIAL_LABELS[s] ?? s}</Chip>
                  ))}
                </div>
              </InfoRow>
            )}
            {(quiz.adults != null || quiz.kids != null) && (
              <InfoRow label="Travellers">
                <div style={{ display: 'flex', gap: 6 }}>
                  {quiz.adults != null && <Chip>{quiz.adults as number} adult{(quiz.adults as number) !== 1 ? 's' : ''}</Chip>}
                  {quiz.kids != null && (quiz.kids as number) > 0 && <Chip>{quiz.kids as number} kid{(quiz.kids as number) !== 1 ? 's' : ''}</Chip>}
                  {quiz.littles != null && (quiz.littles as number) > 0 && <Chip>{quiz.littles as number} little{(quiz.littles as number) !== 1 ? 's' : ''}</Chip>}
                </div>
              </InfoRow>
            )}
          </>
        )}

        {/* ── Links ── */}
        {quiz && Array.isArray(quiz.links) && (quiz.links as unknown[]).length > 0 && (
          <>
            <SectionHead label="Saved Links" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(quiz.links as { url: string; title?: string }[]).map((lnk, i) => {
                const display = lnk.title || (() => { try { return new URL(lnk.url).hostname.replace('www.', '') } catch { return lnk.url } })()
                return (
                  <a key={i} href={lnk.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 10, textDecoration: 'none', transition: 'border-color .18s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--line-strong)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--line)')}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{display}</div>
                      <div style={{ fontSize: 11, color: 'var(--accent)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>{lnk.url}</div>
                    </div>
                    <svg viewBox="0 0 12 12" fill="none" stroke="var(--ink-25)" strokeWidth="1.5" strokeLinecap="round" style={{ width: 12, height: 12, flexShrink: 0 }}>
                      <path d="M7 2h3v3M10 2L5 7M4 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V8" />
                    </svg>
                  </a>
                )
              })}
            </div>
          </>
        )}

        {/* ── Danger zone ── */}
        <SectionHead label="Danger Zone" />
        <div style={{ border: '1px solid rgba(239,68,68,.2)', borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>Delete this trip</div>
            <div style={{ fontSize: 12, color: 'var(--ink-50)', lineHeight: 1.5 }}>
              Permanently removes the trip and all its itinerary data. This cannot be undone.
            </div>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              padding: '9px 18px', background: confirmDelete ? '#dc2626' : 'transparent',
              color: confirmDelete ? '#fff' : '#dc2626', border: '1.5px solid #dc2626',
              borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: deleting ? 'default' : 'pointer',
              fontFamily: 'inherit', transition: 'all .18s', flexShrink: 0, opacity: deleting ? .6 : 1,
            }}
          >
            {deleting ? 'Deleting…' : confirmDelete ? 'Confirm delete' : 'Delete trip'}
          </button>
        </div>
        {confirmDelete && !deleting && (
          <button onClick={() => setConfirmDelete(false)} style={{ fontSize: 11.5, color: 'var(--ink-25)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', marginTop: 8, padding: '2px 0' }}>
            Cancel
          </button>
        )}

        <div style={{ height: 80 }} />
      </div>
    </>
  )
}

/* ── Sub-components ── */
const inputStyle: React.CSSProperties = {
  width: '100%', height: 42, padding: '0 12px',
  background: 'var(--bg)', border: '1px solid var(--line-strong)',
  borderRadius: 10, fontSize: 13.5, color: 'var(--ink)', fontFamily: 'inherit',
  outline: 'none', transition: 'border-color .18s, background .18s',
}

function SectionHead({ label, hint }: { label: string; hint?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '28px 0 14px', fontSize: '10px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-25)' }}>
      {label}
      {hint && <span style={{ fontSize: 9, fontWeight: 400, letterSpacing: '.04em', textTransform: 'none', color: 'var(--ink-25)' }}>— {hint}</span>}
      <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
    </div>
  )
}

function SettingRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--ink-50)', marginBottom: 7 }}>
        {label}{required && <span style={{ color: 'var(--accent)', marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  )
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '9px 0', borderBottom: '1px solid var(--line)', flexWrap: 'wrap' }}>
      <div style={{ fontSize: 12, color: 'var(--ink-25)', minWidth: 90, flexShrink: 0, paddingTop: 3 }}>{label}</div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 100, background: 'var(--accent-bg)', color: 'var(--accent)', display: 'inline-block' }}>
      {children}
    </span>
  )
}
