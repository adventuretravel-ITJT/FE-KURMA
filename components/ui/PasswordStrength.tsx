'use client'

import React, { useMemo } from 'react'

interface PasswordStrengthProps {
    password: string
}

function getStrength(password: string) {
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

export default function PasswordStrength({ password }: PasswordStrengthProps) {
    const { score, label, color } = useMemo(() => getStrength(password), [password])

    if (!password) return null

    return (
        <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                            backgroundColor: i <= score ? color : 'var(--ink-10)',
                        }}
                    />
                ))}
            </div>
            {label && (
                <span className="text-xs font-medium transition-colors" style={{ color }}>
                    {label}
                </span>
            )}
        </div>
    )
}