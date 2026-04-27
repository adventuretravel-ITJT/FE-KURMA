'use client'

import React from 'react'

type ButtonVariant = 'primary' | 'social' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    size?: ButtonSize
    loading?: boolean
    children?: React.ReactNode
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
        background: 'var(--ink)',
        color: 'var(--bg)',
        border: 'none',
        borderRadius: 100,
        letterSpacing: '.01em',
    },
    social: {
        background: 'var(--bg-card)',
        color: 'var(--ink)',
        border: '1px solid var(--line-strong)',
        borderRadius: 10,
    },
    outline: {
        background: 'transparent',
        color: 'var(--accent)',
        border: '1px solid var(--accent)',
        borderRadius: 10,
    },
    ghost: {
        background: 'transparent',
        color: 'var(--ink-50)',
        border: '1px solid transparent',
        borderRadius: 10,
    },
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
    sm: { padding: '8px 16px',  fontSize: 12.5, gap: 6 },
    md: { padding: '12px 20px', fontSize: 13,   gap: 8 },
    lg: { padding: '15px 24px', fontSize: 14,   gap: 8 },
}

export default function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    children,
    className = '',
    disabled,
    style,
    ...props
}: ButtonProps) {
    const isDisabled = disabled || loading

    const baseStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontWeight: 600,
        cursor: loading ? 'wait' : disabled ? 'not-allowed' : 'pointer',
        transition: 'all .25s',
        outline: 'none',
        opacity: disabled && !loading ? .5 : 1,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
    }

    return (
        <button
            disabled={isDisabled}
            className={`btn-social ${className}`}
            style={baseStyle}
            {...props}
        >
            {loading ? (
                <div style={{
                    width: 16, height: 16,
                    border: '2px solid rgba(255,255,255,.3)',
                    borderTopColor: variant === 'primary' ? 'white' : 'var(--ink)',
                    borderRadius: '50%',
                    animation: 'spin .7s linear infinite',
                }} />
            ) : children}
        </button>
    )
}
