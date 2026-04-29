'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useGoogleLogin } from '@react-oauth/google'

type Panel = 'login' | 'register'

function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

function getPasswordStrength(password: string) {
    if (!password) return { score: 0, label: '', barClass: '', color: '' }
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    const levels = [
        { label: 'Too short', barClass: 'weak',   color: '#E74C3C' },
        { label: 'Weak',      barClass: 'weak',   color: '#E74C3C' },
        { label: 'Fair',      barClass: 'fair',   color: '#E67E22' },
        { label: 'Good',      barClass: 'good',   color: '#B8956A' },
        { label: 'Strong',    barClass: 'strong', color: 'var(--accent)' },
    ]
    return { score, ...levels[score] }
}

function PasswordStrengthBar({ password }: { password: string }) {
    const { score, label, barClass, color } = useMemo(() => getPasswordStrength(password), [password])
    return (
        <div className={`pw-strength ${password ? 'show' : ''}`}>
            <div className="pw-bars">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`pw-bar ${i <= score ? barClass : ''}`} />
                ))}
            </div>
            <span className="pw-label" style={{ color: color || 'var(--ink-25)' }}>{label || 'Enter a password'}</span>
        </div>
    )
}

function FormInput({
    label, id, type = 'text', placeholder, value, onChange, error, autoComplete, children,
}: {
    label: string; id: string; type?: string; placeholder?: string
    value: string; onChange: (v: string) => void; error?: string
    autoComplete?: string; children?: React.ReactNode
}) {
    const [showPw, setShowPw] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPw ? 'text' : 'password') : type

    return (
        <div className="form-group" style={{ marginBottom: 10 }}>
            {label && (
                <label htmlFor={id} style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--ink-80)', marginBottom: 3, letterSpacing: '.01em' }}>
                    {label}
                </label>
            )}
            <div style={{ position: 'relative' }}>
                <input
                    id={id} type={inputType} placeholder={placeholder}
                    value={value} onChange={(e) => onChange(e.target.value)}
                    autoComplete={autoComplete}
                    className={error ? 'form-input error' : 'form-input'}
                    style={{
                        width: '100%',
                        padding: isPassword ? '8px 48px 8px 12px' : '8px 12px',
                        border: '1px solid var(--line-strong)',
                        borderRadius: 10,
                        background: 'var(--bg-card)',
                        color: 'var(--ink)',
                        fontSize: 13,
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontWeight: 400,
                        outline: 'none',
                        transition: 'border-color .25s, box-shadow .25s, background .25s',
                        WebkitAppearance: 'none',
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
                        className="input-toggle"
                        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-25)', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color .2s' }}
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
            {children}
            <div className={`form-error ${error ? 'show' : ''}`}>
                <svg viewBox="0 0 12 12" style={{ width: 12, height: 12, flexShrink: 0 }}>
                    <circle cx="6" cy="6" r="6" fill="var(--error)" opacity=".15" />
                    <path d="M6 3.5v3M6 8.5v.5" stroke="var(--error)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                </svg>
                {error}
            </div>
        </div>
    )
}

/* ── Google SVG ──────────────────────────────────── */
function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    )
}

/* ── Social buttons ──────────────────────────────── */
function SocialButtons({ variant }: { variant: 'login' | 'register' }) {
    const [googleLoading, setGoogleLoading] = useState(false)
    const [googleError, setGoogleError] = useState('')

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setGoogleLoading(true)
            setGoogleError('')
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ access_token: tokenResponse.access_token }),
                })
                const data = await res.json()
                if (!res.ok) { setGoogleError(data.message || 'Google login failed.'); return }
                localStorage.setItem('token', data.token)
                window.location.href = '/dashboard'
            } catch {
                setGoogleError('Something went wrong. Please try again.')
            } finally {
                setGoogleLoading(false)
            }
        },
        onError: () => setGoogleError('Google sign-in was cancelled or failed.'),
    })

    const btnStyle: React.CSSProperties = {
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '12px 16px', border: '1px solid var(--line-strong)', borderRadius: 10,
        background: 'var(--bg-card)', fontSize: 12.5, fontWeight: 600, color: 'var(--ink)',
        cursor: googleLoading ? 'wait' : 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif',
        opacity: googleLoading ? .6 : 1,
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row" style={{ gap: 10, marginBottom: 4 }}>
                <button type="button" className="btn-social" style={btnStyle}
                    disabled={googleLoading} onClick={() => loginWithGoogle()}>
                    {googleLoading ? (
                        <div style={{ width: 14, height: 14, border: '2px solid var(--line-strong)', borderTopColor: 'var(--ink)', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
                    ) : <GoogleIcon />}
                    {variant === 'register' ? 'Sign up with Google' : 'Google'}
                </button>

            </div>
            {googleError && (
                <p style={{ fontSize: 11.5, color: 'var(--error)', marginTop: 4, fontWeight: 500 }}>{googleError}</p>
            )}
        </div>
    )
}

/* ── Left panel ──────────────────────────────────── */
function AuthLeft() {
    return (
        <div className="auth-left hidden lg:flex flex-col justify-between" style={{
            position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
            background: 'var(--ink)', padding: '48px 56px',
        }}>

            {/* Noise grain */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E")`,
                opacity: .4, zIndex: 0,
            }} />
            {/* Green orb */}
            <div style={{
                position: 'absolute', width: 640, height: 640, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(44,95,78,.35) 0%, transparent 70%)',
                bottom: -180, right: -120, pointerEvents: 'none', zIndex: 0,
            }} />

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

                {/* Logo */}
                <Link href="/" style={{
                    fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500,
                    color: 'rgba(255,255,255,.9)', textDecoration: 'none', letterSpacing: '-.03em',
                }}>
                    kurma<em style={{ fontStyle: 'italic', color: 'rgba(44,150,100,.85)', fontWeight: 300 }}>.guide</em>
                </Link>

                {/* Body */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: '20px 0 40px', marginTop: 20 }}>

                    {/* <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px 6px 8px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 100, marginBottom: 32, width: 'fit-content' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-light)', animation: 'pulse-dot 2s infinite', display: 'inline-block' }} />
                        <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,.4)', letterSpacing: '.05em' }}>NOW IN BETA</span>
                    </div> */}

                    <h2 style={{
                        fontFamily: 'Fraunces, serif', fontSize: 'clamp(28px, 3vw, 40px)',
                        fontWeight: 500, lineHeight: 1.12, letterSpacing: '-.04em',
                        color: 'rgba(255,255,255,.9)', marginBottom: 20,
                    }}>
                        Your next trip,<br />
                        <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'rgba(44,150,100,.8)' }}>thoughtfully</em><br />
                        planned.
                    </h2>

                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,.35)', lineHeight: 1.75, maxWidth: 380 }}>
                        Join thousands of travellers who plan smarter with Kurma — your personal itinerary companion for every journey.
                    </p>
                </div>

                {/* Testimonial */}
                <div style={{
                    background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
                    borderRadius: 16, padding: '24px 28px', marginBottom: 10,
                    animation: 'fadeUp .9s ease .3s both',
                }}>
                    <p style={{ fontFamily: 'Fraunces, serif', fontSize: 15, fontWeight: 300, fontStyle: 'italic', color: 'rgba(255,255,255,.6)', lineHeight: 1.65, marginBottom: 16 }}>
                        <span style={{ display: 'block', fontSize: 22, fontStyle: 'normal', color: 'var(--accent-light)', lineHeight: 1, marginBottom: 4 }}>&ldquo;</span>
                        Kurma changed how I travel. Every detail, beautifully organised in one place.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), rgba(184,149,106,.6))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif', flexShrink: 0 }}>
                            SA
                        </div>
                        <div>
                            <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.55)' }}>Sarah A.</p>
                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,.25)' }}>Frequent traveller · 12 trips planned</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

/* ── Login form ──────────────────────────────────── */
function LoginForm({ onSwitch }: { onSwitch: () => void }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
    const [loading, setLoading] = useState(false)

    function validate() {
        const e: typeof errors = {}
        if (!isValidEmail(email)) e.email = 'Please enter a valid email address.'
        if (password.length < 8) e.password = 'Password must be at least 8 characters.'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    async function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault()
        if (!validate()) return
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            const data = await res.json()
            if (!res.ok) { setErrors({ email: data.message || 'Invalid credentials.' }); return }
            localStorage.setItem('token', data.token)
            window.location.href = '/dashboard'
        } catch {
            setErrors({ email: 'Something went wrong. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(22px, 2.5vw, 28px)', fontWeight: 500, letterSpacing: '-.03em', lineHeight: 1.2, marginBottom: 6, color: 'var(--ink)' }}>
                    Welcome <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' }}>back</em>
                </h1>
                <p style={{ fontSize: 13.5, color: 'var(--ink-50)', lineHeight: 1.6 }}>Sign in to continue planning your journeys.</p>
            </div>

            <SocialButtons variant="login" />
            <div className="auth-divider"><span>or continue with email</span></div>

            <form onSubmit={handleSubmit} noValidate>
                <FormInput label="Email address" id="login-email" type="email" placeholder="you@example.com"
                    value={email} onChange={(v) => { setEmail(v); setErrors((p) => ({ ...p, email: undefined })) }}
                    error={errors.email} autoComplete="email" />

                <div className="form-group" style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                        <label htmlFor="login-pw" style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-80)', letterSpacing: '.01em' }}>
                            Password
                        </label>
                        <Link href="/forgot-password" style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-50)', textDecoration: 'none', transition: 'color .25s' }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-50)')}>
                            Forgot password?
                        </Link>
                    </div>
                    <FormInput label="" id="login-pw" type="password" placeholder="Enter your password"
                        value={password} onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: undefined })) }}
                        error={errors.password} autoComplete="current-password" />
                </div>

                <button type="submit" disabled={loading} className="auth-submit-btn"
                    style={{ width: '100%', padding: '15px 24px', background: 'var(--ink)', color: 'var(--bg)', border: 'none', borderRadius: 100, fontSize: 14, fontWeight: 600, fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '.01em', cursor: loading ? 'wait' : 'pointer', transition: 'all .3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? .7 : 1, pointerEvents: loading ? 'none' : 'auto' }}
                    onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(44,95,78,.15)' } }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                    {loading ? (
                        <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
                    ) : (
                        <>
                            <span>Sign in</span>
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="auth-submit-arrow" style={{ width: 16, height: 16 }}>
                                <path d="M3 8h10M9.5 4.5L13 8l-3.5 3.5" />
                            </svg>
                        </>
                    )}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--ink-50)' }}>
                Don&apos;t have an account?{' '}
                <button type="button" onClick={onSwitch}
                    style={{ color: 'var(--accent)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', textDecoration: 'none', fontSize: 13 }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>
                    Create Now
                </button>
            </p>
        </>
    )
}

/* ── Register form ───────────────────────────────── */
function RegisterForm({ onSwitch, onSuccess }: { onSwitch: () => void; onSuccess: () => void }) {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [terms, setTerms] = useState(false)
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; terms?: string }>({})
    const [loading, setLoading] = useState(false)

    function validate() {
        const e: typeof errors = {}
        if (!firstName.trim()) e.name = 'First name is required.'
        if (!isValidEmail(email)) e.email = 'Please enter a valid email.'
        if (password.length < 8) e.password = 'Password must be at least 8 characters.'
        if (!terms) e.terms = 'You must accept the Terms to continue.'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    async function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault()
        if (!validate()) return
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: `${firstName} ${lastName}`.trim(), email, password }),
            })
            const data = await res.json()
            if (!res.ok) {
                setErrors({ email: data.errors?.email?.[0] || data.message || 'Registration failed.' })
                return
            }
            localStorage.setItem('token', data.token)
            onSuccess()
        } catch {
            setErrors({ email: 'Something went wrong. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(22px, 2.5vw, 28px)', fontWeight: 500, letterSpacing: '-.03em', lineHeight: 1.2, marginBottom: 6, color: 'var(--ink)' }}>
                    Start your journey <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' }}>here</em>
                </h1>
                <p style={{ fontSize: 13.5, color: 'var(--ink-50)', lineHeight: 1.6 }}>Create your free account and plan your first trip in minutes.</p>
            </div>

            <SocialButtons variant="register" />
            <div className="auth-divider"><span>or with email</span></div>

            <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-2 sm:grid-cols-2" style={{ gap: 8, marginBottom: 0 }}>
                    <FormInput label="First name" id="reg-fname" placeholder="Ada"
                        value={firstName} onChange={(v) => { setFirstName(v); setErrors((p) => ({ ...p, name: undefined })) }}
                        error={errors.name} autoComplete="given-name" />
                    <FormInput label="Last name" id="reg-lname" placeholder="Lovelace"
                        value={lastName} onChange={setLastName} autoComplete="family-name" />
                </div>

                <FormInput label="Email address" id="reg-email" type="email" placeholder="you@example.com"
                    value={email} onChange={(v) => { setEmail(v); setErrors((p) => ({ ...p, email: undefined })) }}
                    error={errors.email} autoComplete="email" />

                <FormInput label="Password" id="reg-pw" type="password" placeholder="Min. 8 characters"
                    value={password} onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: undefined })) }}
                    error={errors.password} autoComplete="new-password">
                    <PasswordStrengthBar password={password} />
                </FormInput>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 16 }}>
                    <input type="checkbox" id="reg-terms" checked={terms}
                        onChange={(e) => { setTerms(e.target.checked); setErrors((p) => ({ ...p, terms: undefined })) }}
                        style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2, accentColor: 'var(--accent)', cursor: 'pointer' }} />
                    <div>
                        <label htmlFor="reg-terms" style={{ fontSize: 11.5, color: 'var(--ink-50)', fontWeight: 400, cursor: 'pointer' }}>
                            I agree to the{' '}
                            <a href="/terms" style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}
                                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>
                                Terms of Service
                            </a>
                            {' '}and{' '}
                            <a href="/privacy" style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}
                                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>
                                Privacy Policy
                            </a>
                        </label>
                        {errors.terms && (
                            <p style={{ fontSize: 11.5, color: 'var(--error)', marginTop: 3, fontWeight: 500 }}>{errors.terms}</p>
                        )}
                    </div>
                </div>

                <button type="submit" disabled={loading} className="auth-submit-btn"
                    style={{ width: '100%', padding: '15px 24px', background: 'var(--ink)', color: 'var(--bg)', border: 'none', borderRadius: 100, fontSize: 14, fontWeight: 600, fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '.01em', cursor: loading ? 'wait' : 'pointer', transition: 'all .3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? .7 : 1, pointerEvents: loading ? 'none' : 'auto' }}
                    onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(44,95,78,.15)' } }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                    {loading ? (
                        <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
                    ) : (
                        <>
                            <span>Create account</span>
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="auth-submit-arrow" style={{ width: 16, height: 16 }}>
                                <path d="M3 8h10M9.5 4.5L13 8l-3.5 3.5" />
                            </svg>
                        </>
                    )}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--ink-50)' }}>
                Already have an account?{' '}
                <button type="button" onClick={onSwitch}
                    style={{ color: 'var(--accent)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13 }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>
                    Sign in
                </button>
            </p>
        </>
    )
}

/* ── Success state ───────────────────────────────── */
function SuccessState() {
    return (
        <div style={{ textAlign: 'center', animation: 'fadeUp .5s ease both' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-bg)', border: '1px solid var(--accent-10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" style={{ width: 24, height: 24 }}>
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, letterSpacing: '-.03em', marginBottom: 8, color: 'var(--ink)' }}>
                Check your email!
            </h3>
            <p style={{ fontSize: 13.5, color: 'var(--ink-50)', lineHeight: 1.65, marginBottom: 12 }}>
                We sent a verification link to your inbox. Click it to activate your account.
            </p>
            <p style={{ fontSize: 12, color: 'var(--ink-25)', lineHeight: 1.5 }}>
                Redirecting to dashboard in a moment…
            </p>
        </div>
    )
}

/* ── Main page ───────────────────────────────────── */
export default function AuthPage() {
    const [panel, setPanel] = useState<Panel>('login')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!success) return
        const t = setTimeout(() => { window.location.href = '/dashboard' }, 3500)
        return () => clearTimeout(t)
    }, [success])

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

            <AuthLeft />

            {/* Right: form */}
            <div className="flex flex-col justify-center items-center relative min-h-screen pt-20 pb-10 lg:pt-10"
                style={{ paddingLeft: 'clamp(24px, 5vw, 80px)', paddingRight: 'clamp(24px, 5vw, 80px)' }}>

                {/* <Link href="/" className="absolute top-6 right-6 lg:top-8 lg:right-10" style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-50)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'color .25s', zIndex: 50 }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-50)')}>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ width: 14, height: 14 }}>
                        <path d="M10 3L5.5 8 10 13" />
                    </svg>
                    Back to home
                </Link> */}

                <div className="auth-wrap-inner" style={{ width: '100%', maxWidth: 420, animation: 'fadeUp .7s ease both' }}>

                    {success ? <SuccessState /> : (
                        <>
                            {/* Tab switcher */}
                            <div style={{ display: 'flex', gap: 0, marginBottom: 20, border: '1px solid var(--line-strong)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-warm)' }}>
                                {(['login', 'register'] as Panel[]).map((tab) => (
                                    <button key={tab} type="button" onClick={() => setPanel(tab)}
                                        style={{
                                            flex: 1, padding: '13px 20px', textAlign: 'center', fontSize: 13,
                                            fontWeight: 600, color: panel === tab ? 'var(--ink)' : 'var(--ink-50)',
                                            cursor: 'pointer', transition: 'all .25s', border: 'none',
                                            background: panel === tab ? 'var(--bg-card)' : 'none',
                                            fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '.01em',
                                            boxShadow: panel === tab ? '0 1px 6px rgba(17,17,16,.06)' : 'none',
                                            borderRadius: panel === tab ? 10 : 0,
                                            margin: panel === tab ? (tab === 'login' ? '3px 0 3px 3px' : '3px 3px 3px 0') : 0,
                                        }}>
                                        {tab === 'login' ? 'Sign in' : 'Create account'}
                                    </button>
                                ))}
                            </div>

                            {/* Form panel */}
                            <div className="panel-anim" key={panel}>
                                {panel === 'login'
                                    ? <LoginForm onSwitch={() => setPanel('register')} />
                                    : <RegisterForm onSwitch={() => setPanel('login')} onSuccess={() => setSuccess(true)} />
                                }
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
