'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { NavbarContent } from '@/types/homepage'

const DEFAULT_LINKS = [
  { label: 'How it works', href: '#how' },
  { label: 'Features',     href: '#features' },
  { label: 'FAQ',          href: '#faq' },
  { label: 'Blog',         href: '#' },
  { label: 'About',        href: '#' },
]

interface Props { data?: NavbarContent }

export default function Navbar({ data }: Props) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links      = data?.links ?? DEFAULT_LINKS
  const loginLabel = data?.login_label ?? 'Log in'
  const loginHref  = data?.login_href  ?? '/auth'
  const ctaLabel   = data?.cta_label   ?? 'Get started'
  const ctaHref    = data?.cta_href    ?? '/auth'

  return (
    <nav className={`hp-nav ${scrolled ? 'scrolled' : ''}`}>
      <Link href="/" className="hp-logo">Kurma<em>Go.</em></Link>
      <ul className="hp-nav-links">
        {links.map((l) => (
          <li key={l.label}><a href={l.href}>{l.label}</a></li>
        ))}
      </ul>
      <div className="hp-nav-right">
        <Link href={loginHref} className="hp-nav-login">{loginLabel}</Link>
        <Link href={ctaHref}   className="hp-nav-cta">{ctaLabel}</Link>
      </div>
    </nav>
  )
}
