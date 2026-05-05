const steps = [
  {
    num: '01',
    title: 'Create your account',
    desc: 'Sign up with Google, Apple or email in seconds. Your trips are saved and accessible from any device.',
  },
  {
    num: '02',
    title: 'Tell us about your trip',
    desc: 'Share your destination, travel dates, who\'s joining, and how you like to explore. The more we know, the better your plan.',
  },
  {
    num: '03',
    title: 'Travel with everything in one place',
    desc: 'Your itinerary, city guides, eSIM, documents, and checklists — all in one clean interface, ready before you land.',
  },
]

export default function HowItWorks() {
  return (
    <section className="hp-section hp-how" id="how">
      <div className="hp-wrap">
        <div className="hp-how-inner">
          <div>
            <div className="hp-section-label reveal">How it works</div>
            <h2 className="hp-h2 reveal">From idea to departure —<br />guided every step.</h2>
            <p className="hp-section-sub reveal">No complicated setup. No information overload. Just your trip, organized the way it should be.</p>
          </div>
          <div className="hp-how-steps">
            {steps.map((s, i) => (
              <div key={s.num} className={`hp-how-step reveal ${i > 0 ? `reveal-d${i}` : ''}`}>
                <div className="hp-how-step-num">{s.num}</div>
                <div>
                  <div className="hp-how-step-title">{s.title}</div>
                  <div className="hp-how-step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
