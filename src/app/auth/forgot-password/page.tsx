'use client'

import React, { useState } from 'react'
import Link from 'next/link'

function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    async function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault()
        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.')
            return
        }
        setLoading(true)
        setError('')
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            const data = await res.json()
            if (!res.ok) {
                const msg: string = data.message || ''
                setError(
                    msg === 'Email tidak ditemukan'
                        ? 'No account found with that email address.'
                        : msg || 'Failed to send reset email.'
                )
                return
            }
            setSent(true)
        } catch {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg)' }}>
            <div style={{ width: '100%', maxWidth: 420 }}>

                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Link href="/" style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, color: 'var(--ink)', textDecoration: 'none', letterSpacing: '-.03em' }}>
                        kurma<em style={{ fontStyle: 'italic', color: 'var(--accent)', fontWeight: 300 }}>.guide</em>
                    </Link>
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: 20, padding: '40px 36px', boxShadow: '0 4px 24px rgba(17,17,16,.06)' }}>
                    {sent ? (
                        <div style={{ textAlign: 'center', animation: 'fadeUp .5s ease both' }}>
                            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-bg)', border: '1px solid var(--accent-10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" style={{ width: 24, height: 24 }}>
                                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 500, letterSpacing: '-.03em', color: 'var(--ink)', marginBottom: 8 }}>
                                Check your inbox
                            </h2>
                            <p style={{ fontSize: 13.5, color: 'var(--ink-50)', lineHeight: 1.65, marginBottom: 8 }}>
                                We sent password reset instructions to{' '}
                                <strong style={{ color: 'var(--ink-80)', fontWeight: 600 }}>{email}</strong>.
                            </p>
                            <p style={{ fontSize: 12, color: 'var(--ink-25)', lineHeight: 1.5, marginBottom: 28 }}>
                                The reset link expires in 15 minutes. Check your spam folder if you don&apos;t see it.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                                <Link href="/auth"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '12px 28px', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, borderRadius: 100, textDecoration: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                                    Back to sign in
                                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 13, height: 13 }}><path d="M4 2l4 4-4 4" /></svg>
                                </Link>
                                <button
                                    onClick={() => { setSent(false); setEmail('') }}
                                    style={{ background: 'none', border: 'none', fontSize: 12.5, color: 'var(--ink-50)', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', padding: 4 }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-50)')}>
                                    Try a different email
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: 24 }}>
                                <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 500, letterSpacing: '-.03em', lineHeight: 1.2, marginBottom: 8, color: 'var(--ink)' }}>
                                    Forgot your{' '}
                                    <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' }}>password?</em>
                                </h1>
                                <p style={{ fontSize: 13.5, color: 'var(--ink-50)', lineHeight: 1.6 }}>
                                    Enter your email and we&apos;ll send you a reset link.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} noValidate>
                                <div style={{ marginBottom: 16 }}>
                                    <label htmlFor="fp-email"
                                        style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--ink-80)', marginBottom: 4, letterSpacing: '.01em' }}>
                                        Email address
                                    </label>
                                    <input
                                        id="fp-email" type="email" placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setError('') }}
                                        autoComplete="email"
                                        style={{
                                            width: '100%', padding: '8px 12px',
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

                                <button type="submit" disabled={loading}
                                    style={{
                                        width: '100%', padding: '14px 24px', background: 'var(--ink)',
                                        color: 'var(--bg)', border: 'none', borderRadius: 100,
                                        fontSize: 14, fontWeight: 600, fontFamily: 'Plus Jakarta Sans, sans-serif',
                                        cursor: loading ? 'wait' : 'pointer', transition: 'all .3s',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        gap: 8, opacity: loading ? .7 : 1,
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
                                            <span>Send reset link</span>
                                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 16, height: 16 }}>
                                                <path d="M3 8h10M9.5 4.5L13 8l-3.5 3.5" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </form>

                            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--ink-50)' }}>
                                Remember your password?{' '}
                                <Link href="/auth"
                                    style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13 }}
                                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>
                                    Sign in
                                </Link>
                            </p>
                        </>
                    )}
                </div>

            </div>
        </div>
    )
}
