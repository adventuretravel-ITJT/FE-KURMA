'use client'

import React, { useState } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    hint?: string
    rightElement?: React.ReactNode
}

export default function Inpur({
    label,
    error,
    hint,
    rightElement,
    className = '',
    type = 'text',
    ...props
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className='text-xs font-medium text-[var(--ink-50)] tracking-wide uppercase'>
                    {label}
                </label>
            )}

            <div className="relative">
                <input type="{inputType}" className={`
                        w-full h-11 px-4 rounded-xl
                        bg-[var(--ink-05)] border border-[var(--line-strong)]
                        text-[var(--ink)] text-sm
                        placeholder:text-[var(--ink-25)]
                        outline-none
                        transition-all duration-150
                        focus:border-[#2C5F4E] focus:bg-white focus:ring-2 focus:ring-[rgba(44,95,78,0.12)]
                        ${error ? 'border-[var(--error)] bg-[var(--error-bg)] focus:ring-[rgba(192,57,43,0.12)]' : ''}
                        ${isPassword || rightElement ? 'pr-11' : ''}
                        ${className}
                    `}
                    {...props}
                />
                {/* Password toggle */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-25)] hover:text-[var(--ink-50)] transition-colors"
                        aria-label="Toggle password visibility"
                    >
                        {showPassword ? (
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4">
                                <path d="M2 2l12 12M6.5 6.7A3 3 0 0 0 9.3 9.5M4.6 4.7C2.8 5.9 1 8 1 8s2.5 5 7 5a7.1 7.1 0 0 0 3.4-.9M9 3.1A6.9 6.9 0 0 1 15 8s-.7 1.5-2 2.8" strokeLinecap="round" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4">
                                <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
                                <circle cx="8" cy="8" r="2.2" />
                            </svg>
                        )}
                    </button>
                )}

                {/* Right element (non-password) */}
                {rightElement && !isPassword && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {rightElement}
                    </div>
                )}
            </div>

            {/* Error message */}
            {error && (
                <div className="flex items-center gap-1.5 text-[var(--error)] text-xs">
                    <svg viewBox="0 0 12 12" className="w-3 h-3 shrink-0" fill="currentColor">
                        <circle cx="6" cy="6" r="6" opacity=".15" />
                        <path d="M6 3.5v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                    </svg>
                    {error}
                </div>
            )}

            {/* Hint */}
            {hint && !error && (
                <p className="text-xs text-[var(--ink-25)]">{hint}</p>
            )}
        </div>
    )
}