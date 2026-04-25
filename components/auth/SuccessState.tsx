import React from 'react'

export default function SuccessState() {
    return (
        <div className="flex flex-col items-center text-center gap-5 py-8 animate-fade-up">
            {/* Check icon */}
            <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(44,95,78,.1)' }}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="#2C5F4E" strokeWidth="2" strokeLinecap="round" className="w-8 h-8">
                    <path d="M20 6L9 17l-5-5" />
                </svg>
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="font-serif font-medium text-2xl tracking-tight" style={{ color: 'var(--ink)' }}>
                    You&apos;re in! Welcome to Kurma.
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-50)' }}>
                    Your account is ready. Redirecting you to the dashboard to start planning your first trip…
                </p>
            </div>

            {/* Loading dots */}
            <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                            background: '#2C5F4E',
                            animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }}
                    />
                ))}
            </div>
        </div>
    )
}