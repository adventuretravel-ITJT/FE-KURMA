import React from 'react'

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <line x1="8" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="12" y2="18"/>
      </svg>
    ),
    color: 'green',
    title: 'Day-by-day itinerary',
    desc: 'Every day broken into timed activities with costs, transport, and local tips. No more switching between apps.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
        <line x1="8" y1="2" x2="8" y2="18"/>
        <line x1="16" y1="6" x2="16" y2="22"/>
      </svg>
    ),
    color: 'warm',
    title: 'City guide',
    desc: 'Weather, checklists, must-eat spots, and practical tips — built right into your itinerary for every city you visit.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    color: 'warm',
    title: 'Travel folder',
    desc: 'Attach flight tickets, hotel confirmations, and reservations directly to each activity. Everything where you need it.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    color: 'warm',
    title: 'Share with companions',
    desc: "Traveling with friends or family? Share your full itinerary so everyone stays on the same page.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    color: 'green',
    title: 'Asia and beyond',
    desc: 'Curated itineraries across Asia and growing, crafted with insights from expert consultants. One platform for all your trips.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        <path d="M5 3v4M19 17v4M3 5h4M17 19h4"/>
      </svg>
    ),
    color: 'warm',
    title: 'AI-assisted planning',
    desc: "AI-assisted itineraries, refined by real travel experts. Smart suggestions shaped by people who've been there.",
  },
]

export default function Features() {
  return (
    <section className="hp-section" id="features">
      <div className="hp-wrap">
        <div style={{ textAlign: 'center' }}>
          <div className="hp-section-label reveal">Features</div>
          <h2 className="hp-h2 reveal">Plan deeper.<br />Travel freer.</h2>
        </div>
        <div className="hp-feat-grid">
          {features.map((f, i) => (
            <div key={f.title} className={`hp-feat-card reveal ${i % 3 === 1 ? 'reveal-d1' : i % 3 === 2 ? 'reveal-d2' : ''}`}>
              <div className={`hp-feat-icon ${f.color}`}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
