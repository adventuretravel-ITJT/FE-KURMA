'use client'

import { useState, useMemo } from 'react'
import { useUser } from '@/src/contexts/UserContext'

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

function PasswordField({
    label, id, placeholder, value, onChange, error, autoComplete,
}: {
    label: string; id: string; placeholder?: string
    value: string; onChange: (v: string) => void
    error?: string; autoComplete?: string
}) {
    const [show, setShow] = useState(false)

    return (
        <div style={{ marginBottom: 14 }}>
            <label htmlFor={id} style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--ink-80)', marginBottom: 4, letterSpacing: '.01em' }}>
                {label}
            </label>
            <div style={{ position: 'relative' }}>
                <input
                    id={id} type={show ? 'text' : 'password'} placeholder={placeholder}
                    value={value} onChange={(e) => onChange(e.target.value)}
                    autoComplete={autoComplete}
                    style={{
                        width: '100%', padding: '9px 44px 9px 12px',
                        border: `1px solid ${error ? 'var(--error)' : 'var(--line-strong)'}`,
                        borderRadius: 10, background: 'var(--bg)',
                        color: 'var(--ink)', fontSize: 13, outline: 'none',
                        fontFamily: 'var(--font-plus-jakarta-sans)',
                        transition: 'border-color .2s, box-shadow .2s',
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
                <button
                    type="button" onClick={() => setShow(!show)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-25)', padding: 4, display: 'flex', alignItems: 'center' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink-50)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-25)')}
                    aria-label={show ? 'Hide' : 'Show'}>
                    {show ? (
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ width: 15, height: 15 }} strokeLinecap="round">
                            <path d="M2 2l12 12M6.5 6.7A3 3 0 0 0 9.3 9.5M4.6 4.7C2.8 5.9 1 8 1 8s2.5 5 7 5a7.1 7.1 0 0 0 3.4-.9M9 3.1A6.9 6.9 0 0 1 15 8s-.7 1.5-2 2.8" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ width: 15, height: 15 }}>
                            <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
                            <circle cx="8" cy="8" r="2.2" />
                        </svg>
                    )}
                </button>
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

export default function SettingsPage() {
    const { user, onLogout, onToggleSidebar } = useUser()

    const [current, setCurrent]   = useState('')
    const [newPw, setNewPw]       = useState('')
    const [confirm, setConfirm]   = useState('')
    const [errors, setErrors]     = useState<{ current?: string; newPw?: string; confirm?: string }>({})
    const [loading, setLoading]   = useState(false)
    const [done, setDone]         = useState(false)

    const strength = useMemo(() => getPasswordStrength(newPw), [newPw])
    const initials = user.name.slice(0, 2).toUpperCase()

    function validate() {
        const e: typeof errors = {}
        if (!current) e.current = 'Please enter your current password.'
        if (newPw.length < 8) e.newPw = 'New password must be at least 8 characters.'
        if (newPw === current && current) e.newPw = 'New password must be different from current.'
        if (newPw !== confirm) e.confirm = 'Passwords do not match.'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    async function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault()
        if (!validate()) return
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token ?? ''}`,
                },
                body: JSON.stringify({
                    current_password:     current,
                    new_password:         newPw,
                    new_password_confirm: confirm,
                }),
            })
            const data = await res.json()
            if (!res.ok) {
                const msg: string = data.message || ''
                if (msg.includes('lama') || msg.toLowerCase().includes('current')) {
                    setErrors({ current: 'Current password is incorrect.' })
                } else {
                    setErrors({ current: msg || 'Failed to change password.' })
                }
                return
            }
            // Token is invalidated by backend — clear it and redirect to login
            setDone(true)
            localStorage.removeItem('token')
            setTimeout(() => { window.location.href = '/auth' }, 3000)
        } catch {
            setErrors({ current: 'Something went wrong. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    const cardStyle: React.CSSProperties = {
        background: 'var(--bg-card)',
        border: '1px solid var(--line-strong)',
        borderRadius: 16,
        padding: '28px 28px',
    }

    return (
        <>
            {/* Topbar */}
            <div className="dash-topbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                        onClick={onToggleSidebar}
                        aria-label="Open menu"
                        style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--line-strong)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-50)', flexShrink: 0 }}>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{ width: 15, height: 15 }}>
                            <path d="M2 4h12M2 8h12M2 12h12" />
                        </svg>
                    </button>
                    <h1 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 18, fontWeight: 500, letterSpacing: '-.03em', color: 'var(--ink)' }}>
                        Settings
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="dash-content" style={{ maxWidth: 560, padding: '24px 10px'}}>

                {/* Profile card */}
                <div style={cardStyle}>
                    <p style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--ink-25)', marginBottom: 16 }}>
                        Account
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--warm-10)', border: '1.5px solid rgba(184,149,106,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: 'var(--warm)', flexShrink: 0 }}>
                            {initials}
                        </div>
                        <div>
                            <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)' }}>{user.name}</div>
                            <div style={{ fontSize: 12.5, color: 'var(--ink-50)', marginTop: 1 }}>{user.email}</div>
                        </div>
                        <div style={{ marginLeft: 'auto', padding: '4px 10px', background: 'var(--accent-bg)', border: '1px solid var(--accent-10)', borderRadius: 100, fontSize: 11, fontWeight: 600, color: 'var(--accent)', letterSpacing: '.02em' }}>
                            {user.role?.name ?? 'User'}
                        </div>
                    </div>
                </div>

                {/* Change password card */}
                <div style={{ ...cardStyle, marginTop: 16 }}>
                    <p style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--ink-25)', marginBottom: 16 }}>
                        Change Password
                    </p>

                    {done ? (
                        <div style={{ textAlign: 'center', padding: '12px 0', animation: 'fadeUp .4s ease both' }}>
                            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--accent-bg)', border: '1px solid var(--accent-10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" style={{ width: 22, height: 22 }}>
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                            </div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>Password changed!</p>
                            <p style={{ fontSize: 13, color: 'var(--ink-50)' }}>Redirecting to sign in…</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate>
                            <PasswordField
                                label="Current password" id="cp-current" placeholder="Your current password"
                                value={current} onChange={(v) => { setCurrent(v); setErrors((p) => ({ ...p, current: undefined })) }}
                                error={errors.current} autoComplete="current-password"
                            />

                            <div style={{ marginBottom: 0 }}>
                                <PasswordField
                                    label="New password" id="cp-new" placeholder="Min. 8 characters"
                                    value={newPw} onChange={(v) => { setNewPw(v); setErrors((p) => ({ ...p, newPw: undefined })) }}
                                    error={errors.newPw} autoComplete="new-password"
                                />
                                {newPw && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: -6, marginBottom: 14 }}>
                                        <div style={{ display: 'flex', gap: 3, flex: 1 }}>
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} style={{
                                                    flex: 1, height: 3, borderRadius: 2,
                                                    background: i <= strength.score ? strength.color || 'var(--line-strong)' : 'var(--line-strong)',
                                                    transition: 'background .25s',
                                                }} />
                                            ))}
                                        </div>
                                        <span style={{ fontSize: 11, fontWeight: 500, color: strength.color || 'var(--ink-25)', whiteSpace: 'nowrap' }}>
                                            {strength.label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <PasswordField
                                label="Confirm new password" id="cp-confirm" placeholder="Repeat new password"
                                value={confirm} onChange={(v) => { setConfirm(v); setErrors((p) => ({ ...p, confirm: undefined })) }}
                                error={errors.confirm} autoComplete="new-password"
                            />

                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                                <button type="submit" disabled={loading}
                                    style={{
                                        padding: '10px 24px', background: 'var(--ink)',
                                        color: 'var(--bg)', border: 'none', borderRadius: 100,
                                        fontSize: 13.5, fontWeight: 600, fontFamily: 'var(--font-plus-jakarta-sans)',
                                        cursor: loading ? 'wait' : 'pointer', transition: 'all .25s',
                                        display: 'flex', alignItems: 'center', gap: 7,
                                        opacity: loading ? .7 : 1,
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!loading) {
                                            e.currentTarget.style.background = 'var(--accent)'
                                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(44,95,78,.15)'
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'var(--ink)'
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}>
                                    {loading ? (
                                        <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
                                    ) : (
                                        <>
                                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 14, height: 14 }} strokeLinecap="round">
                                                <rect x="3" y="8" width="10" height="6" rx="1.5" />
                                                <path d="M5.5 8V5.5a2.5 2.5 0 015 0V8" />
                                            </svg>
                                            Update password
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setCurrent(''); setNewPw(''); setConfirm(''); setErrors({}) }}
                                    style={{ padding: '10px 16px', background: 'none', border: '1px solid var(--line-strong)', borderRadius: 100, fontSize: 13, fontWeight: 500, color: 'var(--ink-50)', cursor: 'pointer', fontFamily: 'var(--font-plus-jakarta-sans)', transition: 'all .2s' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ink-25)'; e.currentTarget.style.color = 'var(--ink)' }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-50)' }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Danger zone */}
                <div style={{ ...cardStyle, marginTop: 16, borderColor: 'rgba(192,57,43,.15)' }}>
                    <p style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--error)', opacity: .6, marginBottom: 12 }}>
                        Danger Zone
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                            <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>Sign out</p>
                            <p style={{ fontSize: 12.5, color: 'var(--ink-50)' }}>End your current session on this device.</p>
                        </div>
                        <button
                            onClick={onLogout}
                            style={{ padding: '8px 18px', background: 'none', border: '1px solid rgba(192,57,43,.3)', borderRadius: 100, fontSize: 13, fontWeight: 600, color: 'var(--error)', cursor: 'pointer', fontFamily: 'var(--font-plus-jakarta-sans)', transition: 'all .2s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(192,57,43,.06)'; e.currentTarget.style.borderColor = 'var(--error)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'rgba(192,57,43,.3)' }}>
                            Sign out
                        </button>
                    </div>
                </div>

            </div>
        </>
    )
}
