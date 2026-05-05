'use client'
import { useState } from 'react'

const faqs = [
  {
    q: 'What is Kurma.Guide?',
    a: "Kurma.Guide is your personal trip companion — built by travel consultants and powered by AI. Every itinerary is crafted by someone who's helped hundreds of travelers plan the same trip, then delivered in a clean, mobile-friendly format you can access anywhere.",
  },
  {
    q: 'Is it free to use?',
    a: 'Yes — creating an account is free and you can preview itineraries right away. Unlock your full itinerary by purchasing a trip through Kurma. You can also earn extra access by completing your travel profile or purchasing an eSIM through our platform.',
  },
  {
    q: 'What destinations are available?',
    a: 'We offer curated itineraries across Asia and are continuously expanding. New destinations are added regularly — follow us to stay updated on what\'s coming next.',
  },
  {
    q: 'Can I share my itinerary?',
    a: 'Yes. Share your full itinerary with travel companions via a simple link, so everyone in your group has access to the same plan — no account needed to view.',
  },
  {
    q: 'What is the Travel Folder?',
    a: 'Travel Folder lets you attach documents — flight tickets, hotel confirmations, restaurant reservations — directly to each activity in your itinerary. No more digging through emails at the airport. Everything is exactly where you need it.',
  },
]

export default function FAQ() {
  const [openItems, setOpenItems] = useState(new Set<number>())

  const toggle = (i: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <section className="hp-section" id="faq">
      <div className="hp-wrap">
        <div style={{ textAlign: 'center' }}>
          <div className="hp-section-label reveal">FAQ</div>
          <h2 className="hp-h2 reveal">Questions &amp; answers</h2>
        </div>
        <div className="hp-faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className={`hp-faq-item reveal ${openItems.has(i) ? 'open' : ''}`}>
              <button className="hp-faq-q" onClick={() => toggle(i)}>
                {faq.q}
                <span className="hp-faq-icon">+</span>
              </button>
              <div className="hp-faq-a">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
