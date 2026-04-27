'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────
type Panel = 'login' | 'register'

// ─── Helpers ──────────────────────────────────────────
function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

function getPasswordStrength(password: string) {
    if (!password) return { score: 0, label: '', color: '' }
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    const levels = [
        { label: 'Too short', color: '#E74C3C' },
        { label: 'Weak', color: '#E74C3C' },
        { label: 'Fair', color: '#E67E22' },
        { label: 'Good', color: '#B8956A' },
        { label: 'Strong', color: '#2C5F4E' },
    ]
    return { score, ...levels[score] }
}

// ─── Password Strength Bar ────────────────────────────
function PasswordStrengthBar({ password }: { password: string }) {
    const { score, label, color } = useMemo(() => getPasswordStrength(password), [password])
    if (!password) return null
    return (
        <div className="mt-1.5 mb-0.5">
            <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-[3px] flex-1 rounded-full transition-all duration-300"
                        style={{ backgroundColor: i <= score ? color : 'rgba(17,17,16,0.1)' }} />
                ))}
            </div>
            <span className="text-[10.5px] font-medium" style={{ color }}>{label}</span>
        </div>
    )
}

// ─── Form Input ───────────────────────────────────────
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
        <div className="flex flex-col gap-0.5">
            {label && (
                <label htmlFor={id} className="block text-[11px] font-semibold tracking-[.01em]"
                    style={{ color: 'rgba(17,17,16,.8)' }}>
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id={id} type={inputType} placeholder={placeholder}
                    value={value} onChange={(e) => onChange(e.target.value)}
                    autoComplete={autoComplete}
                    className="w-full text-[13px] rounded-[10px] outline-none transition-all duration-[250ms]"
                    style={{
                        padding: isPassword ? '8px 48px 8px 12px' : '8px 12px',
                        border: `1px solid ${error ? '#C0392B' : 'rgba(17,17,16,.12)'}`,
                        background: error ? 'rgba(192,57,43,.06)' : '#fff',
                        color: '#111110',
                        boxShadow: error ? '0 0 0 3px rgba(192,57,43,.08)' : 'none',
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                    onFocus={(e) => {
                        if (!error) {
                            e.target.style.borderColor = '#2C5F4E'
                            e.target.style.boxShadow = '0 0 0 3px rgba(44,95,78,.1)'
                        }
                    }}
                    onBlur={(e) => {
                        if (!error) {
                            e.target.style.borderColor = 'rgba(17,17,16,.12)'
                            e.target.style.boxShadow = 'none'
                        }
                    }}
                />
                {isPassword && (
                    <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 transition-colors duration-200"
                        style={{ color: 'rgba(17,17,16,.25)', background: 'none', border: 'none', cursor: 'pointer' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(17,17,16,.5)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(17,17,16,.25)')}
                        aria-label="Toggle password">
                        {showPw ? (
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4" strokeLinecap="round">
                                <path d="M2 2l12 12M6.5 6.7A3 3 0 0 0 9.3 9.5M4.6 4.7C2.8 5.9 1 8 1 8s2.5 5 7 5a7.1 7.1 0 0 0 3.4-.9M9 3.1A6.9 6.9 0 0 1 15 8s-.7 1.5-2 2.8" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4">
                                <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
                                <circle cx="8" cy="8" r="2.2" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
            {children}
            {error && (
                <div className="flex items-center gap-1 mt-1">
                    <svg viewBox="0 0 12 12" className="w-3 h-3 shrink-0" fill="#C0392B">
                        <circle cx="6" cy="6" r="6" opacity=".15" />
                        <path d="M6 3.5v3M6 8.5v.5" stroke="#C0392B" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                    </svg>
                    <span className="text-[11.5px] font-medium" style={{ color: '#C0392B' }}>{error}</span>
                </div>
            )}
        </div>
    )
}

// ─── Auth Button ──────────────────────────────────────
function AuthButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
    return (
        <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 font-semibold transition-all duration-300"
            style={{
                padding: '15px 24px',
                background: '#111110',
                color: '#FBFAF8',
                border: 'none',
                borderRadius: 100,
                fontSize: 14,
                letterSpacing: '.01em',
                cursor: loading ? 'wait' : 'pointer',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                opacity: loading ? .7 : 1,
            }}
            onMouseEnter={(e) => {
                if (!loading) {
                    e.currentTarget.style.background = '#2C5F4E'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 8px 28px rgba(44,95,78,.15)'
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = '#111110'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
            }}>
            {loading
                ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" style={{ animation: 'spin .7s linear infinite' }} />
                : children}
        </button>
    )
}

// ─── Left Panel ───────────────────────────────────────
function AuthLeft() {
    return (
        <div className="relative hidden lg:flex flex-col justify-between sticky top-0 h-screen overflow-hidden"
            style={{ background: '#111110', padding: '48px 56px' }}>

            {/* Noise grain */}
            <div className="absolute inset-0 pointer-events-none z-0" style={{
                opacity: .4,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E")`,
            }} />

            {/* Green orb */}
            <div className="absolute pointer-events-none z-0 rounded-full" style={{
                width: 640, height: 640,
                background: 'radial-gradient(circle, rgba(44,95,78,.35) 0%, transparent 70%)',
                bottom: -180, right: -120,
            }} />

            <div className="relative z-10 flex flex-col h-full">

                {/* Logo */}
                <Link href="/" style={{
                    fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500,
                    color: 'rgba(255,255,255,.9)', textDecoration: 'none', letterSpacing: '-.03em',
                }}>
                    Kurma<em style={{ fontStyle: 'italic', color: 'rgba(44,150,100,.85)', fontWeight: 300 }}>.Guide</em>
                </Link>

                {/* Body */}
                <div className="flex-1 flex flex-col justify-start" style={{ padding: '20px 0 40px', marginTop: 20 }}>

                    {/* Live badge */}
                    <div className="inline-flex items-center gap-2 w-fit mb-8" style={{
                        padding: '6px 14px 6px 8px',
                        background: 'rgba(255,255,255,.06)',
                        border: '1px solid rgba(255,255,255,.1)',
                        borderRadius: 100,
                    }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#38795F', animation: 'pulse-dot 2s infinite' }} />
                        <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,.4)', letterSpacing: '.05em' }}>
                            NOW IN BETA
                        </span>
                    </div>

                    {/* Heading */}
                    <h2 style={{
                        fontFamily: 'Fraunces, serif',
                        fontSize: 'clamp(28px, 3vw, 40px)',
                        fontWeight: 500,
                        lineHeight: 1.12,
                        letterSpacing: '-.04em',
                        color: 'rgba(255,255,255,.9)',
                        marginBottom: 20,
                    }}>
                        Plan your trip<br />
                        <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'rgba(44,150,100,.8)' }}>smarter</em>, not harder.
                    </h2>

                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,.35)', lineHeight: 1.75, maxWidth: 380 }}>
                        Kurma helps you craft personalized itineraries in minutes — so you can spend less time planning and more time exploring.
                    </p>
                </div>

                {/* Testimonial */}
                <div style={{
                    background: 'rgba(255,255,255,.04)',
                    border: '1px solid rgba(255,255,255,.08)',
                    borderRadius: 16,
                    padding: '24px 28px',
                    marginBottom: 10,
                    animation: 'fadeUp .9s ease .3s both',
                }}>
                    <p style={{ fontFamily: 'Fraunces, serif', fontSize: 15, fontWeight: 300, fontStyle: 'italic', color: 'rgba(255,255,255,.6)', lineHeight: 1.65, marginBottom: 16 }}>
                        <span style={{ display: 'block', fontSize: 22, fontStyle: 'normal', color: '#38795F', lineHeight: 1, marginBottom: 4 }}>&ldquo;</span>
                        Planned a 10-day Japan trip in under an hour. The suggestions felt like they came from a local.
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                            style={{ background: 'linear-gradient(135deg, #2C5F4E, rgba(184,149,106,.6))', color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            SA
                        </div>
                        <div>
                            <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.55)' }}>Sarah A.</p>
                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,.25)' }}>Solo traveler · 12 trips planned</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

// ─── Login Form ───────────────────────────────────────
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-[10px]" noValidate>

            <FormInput label="Email" id="login-email" type="email" placeholder="you@example.com"
                value={email} onChange={(v) => { setEmail(v); setErrors((p) => ({ ...p, email: undefined })) }}
                error={errors.email} autoComplete="email" />

            <div>
                <div className="flex items-center justify-between mb-[3px]">
                    <label htmlFor="login-pw" className="text-[11px] font-semibold" style={{ color: 'rgba(17,17,16,.8)', letterSpacing: '.01em' }}>
                        Password
                    </label>
                    <Link href="/forgot-password" className="text-[12px] font-medium transition-colors duration-250"
                        style={{ color: 'rgba(17,17,16,.5)', textDecoration: 'none' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#2C5F4E')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(17,17,16,.5)')}>
                        Forgot password?
                    </Link>
                </div>
                <FormInput label="" id="login-pw" type="password" placeholder="••••••••"
                    value={password} onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: undefined })) }}
                    error={errors.password} autoComplete="current-password" />
            </div>

            <div className="mt-2">
                <AuthButton loading={loading}>
                    <span>Sign in</span>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                        <path d="M3 8h10M9.5 4.5L13 8l-3.5 3.5" />
                    </svg>
                </AuthButton>
            </div>

            <p className="text-center mt-6 text-[13px]" style={{ color: 'rgba(17,17,16,.5)' }}>
                Don&apos;t have an account?{' '}
                <button type="button" onClick={onSwitch} className="font-semibold"
                    style={{ color: '#2C5F4E', background: 'none', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>
                    Create account
                </button>
            </p>
        </form>
    )
}

// ─── Register Form ────────────────────────────────────
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-[10px]" noValidate>

            <div className="grid grid-cols-2 gap-2">
                <FormInput label="First name" id="reg-fname" placeholder="John"
                    value={firstName} onChange={(v) => { setFirstName(v); setErrors((p) => ({ ...p, name: undefined })) }}
                    error={errors.name} autoComplete="given-name" />
                <FormInput label="Last name" id="reg-lname" placeholder="Doe"
                    value={lastName} onChange={setLastName} autoComplete="family-name" />
            </div>

            <FormInput label="Email" id="reg-email" type="email" placeholder="you@example.com"
                value={email} onChange={(v) => { setEmail(v); setErrors((p) => ({ ...p, email: undefined })) }}
                error={errors.email} autoComplete="email" />

            <FormInput label="Password" id="reg-pw" type="password" placeholder="••••••••"
                value={password} onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: undefined })) }}
                error={errors.password} autoComplete="new-password">
                <PasswordStrengthBar password={password} />
            </FormInput>

            <div className="flex items-start gap-2 mt-1 mb-1">
                <input type="checkbox" id="reg-terms" checked={terms}
                    onChange={(e) => { setTerms(e.target.checked); setErrors((p) => ({ ...p, terms: undefined })) }}
                    className="mt-0.5 w-4 h-4 shrink-0 cursor-pointer" style={{ accentColor: '#2C5F4E' }} />
                <div>
                    <label htmlFor="reg-terms" className="cursor-pointer" style={{ fontSize: 11.5, color: 'rgba(17,17,16,.5)', fontWeight: 400 }}>
                        I agree to the{' '}
                        <a href="/terms" style={{ color: '#2C5F4E', fontWeight: 500, textDecoration: 'none' }}
                            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>
                            Terms of Service
                        </a>
                        {' '}and{' '}
                        <a href="/privacy" style={{ color: '#2C5F4E', fontWeight: 500, textDecoration: 'none' }}
                            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>
                            Privacy Policy
                        </a>
                    </label>
                    {errors.terms && <p className="text-[11px] mt-0.5" style={{ color: '#C0392B' }}>{errors.terms}</p>}
                </div>
            </div>

            <AuthButton loading={loading}>
                <span>Create account</span>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                    <path d="M3 8h10M9.5 4.5L13 8l-3.5 3.5" />
                </svg>
            </AuthButton>

            <p className="text-center mt-6 text-[13px]" style={{ color: 'rgba(17,17,16,.5)' }}>
                Already have an account?{' '}
                <button type="button" onClick={onSwitch} className="font-semibold"
                    style={{ color: '#2C5F4E', background: 'none', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>
                    Sign in
                </button>
            </p>
        </form>
    )
}

// ─── Success State ────────────────────────────────────
function SuccessState() {
    return (
        <div className="text-center" style={{ animation: 'fadeUp .5s ease both' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(44,95,78,.05)', border: '1px solid rgba(44,95,78,.1)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#2C5F4E" strokeWidth="2" strokeLinecap="round" className="w-6 h-6">
                    <path d="M20 6L9 17l-5-5" />
                </svg>
            </div>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, letterSpacing: '-.03em', marginBottom: 8, color: '#111110' }}>
                You&apos;re in! Welcome to Kurma.
            </h3>
            <p style={{ fontSize: 13.5, color: 'rgba(17,17,16,.5)', lineHeight: 1.65 }}>
                Your account is ready. Redirecting you to the dashboard to start planning your first trip…
            </p>
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────
export default function AuthPage() {
    const [panel, setPanel] = useState<Panel>('login')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!success) return
        const t = setTimeout(() => { window.location.href = '/dashboard' }, 1500)
        return () => clearTimeout(t)
    }, [success])

    const headings: Record<Panel, { title: string; sub: string }> = {
        login: { title: 'Welcome back.', sub: 'Sign in to continue planning your next adventure.' },
        register: { title: 'Join Kurma.', sub: 'Create your free account and start planning smarter.' },
    }

    return (
        <>
            <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .auth-wrap { animation: fadeUp .7s ease both; }
        .panel-anim { animation: fadeUp .4s ease both; }
      `}</style>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh', background: '#FBFAF8' }}
                className="max-lg:block">

                {/* Left */}
                <AuthLeft />

                {/* Right */}
                <div className="flex flex-col justify-center items-center relative"
                    style={{ padding: '40px clamp(32px, 6vw, 80px)', minHeight: '100vh' }}>

                    {/* Back to home */}
                    <Link href="/" className="absolute flex items-center gap-1.5 transition-colors duration-200"
                        style={{ top: 32, right: 40, fontSize: 12, fontWeight: 500, color: 'rgba(17,17,16,.5)', textDecoration: 'none', zIndex: 50 }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#111110')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(17,17,16,.5)')}>
                        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-3.5 h-3.5" strokeLinecap="round">
                            <path d="M9 2L4 7l5 5" />
                        </svg>
                        Back to home
                    </Link>

                    <div className="auth-wrap w-full" style={{ maxWidth: 420 }}>

                        {success ? <SuccessState /> : (
                            <>
                                {/* Tabs */}
                                <div className="flex mb-5" style={{
                                    border: '1px solid rgba(17,17,16,.12)', borderRadius: 12,
                                    overflow: 'hidden', background: '#F5F3EE',
                                }}>
                                    {(['login', 'register'] as Panel[]).map((tab) => (
                                        <button key={tab} onClick={() => setPanel(tab)}
                                            className="flex-1 font-semibold transition-all duration-[250ms]"
                                            style={{
                                                padding: '13px 20px',
                                                fontSize: 13,
                                                letterSpacing: '.01em',
                                                background: panel === tab ? '#fff' : 'transparent',
                                                color: panel === tab ? '#111110' : 'rgba(17,17,16,.5)',
                                                border: 'none',
                                                cursor: 'pointer',
                                                boxShadow: panel === tab ? '0 1px 6px rgba(17,17,16,.06)' : 'none',
                                                borderRadius: panel === tab ? 10 : 0,
                                                margin: panel === tab ? 3 : 0,
                                                fontFamily: 'Plus Jakarta Sans, sans-serif',
                                            }}>
                                            {tab === 'login' ? 'Sign in' : 'Create account'}
                                        </button>
                                    ))}
                                </div>

                                {/* Heading */}
                                <div className="mb-5">
                                    <h1 style={{
                                        fontFamily: 'Fraunces, serif',
                                        fontSize: 'clamp(22px, 2.5vw, 28px)',
                                        fontWeight: 500,
                                        letterSpacing: '-.03em',
                                        lineHeight: 1.2,
                                        marginBottom: 6,
                                        color: '#111110',
                                    }}>
                                        {headings[panel].title}
                                    </h1>
                                    <p style={{ fontSize: 13.5, color: 'rgba(17,17,16,.5)', lineHeight: 1.6 }}>
                                        {headings[panel].sub}
                                    </p>
                                </div>

                                {/* Form */}
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
        </>
    )
}