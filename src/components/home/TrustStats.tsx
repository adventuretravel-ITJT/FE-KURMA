import React from 'react'
import type { TrustStatsContent } from '@/types/homepage'

const DEFAULT_STATS = [
  { num: '200', suffix: '+', label: 'Trips planned' },
  { num: '4.8', suffix: '/5', label: 'Average satisfaction' },
  { num: '60',  suffix: '%', label: 'Travelers who return' },
  { num: '10',  suffix: '+', label: 'Destinations covered' },
]

interface Props { data?: TrustStatsContent }

export default function TrustStats({ data }: Props) {
  const label = data?.label ?? 'Trusted by travelers planning their next adventure'
  const stats = data?.items ?? DEFAULT_STATS

  return (
    <div className="hp-trust reveal">
      <div className="hp-wrap">
        <div className="hp-trust-label">{label}</div>
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
