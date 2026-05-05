'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

type Status = 'pending' | 'loading' | 'success' | 'already' | 'error'

function VerifyEmailContent() {
    const params = useSearchParams()
    const token = params?.get('token') ?? null

    const [status, setStatus] = useState<Status>(token ? 'loading' : 'pending')
    const [userEmail, setUserEmail] = useState('')
    const [resent, setResent] = useState(false)
    const [resending, setResending] = useState(false)

    useEffect(() => {
        if (token) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email/verify/${token}`)
                .then(async (res) => {
                    if (res.ok) {
                        setStatus('success')
                        setTimeout(() => { window.location.href = '/dashboard' }, 3000)
                    } else if (res.status === 422) {
                        setStatus('already')
                    } else {
                        setStatus('error')
                    }
                })
                .catch(() => setStatus('error'))
        } else {
            // No token — user just registered; fetch their email to display it
            const stored = typeof window !== 'undefined' ? localStorage.getItem('token') : null
            if (stored) {
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
                    headers: { Authorization: `Bearer ${stored}` },
                })
                    .then(async (res) => {
                        if (res.ok) {
                            const data = await res.json()
                            setUserEmail(data.email || '')
                        }
                    })
                    .catch(() => {})
            }
        }
    }, [token])

    async function handleResend() {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        if (!stored) return
        setResending(true)
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email/resend`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${stored}` },
            })
            setResent(true)
        } finally {
            setResending(false)
        }
    }

    /* ── Pending: no token in URL, waiting for user to check inbox ── */
    if (status === 'pending') {
        return (
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-bg)', border: '1px solid var(--accent-10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" style={{ width: 24, height: 24 }}>
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 500, letterSpacing: '-.03em', color: 'var(--ink)', marginBottom: 8 }}>
                    Check your email
                </h2>
                {userEmail ? (
                    <p style={{ fontSize: 13.5, color: 'var(--ink-50)', lineHeight: 1.65, marginBottom: 6 }}>
                        We sent a verification link to{' '}
                        <strong style={{ color: 'var(--ink-80)', fontWeight: 600 }}>{userEmail}</strong>.
                    </p>
                ) : (
                    <p style={{ fontSize: 13.5, color: 'var(--ink-50)', lineHeight: 1.65, marginBottom: 6 }}>
                        We sent a verification link to your inbox.
                    </p>
                )}
                <p style={{ fontSize: 12.5, color: 'var(--ink-50)', lineHeight: 1.65, marginBottom: 28 }}>
                    Click the link in the email to activate your account. Check your spam folder if you don&apos;t see it.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                    {resent ? (
                        <p style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>
                            ✓ New verification email sent — check your inbox.
                        </p>
                    ) : (
                        <button onClick={handleResend} disabled={resending}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '12px 28px', background: 'var(--ink)', color: 'var(--bg)', fontSize: 14, fontWeight: 600, borderRadius: 100, border: 'none', cursor: resending ? 'wait' : 'pointer', fontFamily: 'var(--font-plus-jakarta-sans)', opacity: resending ? .6 : 1 }}>
                            {resending ? 'Sending…' : 'Resend verification email'}
                        </button>
                    )}
                    <Link href="/auth"
                        style={{ fontSize: 13, color: 'var(--ink-50)', textDecoration: 'none', fontFamily: 'var(--font-plus-jakarta-sans)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-50)')}>
                        Back to sign in
                    </Link>
                </div>
            </div>
        )
    }

    /* ── Loading: verifying token ── */
    if (status === 'loading') {
        return (
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--line-strong)', borderTopColor: 'var(--accent)', animation: 'spin .7s linear infinite', margin: '0 auto 20px' }} />
                <p style={{ fontSize: 14, color: 'var(--ink-50)' }}>Verifying your email…</p>
            </div>
        )
    }

    /* ── Success ── */
    if (status === 'success') {
        return (
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-bg)', border: '1px solid var(--accent-10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" style={{ width: 24, height: 24 }}><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 24, fontWeight: 500, letterSpacing: '-.03em', color: 'var(--ink)', marginBottom: 8 }}>
                    Email verified!
                </h2>
                <p style={{ fontSize: 13.5, color: 'var(--ink-50)', lineHeight: 1.65, marginBottom: 12 }}>
                    Your account is fully activated. Welcome to Kurma!
                </p>
                <p style={{ fontSize: 12, color: 'var(--ink-25)' }}>
                    Redirecting to dashboard…
                </p>
            </div>
        )
    }

    /* ── Already verified ── */
    if (status === 'already') {
        return (
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-bg)', border: '1px solid var(--accent-10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" style={{ width: 24, height: 24 }}><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 24, fontWeight: 500, letterSpacing: '-.03em', color: 'var(--ink)', marginBottom: 8 }}>
                    Already verified
                </h2>
                <p style={{ fontSize: 13.5, color: 'var(--ink-50)', lineHeight: 1.65, marginBottom: 28 }}>
                    This email has already been verified. You&apos;re good to go!
                </p>
                <Link href="/dashboard"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '12px 28px', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, borderRadius: 100, textDecoration: 'none', fontFamily: 'var(--font-plus-jakarta-sans)' }}>
                    Go to dashboard
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 13, height: 13 }}><path d="M4 2l4 4-4 4" /></svg>
                </Link>
            </div>
        )
    }

    /* ── Error: invalid or expired token ── */
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(231,76,60,.08)', border: '1px solid rgba(231,76,60,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" style={{ width: 24, height: 24 }}><path d="M12 8v4M12 16v.5" /><circle cx="12" cy="12" r="9" /></svg>
            </div>
            <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 24, fontWeight: 500, letterSpacing: '-.03em', color: 'var(--ink)', marginBottom: 8 }}>
                Link invalid or expired
            </h2>
            <p style={{ fontSize: 13.5, color: 'var(--ink-50)', lineHeight: 1.65, marginBottom: 28 }}>
                This verification link is no longer valid. Request a new one below.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                {resent ? (
                    <p style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>
                        ✓ New verification email sent — check your inbox.
                    </p>
                ) : (
                    <button onClick={handleResend} disabled={resending}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '12px 28px', background: 'var(--ink)', color: 'var(--bg)', fontSize: 14, fontWeight: 600, borderRadius: 100, border: 'none', cursor: resending ? 'wait' : 'pointer', fontFamily: 'var(--font-plus-jakarta-sans)', opacity: resending ? .6 : 1 }}>
                        {resending ? 'Sending…' : 'Resend verification email'}
                    </button>
                )}
                <Link href="/auth"
                    style={{ fontSize: 13, color: 'var(--ink-50)', textDecoration: 'none', fontFamily: 'var(--font-plus-jakarta-sans)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-50)')}>
                    Back to sign in
                </Link>
            </div>
        </div>
    )
}

export default function VerifyEmailPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg)' }}>
            <div style={{ width: '100%', maxWidth: 420 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Link href="/" style={{ fontFamily: 'var(--font-fraunces)', fontSize: 20, fontWeight: 500, color: 'var(--ink)', textDecoration: 'none', letterSpacing: '-.03em' }}>
                        kurma<em style={{ fontStyle: 'italic', color: 'var(--accent)', fontWeight: 300 }}>.guide</em>
                    </Link>
                </div>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: 20, padding: '40px 36px', boxShadow: '0 4px 24px rgba(17,17,16,.06)' }}>
                    <Suspense fallback={
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--line-strong)', borderTopColor: 'var(--accent)', animation: 'spin .7s linear infinite', margin: '0 auto 20px' }} />
                        </div>
                    }>
                        <VerifyEmailContent />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
