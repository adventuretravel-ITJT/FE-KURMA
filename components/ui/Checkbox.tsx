'use client'

import React from 'react'

interface CheckboxProps {
    id?: string
    label?: React.ReactNode
    checked?: boolean
    onChange?: (checked: boolean) => void
    error?: string
}

export default function Checkbox({ id, label, checked, onChange, error }: CheckboxProps) {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={(e) => onChange?.(e.target.checked)}
                    style={{
                        width: 16, height: 16, flexShrink: 0, marginTop: 2,
                        accentColor: 'var(--accent)', cursor: 'pointer',
                    }}
                />
                <label htmlFor={id} style={{
                    fontSize: 11.5, color: 'var(--ink-50)',
                    fontWeight: 400, cursor: 'pointer', lineHeight: 1.65,
                }}>
                    {label}
                </label>
            </div>
            {error && (
                <p style={{ fontSize: 11.5, color: 'var(--error)', marginTop: 4, fontWeight: 500 }}>
                    {error}
                </p>
            )}
        </div>
    )
}
