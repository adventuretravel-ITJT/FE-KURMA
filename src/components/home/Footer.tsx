import Link from 'next/link'
import type { FooterContent } from '@/types/homepage'

const DEFAULT_NAV_LINKS = [
  { label: 'Itineraries',  href: '#' },
  { label: 'Destinations', href: '#' },
  { label: 'Pricing',      href: '#' },
  { label: 'Blog',         href: '#' },
  { label: 'How it works', href: '#how' },
  { label: 'FAQ',          href: '#faq' },
]

const DEFAULT_LEGAL_LINKS = [
  { label: 'Privacy Policy',   href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

interface Props { data?: FooterContent }

export default function Footer({ data }: Props) {
  const logoText   = data?.logo_text   ?? 'KurmaGo.'
  const tagline    = data?.tagline     ?? 'Plan Smart. Go Beyond.'
  const navLinks   = data?.nav_links   ?? DEFAULT_NAV_LINKS
  const legalLinks = data?.legal_links ?? DEFAULT_LEGAL_LINKS

  return (
    <footer className="hp-footer">
      <div className="hp-wrap">
        <div className="hp-foot-inner">
          <div>
            <div className="hp-foot-logo">{logoText}</div>
            <div className="hp-foot-tagline">{tagline}</div>
          </div>
          <nav className="hp-foot-nav">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href}>{l.label}</a>
            ))}
          </nav>
          <div className="hp-foot-copy">
            <span>© 2026 KurmaGo.</span>
            <nav className="hp-foot-legal">
              {legalLinks.map((l) => (
                <Link key={l.label} href={l.href}>{l.label}</Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
