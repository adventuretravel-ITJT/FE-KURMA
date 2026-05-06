'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`hp-nav ${scrolled ? 'scrolled' : ''}`}>
      <Link href="/" className="hp-logo">Kurma<em>Go.</em></Link>
      <ul className="hp-nav-links">
        <li><a href="#how">How it works</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li><a href="#">Blog</a></li>
        <li><a href="#">About</a></li>
      </ul>
      <div className="hp-nav-right">
        <Link href="/auth" className="hp-nav-login">Log in</Link>
        <Link href="/auth" className="hp-nav-cta">Get started</Link>
      </div>
    </nav>
  )
}
