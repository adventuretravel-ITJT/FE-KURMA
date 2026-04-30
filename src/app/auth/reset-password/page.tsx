'use client'

import React, { useState, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function getPasswordStrength(password: string) {
    if (!password) return { score: 0, label: '', color: '' }
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    const levels = [
        { label: 'Too short', color: '#E74C3C' },
        { label: 'Weak',      color: '#E74C3C' },
        { label: 'Fair',      color: '#E67E22' },
        { label: 'Good',      color: '#B8956A' },
        { label: 'Strong',    color: 'var(--accent)' },
    ]
    return { score, ...levels[score] }
}

function FieldInput({
    label, id, type = 'text', placeholder, value, onChange, error, autoComplete,
}: {
    label: string; id: string; type?: string; placeholder?: string
    value: string; onChange: (v: string) => void; error?: string; autoComplete?: string
}) {
    const [showPw, setShowPw] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPw ? 'text' : 'password') : type

    return (
        <div style={{ marginBottom: 12 }}>
            <label htmlFor={id} style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--ink-80)', marginBottom: 4, letterSpacing: '.01em' }}>
                {label}
            </label>
            <div style={{ position: 'relative' }}>
                <input
                    id={id} type={inputType} placeholder={placeholder}
                    value={value} onChange={(e) => onChange(e.target.value)}
                    autoComplete={autoComplete}
                    style={{
                        width: '100%',
                        padding: isPassword ? '8px 48px 8px 12px' : '8px 12px',
                        border: `1px solid ${error ? 'var(--error)' : 'var(--line-strong)'}`,
                        borderRadius: 10, background: 'var(--bg-card)',
                        color: 'var(--ink)', fontSize: 13, outline: 'none',
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        transition: 'border-color .25s, box-shadow .25s',
                    }}
                    onFocus={(e) => {
                        if (!error) {
                            e.target.style.borderColor = 'var(--accent)'
                            e.target.style.boxShadow = '0 0 0 3px var(--accent-10)'
                        }
                    }}
                    onBlur={(e) => {
                        if (!error) {
                            e.target.style.borderColor = 'var(--line-strong)'
                            e.target.style.boxShadow = 'none'
                        }
                    }}
                />
                {isPassword && (
                    <button type="button" onClick={() => setShowPw(!showPw)}
                        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-25)', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink-50)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-25)')}
                        aria-label={showPw ? 'Hide password' : 'Show password'}>
                        {showPw ? (
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ width: 16, height: 16 }} strokeLinecap="round">
                                <path d="M2 2l12 12M6.5 6.7A3 3 0 0 0 9.3 9.5M4.6 4.7C2.8 5.9 1 8 1 8s2.5 5 7 5a7.1 7.1 0 0 0 3.4-.9M9 3.1A6.9 6.9 0 0 1 15 8s-.7 1.5-2 2.8" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ width: 16, height: 16 }}>
                                <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
                                <circle cx="8" cy="8" r="2.2" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
            {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5 }}>
                    <svg viewBox="0 0 12 12" style={{ width: 12, height: 12, flexShrink: 0 }}>
                        <circle cx="6" cy="6" r="6" fill="var(--error)" opacity=".15" />
                        <path d="M6 3.5v3M6 8.5v.5" stroke="var(--error)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                    </svg>
                    <span style={{ fontSize: 11.5, color: 'var(--error)', fontWeight: 500 }}>{error}</span>
                </div>
            )}
        </div>
    )
}

function ResetPasswordContent() {
    const params = useSearchParams()
    const [email, setEmail] = useState(params.get('email') ?? '')
    const [token, setToken] = useState(params.get('token') ?? '')
    const [password, setPassword] = useState('')
    const [confirmPw, setConfirmPw] = useState('')
    const [errors, setErrors] = useState<{ email?: string; token?: string; password?: string; confirm?: string }>({})
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)

    const pwStrength = useMemo(() => getPasswordStrength(password), [password])

    function validate() {
        const e: typeof errors = {}
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Please enter a valid email address.'
        if (!token.trim()) e.token = 'Please enter the reset token from your email.'
        if (password.length < 8) e.password = 'Password must be at least 8 characters.'
        if (password !== confirmPw) e.confirm = 'Passwords do not match.'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    async function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault()
        if (!validate()) return
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token, password }),
            })
            const data = await res.json()
            if (!res.ok) {
                const msg: string = data.message || ''
                if (msg.includes('expired') || msg.includes('sudah expired')) {
                    setErrors({ token: 'This reset link has expired. Please request a new one.' })
                } else {
                    setErrors({ token: 'Invalid token. Check your email and try again.' })
                }
                return
            }
            setDone(true)
            setTimeout(() => { window.location.href = '/auth' }, 3000)
        } catch {
            setErrors({ email: 'Something went wrong. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    if (done) {
        return (
            <div style={{ textAlign: 'center', animation: 'fadeUp .5s ease both' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-bg)', border: '1px solid var(--accent-10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" style={{ width: 24, height: 24 }}>
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                </div>
                <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 500, letterSpacing: '-.03em', color: 'var(--ink)', marginBottom: 8 }}>
                    Password <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' }}>reset!</em>
                </h2>
                <p style={{ fontSize: 13.5, color: 'var(--ink-50)', lineHeight: 1.65, marginBottom: 12 }}>
                    Your password has been successfully changed.
                </p>
                <p style={{ fontSize: 12, color: 'var(--ink-25)', lineHeight: 1.5 }}>
                    Redirecting to sign in…
                </p>
            </div>
        )
    }

    return (
        <>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 500, letterSpacing: '-.03em', lineHeight: 1.2, marginBottom: 8, color: 'var(--ink)' }}>
                    Reset your{' '}
                    <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' }}>password</em>
                </h1>
                <p style={{ fontSize: 13.5, color: 'var(--ink-50)', lineHeight: 1.6 }}>
                    Enter the token from your email and choose a new password.
                </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <FieldInput
                    label="Email address" id="rp-email" type="email" placeholder="you@example.com"
                    value={email} onChange={(v) => { setEmail(v); setErrors((p) => ({ ...p, email: undefined })) }}
                    error={errors.email} autoComplete="email"
                />

                <FieldInput
                    label="Reset token (from email)" id="rp-token" placeholder="Paste the token here"
                    value={token} onChange={(v) => { setToken(v); setErrors((p) => ({ ...p, token: undefined })) }}
                    error={errors.token}
                />

                <div style={{ marginBottom: 12 }}>
                    <FieldInput
                        label="New password" id="rp-pw" type="password" placeholder="Min. 8 characters"
                        value={password}
                        onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: undefined })) }}
                        error={errors.password} autoComplete="new-password"
                    />
                    {password && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                            <div style={{ display: 'flex', gap: 3, flex: 1 }}>
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} style={{
                                        flex: 1, height: 3, borderRadius: 2,
                                        background: i <= pwStrength.score ? pwStrength.color || 'var(--line-strong)' : 'var(--line-strong)',
                                        transition: 'background .25s',
                                    }} />
                                ))}
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 500, color: pwStrength.color || 'var(--ink-25)', whiteSpace: 'nowrap' }}>
                                {pwStrength.label}
                            </span>
                        </div>
                    )}
                </div>

                <FieldInput
                    label="Confirm new password" id="rp-confirm" type="password" placeholder="Repeat password"
                    value={confirmPw} onChange={(v) => { setConfirmPw(v); setErrors((p) => ({ ...p, confirm: undefined })) }}
                    error={errors.confirm} autoComplete="new-password"
                />

                <button type="submit" disabled={loading}
                    style={{
                        width: '100%', padding: '14px 24px', background: 'var(--ink)',
                        color: 'var(--bg)', border: 'none', borderRadius: 100,
                        fontSize: 14, fontWeight: 600, fontFamily: 'Plus Jakarta Sans, sans-serif',
                        cursor: loading ? 'wait' : 'pointer', transition: 'all .3s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: 8, opacity: loading ? .7 : 1, marginTop: 4,
                    }}
                    onMouseEnter={(e) => {
                        if (!loading) {
                            e.currentTarget.style.background = 'var(--accent)'
                            e.currentTarget.style.transform = 'translateY(-1px)'
                            e.currentTarget.style.boxShadow = '0 8px 28px rgba(44,95,78,.15)'
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--ink)'
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                    }}>
                    {loading ? (
                        <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
                    ) : (
                        <>
                            <span>Set new password</span>
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 16, height: 16 }}>
                                <path d="M3 8h10M9.5 4.5L13 8l-3.5 3.5" />
                            </svg>
                        </>
                    )}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--ink-50)' }}>
                Token expired?{' '}
                <Link href="/auth/forgot-password"
                    style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13 }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>
                    Request a new one
                </Link>
            </p>
        </>
    )
}

export default function ResetPasswordPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg)' }}>
            <div style={{ width: '100%', maxWidth: 420 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Link href="/" style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, color: 'var(--ink)', textDecoration: 'none', letterSpacing: '-.03em' }}>
                        kurma<em style={{ fontStyle: 'italic', color: 'var(--accent)', fontWeight: 300 }}>.guide</em>
                    </Link>
                </div>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: 20, padding: '40px 36px', boxShadow: '0 4px 24px rgba(17,17,16,.06)' }}>
                    <Suspense fallback={
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--line-strong)', borderTopColor: 'var(--accent)', animation: 'spin .7s linear infinite', margin: '0 auto' }} />
                        </div>
                    }>
                        <ResetPasswordContent />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
