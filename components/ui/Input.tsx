'use client'

import React, { useState } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    hint?: string
    rightElement?: React.ReactNode
}

export default function Input({
    label,
    error,
    hint,
    rightElement,
    type = 'text',
    id,
    onFocus,
    onBlur,
    ...props
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
        <div className="form-group" style={{ marginBottom: 10 }}>
            {label && (
                <label htmlFor={id} style={{
                    display: 'block', fontSize: 11, fontWeight: 600,
                    color: 'var(--ink-80)', marginBottom: 3, letterSpacing: '.01em',
                }}>
                    {label}
                </label>
            )}
            <div style={{ position: 'relative' }}>
                <input
                    id={id}
                    type={inputType}
                    style={{
                        width: '100%',
                        padding: (isPassword || rightElement) ? '8px 48px 8px 12px' : '8px 12px',
                        border: `1px solid ${error ? 'var(--error)' : 'var(--line-strong)'}`,
                        borderRadius: 10,
                        background: error ? 'var(--error-bg)' : 'var(--bg-card)',
                        color: 'var(--ink)',
                        fontSize: 13,
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontWeight: 400,
                        outline: 'none',
                        boxShadow: error ? '0 0 0 3px rgba(192,57,43,.08)' : 'none',
                        transition: 'border-color .25s, box-shadow .25s, background .25s',
                        WebkitAppearance: 'none',
                    }}
                    onFocus={(e) => {
                        if (!error) {
                            e.target.style.borderColor = 'var(--accent)'
                            e.target.style.boxShadow = '0 0 0 3px var(--accent-10)'
                        }
                        onFocus?.(e)
                    }}
                    onBlur={(e) => {
                        if (!error) {
                            e.target.style.borderColor = 'var(--line-strong)'
                            e.target.style.boxShadow = 'none'
                        }
                        onBlur?.(e)
                    }}
                    {...props}
                />

                {isPassword && (
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-25)', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color .2s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink-50)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-25)')}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        {showPassword ? (
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

                {rightElement && !isPassword && (
                    <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}>
                        {rightElement}
                    </div>
                )}
            </div>

            {/* Animated error — always in DOM so CSS transition works */}
            <div className={`form-error ${error ? 'show' : ''}`}>
                <svg viewBox="0 0 12 12" style={{ width: 12, height: 12, flexShrink: 0 }}>
                    <circle cx="6" cy="6" r="6" fill="var(--error)" opacity=".15" />
                    <path d="M6 3.5v3M6 8.5v.5" stroke="var(--error)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                </svg>
                {error}
            </div>

            {hint && !error && (
                <p style={{ fontSize: 11.5, color: 'var(--ink-25)', marginTop: 4 }}>{hint}</p>
            )}
        </div>
    )
}
