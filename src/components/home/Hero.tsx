import Link from 'next/link'
import type { HeroContent } from '@/types/homepage'

interface Props { data?: HeroContent }

export default function Hero({ data }: Props) {
  const label       = data?.label                ?? 'Itinerary · Booking · Connectivity'
  const heading     = data?.heading              ?? 'Your journey, planned with purpose.'
  const subheading  = data?.subheading           ?? 'From itinerary to connectivity — everything you need for your trip, in one place.'
  const primaryLabel= data?.button_primary_label ?? 'Start for free'
  const primaryHref = data?.button_primary_href  ?? '/auth'
  const secondLabel = data?.button_secondary_label ?? 'Learn more'
  const secondHref  = data?.button_secondary_href  ?? '#how'
  const imageUrl    = data?.image_url            ?? 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80'
  const imageAlt    = data?.image_alt            ?? 'Fushimi Inari Shrine, Kyoto'

  return (
    <section className="hp-hero">
      <div className="hp-wrap">
        <div className="hp-hero-grid">

          {/* Left: Text */}
          <div className="hp-hero-text">
            <div className="hp-hero-label">
              <span className="hp-hero-label-dot" />
              <span className="hp-hero-label-text">{label}</span>
            </div>
            <h1 className="hp-h1" dangerouslySetInnerHTML={{ __html: heading.replace('\n', '<br />') }} />
            <p className="hp-hero-sub">{subheading}</p>
            <div className="hp-hero-actions">
              <Link href={primaryHref} className="btn-dark">
                {primaryLabel}
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
              <a href={secondHref} className="btn-ghost">{secondLabel}</a>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="hp-hero-visual">
            <div className="hp-hero-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt={imageAlt} />
            </div>

            {/* Floating itinerary mockup */}
            <div className="hp-mockup-float">
              <div className="hp-browser-bar">
                <div className="hp-browser-dots"><span /><span /><span /></div>
                <div className="hp-browser-url">
                  <span className="hp-browser-url-text">kurmago.com/itinerary/japan</span>
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
