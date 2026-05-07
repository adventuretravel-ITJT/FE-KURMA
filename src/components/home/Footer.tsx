import Link from 'next/link'

const navLinks = [
  { label: 'Itineraries', href: '#' },
  { label: 'Destinations', href: '#' },
  { label: 'Pricing', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'How it works', href: '#how' },
  { label: 'FAQ', href: '#faq' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

export default function Footer() {
  return (
    <footer className="hp-footer">
      <div className="hp-wrap">
        <div className="hp-foot-inner">
          <div>
            <div className="hp-foot-logo">Kurma<em>Go.</em></div>
            <div className="hp-foot-tagline">Plan Smart. Go Beyond.</div>
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
