'use client'

import Link from 'next/link'

interface ActionProps {
  label: string
  href?: string
  onClick?: () => void
}

function ActionButton({ action, variant }: { action: ActionProps; variant: 'primary' | 'secondary' }) {
  const className = variant === 'primary' ? 'ep-btn-primary' : 'ep-btn-secondary'

  if (action.href) {
    return (
      <Link href={action.href} className={className}>
        {action.label}
      </Link>
    )
  }

  return (
    <button type="button" onClick={action.onClick} className={className}>
      {action.label}
    </button>
  )
}

interface ErrorPageProps {
  code: string | number
  title: string
  description: string
  primaryAction?: ActionProps
  secondaryAction?: ActionProps
}

export default function ErrorPage({ code, title, description, primaryAction, secondaryAction }: ErrorPageProps) {
  return (
    <div className="ep-root">
      <header className="ep-topbar">
        <div className="ep-topbar-inner">
          <Link href="/" className="ep-wordmark" aria-label="KurmaGo Home">
            Kurma<em>Go.</em>
          </Link>
          <Link href="/" className="ep-back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Home
          </Link>
        </div>
      </header>

      <main className="ep-body">
        <div className="ep-inner">
          <div className="ep-code" aria-hidden="true">{code}</div>
          <h1 className="ep-title">{title}</h1>
          <p className="ep-desc">{description}</p>
          <div className="ep-actions">
            {primaryAction && <ActionButton action={primaryAction} variant="primary" />}
            {secondaryAction && <ActionButton action={secondaryAction} variant="secondary" />}
          </div>
        </div>
      </main>
    </div>
  )
}
