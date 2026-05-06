import Link from 'next/link'

const navLinks = [
  { label: 'Itineraries', href: '#' },
  { label: 'Destinations', href: '#' },
  { label: 'Pricing', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'How it works', href: '#how' },
  { label: 'FAQ', href: '#faq' },
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
          <div className="hp-foot-copy">© 2026 KurmaGo.</div>
        </div>
      </div>
    </footer>
  )
}
