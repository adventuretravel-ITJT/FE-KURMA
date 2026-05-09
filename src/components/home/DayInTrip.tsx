'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import type { DayInTripContent } from '@/types/homepage'

type Panel = 'morning' | 'afternoon' | 'evening' | 'night'

const INTERVAL = 5000
const stepIds: Panel[] = ['morning', 'afternoon', 'evening', 'night']

// Icons are fixed UI chrome
const STEP_ICONS: Record<Panel, React.ReactNode> = {
  morning: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/>
      <path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/>
      <path d="M22 22H2"/><path d="m8 6 4-4 4 4"/>
      <path d="M16 18a4 4 0 0 0-8 0"/>
    </svg>
  ),
  afternoon: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  ),
  evening: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 10v8"/><path d="m4.93 10.93 1.41 1.41"/>
      <path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/>
      <path d="M22 22H2"/><path d="m16 6-4 4-4-4"/>
      <path d="M16 18a4 4 0 0 0-8 0"/>
    </svg>
  ),
  night: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
}

const DEFAULT_STEPS = [
  { id: 'morning',   time: 'Morning · 08:00',   title: "Check today's plan",    desc: 'Open your itinerary for the day — every activity is timed, tagged, and ready. No more fumbling through notes or PDFs.' },
  { id: 'afternoon', time: 'Afternoon · 13:00', title: 'Browse the city guide', desc: 'Check what to eat nearby, local tips, and your checklist — all in the same screen.' },
  { id: 'evening',   time: 'Evening · 18:00',   title: 'Upload your documents', desc: 'Restaurant reservation just arrived? Drop it straight into the activity card. Everything in context, nothing lost.' },
  { id: 'night',     time: 'Night · 21:00',     title: 'Share with your group', desc: "Send the itinerary to your travel companions. One link, everyone's on the same page." },
]

// ── Static visual panels (decorative mockups, not CMS-managed) ───────────────

function MockupBar() {
  return (
    <div className="hp-day-mockup-bar">
      <div className="hp-day-mockup-dots"><span /><span /><span /></div>
      <div className="hp-day-mockup-url"><span>kurmago.com/itinerary/japan-7d</span></div>
    </div>
  )
}

function MorningPanel() {
  return (
    <div className="hp-day-mockup-wrap">
      <MockupBar />
      <div className="hp-day-mockup-body">
        <div className="hp-dm-header">
          <div>
            <div className="hp-dm-day-label">Day 3 · April 14</div>
            <div className="hp-dm-city">Kyoto — Temple Day</div>
          </div>
        </div>
        <div className="hp-dm-activity highlighted"><span className="hp-dm-time">08:00</span><span className="hp-dm-name">Fushimi Inari Shrine</span><span className="hp-dm-tag tag-culture">Culture</span></div>
        <div className="hp-dm-activity"><span className="hp-dm-time">11:30</span><span className="hp-dm-name">Nishiki Market</span><span className="hp-dm-tag tag-food">Food</span></div>
        <div className="hp-dm-activity"><span className="hp-dm-time">14:00</span><span className="hp-dm-name">Arashiyama Bamboo Grove</span><span className="hp-dm-tag tag-activity">Activity</span></div>
        <div className="hp-dm-activity"><span className="hp-dm-time">17:30</span><span className="hp-dm-name">Gion District Walk</span><span className="hp-dm-tag tag-culture">Culture</span></div>
      </div>
    </div>
  )
}

const IconUtensils = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>
const IconCup = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>
const IconPlate = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>

function AfternoonPanel() {
  return (
    <div className="hp-day-mockup-wrap">
      <MockupBar />
      <div className="hp-day-mockup-body">
        <div className="hp-cg-panel-header"><div><div className="hp-dm-day-label">City guide</div><div className="hp-cg-city-name">Kyoto</div></div><div style={{ textAlign: 'right' }}><div className="hp-cg-panel-temp">22°</div><div className="hp-cg-panel-condition">Partly cloudy</div></div></div>
        <div className="hp-cg-tabs"><div className="hp-cg-tab on">Must-eat</div><div className="hp-cg-tab">Checklist</div><div className="hp-cg-tab">Local tips</div></div>
        <div className="hp-cg-eat-item"><div className="hp-cg-eat-icon"><IconUtensils /></div><div><div className="hp-cg-eat-name">Nishiki Market lunch</div><div className="hp-cg-eat-type">Street food · ¥800–1,200</div></div></div>
        <div className="hp-cg-eat-item"><div className="hp-cg-eat-icon"><IconCup /></div><div><div className="hp-cg-eat-name">Mitarashi dango</div><div className="hp-cg-eat-type">Snack · near Shimogamo</div></div></div>
        <div className="hp-cg-eat-item"><div className="hp-cg-eat-icon"><IconPlate /></div><div><div className="hp-cg-eat-name">Kaiten-zushi Musashi</div><div className="hp-cg-eat-type">Dinner · ¥1,500–2,500</div></div></div>
      </div>
    </div>
  )
}

const IconPlane = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
const IconBuilding = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M16 10h.01M8 10h.01M8 14h.01M16 14h.01M12 14h.01"/></svg>
const IconUtensilsCrossed = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/><path d="m2 22 3-3"/></svg>

function EveningPanel() {
  return (
    <div className="hp-day-mockup-wrap">
      <MockupBar />
      <div className="hp-day-mockup-body">
        <div className="hp-saku-label">Travel Folder · Activity files</div>
        <div className="hp-saku-name">Kaiten-zushi Musashi</div>
        {[
          { icon: <IconPlane />, name: 'Flight_CGK-KIX.pdf', size: '1.2 MB' },
          { icon: <IconBuilding />, name: 'Hotel_Kyoto_confirm.pdf', size: '480 KB' },
          { icon: <IconUtensilsCrossed />, name: 'Restaurant_reservation.pdf', size: '210 KB' },
        ].map((f) => (
          <div key={f.name} className="hp-saku-file">
            <div className="hp-saku-file-icon">{f.icon}</div>
            <div className="hp-saku-file-name">{f.name}</div>
            <div className="hp-saku-file-size">{f.size}</div>
          </div>
        ))}
        <div className="hp-saku-upload">+ Drop a file here</div>
      </div>
    </div>
  )
}

function NightPanel() {
  return (
    <div className="hp-day-mockup-wrap">
      <MockupBar />
      <div className="hp-day-mockup-body">
        <div className="hp-share-title">Share this itinerary</div>
        <div className="hp-share-sub">Invite your travel companions</div>
        <div className="hp-share-person"><div className="hp-share-avatar" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>R</div><div className="hp-share-name">Rania</div><div className="hp-share-status hp-status-accepted">Accepted</div></div>
        <div className="hp-share-person"><div className="hp-share-avatar" style={{ background: 'var(--warm-bg)', color: 'var(--warm)' }}>D</div><div className="hp-share-name">Dimas</div><div className="hp-share-status hp-status-pending">Pending</div></div>
        <div className="hp-share-link"><div className="hp-share-link-text">kurmago.com/share/jp7d-x92k</div><div className="hp-share-copy">Copy link</div></div>
      </div>
    </div>
  )
}

const PANELS: Record<Panel, React.ReactNode> = {
  morning:   <MorningPanel />,
  afternoon: <AfternoonPanel />,
  evening:   <EveningPanel />,
  night:     <NightPanel />,
}

interface Props { data?: DayInTripContent }

export default function DayInTrip({ data }: Props) {
  const [active, setActive] = useState<Panel>('morning')
  const [tick, setTick]     = useState(0)
  const timerRef            = useRef<ReturnType<typeof setInterval> | null>(null)

  const heading    = data?.heading    ?? 'See how Kurma works in a real day.'
  const subheading = data?.subheading ?? 'Tap each moment to see Kurma in action — from morning plans to evening prep.'
  const steps      = data?.steps      ?? DEFAULT_STEPS

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActive(prev => stepIds[(stepIds.indexOf(prev) + 1) % stepIds.length])
      setTick(t => t + 1)
    }, INTERVAL)
  }, [])

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [startTimer])

  const handleClick = (id: Panel) => {
    setActive(id)
    setTick(t => t + 1)
    startTimer()
  }

  return (
    <section className="hp-section hp-daytime" id="experience">
      <div className="hp-wrap">
        <div style={{ marginBottom: 56 }}>
          <div className="hp-section-label reveal">A day in your trip</div>
          <h2 className="hp-h2 reveal">{heading}</h2>
          <p className="hp-section-sub reveal">{subheading}</p>
        </div>
        <div className="hp-daytime-inner">
          <div className="hp-day-steps reveal">
            {steps.map((s) => {
              const id = s.id as Panel
              return (
                <div
                  key={s.id}
                  className={`hp-day-step${active === id ? ' active' : ''}`}
                  onClick={() => handleClick(id)}
                >
                  <div className="hp-day-dot-wrap">
                    {active === id && (
                      <svg key={tick} className="hp-day-timer-ring" viewBox="0 0 41 41" aria-hidden="true">
                        <circle className="hp-day-timer-circle" cx="20.5" cy="20.5" r="18" />
                      </svg>
                    )}
                    <div className="hp-day-dot">{STEP_ICONS[id] ?? STEP_ICONS.morning}</div>
                  </div>
                  <div className="hp-day-step-body">
                    <div className="hp-day-step-time">{s.time}</div>
                    <div className="hp-day-step-title">{s.title}</div>
                    <div className="hp-day-step-desc">{s.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="hp-daytime-mockup reveal reveal-d1">
            <div className="hp-day-panels">
              {Object.entries(PANELS).map(([id, panel]) => (
                <div key={id} className={`hp-day-panel${active === id ? ' active' : ''}`}>
                  {panel}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
