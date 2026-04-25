import { exportTraceState } from "next/dist/trace";
import React from "react";

type ButtonVariant = 'primary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    size?: ButtonSize
    loading?: boolean
    children?: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: `
    bg-[#2C5F4E] text-white border border-[#2C5F4E]
    hover:bg-[#38795F] hover:border-[#38795F]
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
    outline: `
    bg-transparent text-[#2C5F4E] border border-[#2C5F4E]
    hover:bg-[rgba(44,95,78,0.05)]
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
    ghost: `
    bg-transparent text-[var(--ink-50)] border border-transparent
    hover:text-[var(--ink)] hover:bg-[var(--ink-05)]
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
}

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-5 text-md gap-2',
}

export default function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    children,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`
        relative inline-flex items-center justify-center
        rounded-xl font-medium
        transition-all duration-200
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${loading ? 'cursor-wait' : ''}
        ${className}
      `}
            disabled={disabled || loading}
            {...props}
        >
            {/* Spinner */}
            {loading && (
                <span
                    className="absolute inset-0 flex items-center justify-center"
                    aria-hidden="true"
                >
                    <svg
                        className="animate-spin h-4 w-4"
                        style={{ animation: 'spin 0.7s linear infinite' }}
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle
                            className="opacity-25"
                            cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="3"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                    </svg>
                </span>
            )}

            {/* Content */}
            <span className={`inline-flex items-center gap-2 transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}>
                {children}
            </span>
        </button>
    )
}