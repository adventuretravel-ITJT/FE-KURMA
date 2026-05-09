import Link from 'next/link'
import type { CtaSectionContent } from '@/types/homepage'

interface Props { data?: CtaSectionContent }

export default function CTASection({ data }: Props) {
  const heading     = data?.heading      ?? 'Ready for your next trip?'
  const subtitle    = data?.subtitle     ?? 'Create a free account and explore curated itineraries for your destination.'
  const buttonLabel = data?.button_label ?? 'Get started — free'
  const buttonHref  = data?.button_href  ?? '/auth'

  return (
    <section className="hp-cta reveal">
      <div className="hp-wrap">
        <h2 className="hp-h2">{heading}</h2>
        <p className="hp-cta-sub">{subtitle}</p>
        <div className="hp-cta-actions">
          <Link href={buttonHref} className="btn-dark">
            {buttonLabel}
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
