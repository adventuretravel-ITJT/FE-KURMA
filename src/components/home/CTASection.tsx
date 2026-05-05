import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="hp-cta reveal">
      <div className="hp-wrap">
        <h2 className="hp-h2">Ready for your next trip?</h2>
        <p className="hp-cta-sub">Create a free account and explore curated itineraries for your destination.</p>
        <div className="hp-cta-actions">
          <Link href="/auth" className="btn-dark">
            Get started — free
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
