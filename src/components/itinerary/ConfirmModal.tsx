'use client'

interface Props {
  title: string
  sub: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ title, sub, confirmLabel = 'Delete', onConfirm, onCancel }: Props) {
  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 700,
        background: 'rgba(17,17,16,.48)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)', borderRadius: 16,
          width: '100%', maxWidth: 340, padding: 24,
          animation: 'cmIn .22s cubic-bezier(.22,1,.36,1)',
        }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: 'rgba(229,62,62,.08)',
          margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg viewBox="0 0 20 20" fill="none" stroke="#e53e3e" strokeWidth="1.5" strokeLinecap="round" style={{ width: 20, height: 20 }}>
            <path d="M3 6h14M8 6V4h4v2M16 6l-.9 12a1 1 0 01-1 .9H5.9a1 1 0 01-1-.9L4 6" />
          </svg>
        </div>
        <div style={{
          fontFamily: 'var(--font-fraunces)', fontSize: 16, fontWeight: 500,
          letterSpacing: '-.02em', color: 'var(--ink)', textAlign: 'center', marginBottom: 6,
        }}>
          {title}
        </div>
        <div style={{ fontSize: '12.5px', color: 'var(--ink-50)', textAlign: 'center', lineHeight: 1.5, marginBottom: 20 }}>
          {sub}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: 10, background: 'transparent', color: 'var(--ink-50)',
              border: '1px solid var(--line-strong)', borderRadius: 8,
              fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ink)'; e.currentTarget.style.color = 'var(--ink)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-50)' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: 10, background: '#e53e3e', color: '#fff',
              border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity .18s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '.88' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
      <style>{`@keyframes cmIn{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}
