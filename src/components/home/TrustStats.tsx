import React from 'react'

const stats = [
  { num: '200', suffix: '+', label: 'Trips planned' },
  { num: '4.8', suffix: '/5', label: 'Average satisfaction' },
  { num: '60', suffix: '%', label: 'Travelers who return' },
  { num: '10', suffix: '+', label: 'Destinations covered' },
]

export default function TrustStats() {
  return (
    <div className="hp-trust reveal">
      <div className="hp-wrap">
        <div className="hp-trust-label">Trusted by travelers planning their next adventure</div>
        <div className="hp-trust-stats">
          {stats.map((s, i) => (
            <React.Fragment key={s.label}>
              <div className="hp-trust-stat">
                <div className="hp-trust-num">{s.num}<span>{s.suffix}</span></div>
                <div className="hp-trust-stat-label">{s.label}</div>
              </div>
              {i < stats.length - 1 && <div className="hp-trust-divider" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
