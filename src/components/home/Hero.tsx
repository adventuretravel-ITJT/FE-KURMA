import Link from 'next/link'

export default function Hero() {
  return (
    <section className="hp-hero">
      <div className="hp-wrap">
        <div className="hp-hero-grid">

          {/* Left: Text */}
          <div className="hp-hero-text">
            <div className="hp-hero-label">
              <span className="hp-hero-label-dot" />
              <span className="hp-hero-label-text">Itinerary · Booking · Connectivity</span>
            </div>
            <h1 className="hp-h1">
              Your journey,<br /><em>planned with</em> purpose.
            </h1>
            <p className="hp-hero-sub">
              From itinerary to connectivity — everything you need for your trip, in one place.
            </p>
            <div className="hp-hero-actions">
              <Link href="/auth" className="btn-dark">
                Start for free
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
              <a href="#how" className="btn-ghost">Learn more</a>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="hp-hero-visual">
            <div className="hp-hero-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80"
                alt="Fushimi Inari Shrine, Kyoto"
              />
            </div>

            {/* Floating itinerary mockup */}
            <div className="hp-mockup-float">
              <div className="hp-browser-bar">
                <div className="hp-browser-dots"><span /><span /><span /></div>
                <div className="hp-browser-url">
                  <span className="hp-browser-url-text">kurmago/itinerary/japan</span>
                </div>
              </div>
              <div className="hp-mf-content">
                <div className="hp-mf-day">Day 1 · April 12</div>
                <div className="hp-mf-city">Tokyo — Arrival</div>
                <div className="hp-mf-card">
                  <span className="hp-mf-card-time">09:00</span>
                  <span className="hp-mf-card-name">Senso-ji Temple</span>
                  <span className="hp-mf-card-tag tag-culture">Culture</span>
                </div>
                <div className="hp-mf-card">
                  <span className="hp-mf-card-time">12:00</span>
                  <span className="hp-mf-card-name">Tsukiji Outer Market</span>
                  <span className="hp-mf-card-tag tag-food">Food</span>
                </div>
                <div className="hp-mf-card">
                  <span className="hp-mf-card-time">15:00</span>
                  <span className="hp-mf-card-name">TeamLab Planets</span>
                  <span className="hp-mf-card-tag tag-activity">Activity</span>
                </div>
              </div>
            </div>

            {/* Floating city guide card */}
            <div className="hp-cg-float">
              <div className="hp-cg-city">Tokyo</div>
              <div className="hp-cg-season">Spring · Best months</div>
              <div className="hp-cg-temp">20°</div>
              <div className="hp-cg-sep" />
              <div className="hp-cg-label">Checklist</div>
              <div className="hp-cg-check"><div className="hp-cg-box done" />JR Pass activated</div>
              <div className="hp-cg-check"><div className="hp-cg-box done" />Suica IC Card</div>
              <div className="hp-cg-check"><div className="hp-cg-box" />Pocket WiFi</div>
              <div className="hp-cg-check"><div className="hp-cg-box" />Cash yen ready</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
