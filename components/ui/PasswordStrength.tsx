'use client'

import React, { useMemo } from 'react'

interface PasswordStrengthProps {
    password: string
}

function getStrength(password: string) {
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

export default function PasswordStrength({ password }: PasswordStrengthProps) {
    const { score, label, barClass, color } = useMemo(() => getStrength(password), [password])

    return (
        <div className={`pw-strength ${password ? 'show' : ''}`}>
            <div className="pw-bars">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`pw-bar ${i <= score ? barClass : ''}`} />
                ))}
            </div>
            <span className="pw-label" style={{ color: color || 'var(--ink-25)' }}>
                {label || 'Enter a password'}
            </span>
        </div>
    )
}
