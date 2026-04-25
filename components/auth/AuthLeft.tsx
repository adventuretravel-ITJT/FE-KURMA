import React from 'react'
import Link from 'next/link'

export default function AuthLeft() {
    return (
        <div
            className="relative hidden lg:flex flex-col justify-between sticky top-0 h-screen overflow-hidden px-14 py-12"
            style={{ background: 'var(--ink)' }}
        >
            {/* Noise grain overlay */}
            <div
                className="absolute inset-0 opacity-40 pointer-events-none z-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Green orb */}
            <div
                className="absolute pointer-events-none z-0 rounded-full"
                style={{
                    width: 640,
                    height: 640,
                    background: 'radial-gradient(circle, rgba(44,95,78,.35) 0%, transparent 70%)',
                    bottom: -180,
                    right: -120,
                }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">

                {/* Logo */}
                <Link href="/" className="font-serif text-xl font-medium tracking-tight no-underline" style={{ color: 'rgba(255,255,255,.9)' }}>
                    Kurma<em className="not-italic font-light" style={{ color: 'rgba(44,150,100,.85)' }}>.Guide</em>
                </Link>

                {/* Body */}
                <div className="flex-1 flex flex-col justify-start pt-8 pb-10 mt-5">

                    {/* Live badge */}
                    <div
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-8 w-fit"
                        style={{
                            background: 'rgba(255,255,255,.06)',
                            border: '1px solid rgba(255,255,255,.1)',
                        }}
                    >
                        <span
                            className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
                            style={{ background: '#38795F' }}
                        />
                        <span className="text-[11px] font-medium tracking-widest uppercase" style={{ color: 'rgba(255,255,255,.4)' }}>
                            Now in beta
                        </span>
                    </div>

                    {/* Heading */}
                    <h2
                        className="font-serif font-medium leading-tight tracking-tight mb-5"
                        style={{
                            fontSize: 'clamp(28px, 3vw, 40px)',
                            color: 'rgba(255,255,255,.9)',
                            letterSpacing: '-.04em',
                        }}
                    >
                        Plan your trip<br />
                        <em className="not-italic font-light" style={{ color: 'rgba(44,150,100,.8)' }}>smarter</em>, not harder.
                    </h2>

                    <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'rgba(255,255,255,.35)' }}>
                        Kurma helps you craft personalized itineraries in minutes — so you can spend less time planning and more time exploring.
                    </p>
                </div>

                {/* Testimonial */}
                <div
                    className="rounded-2xl p-7 animate-fade-up mb-2.5"
                    style={{
                        background: 'rgba(255,255,255,.04)',
                        border: '1px solid rgba(255,255,255,.08)',
                    }}
                >
                    <p
                        className="font-serif font-light italic text-[15px] leading-relaxed mb-4"
                        style={{ color: 'rgba(255,255,255,.6)' }}
                    >
                        <span className="block text-2xl not-italic mb-1" style={{ color: '#38795F' }}>&ldquo;</span>
                        Planned a 10-day Japan trip in under an hour. The suggestions felt like they came from a local.
                    </p>
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                            style={{ background: 'rgba(44,95,78,.4)', color: '#38795F' }}
                        >
                            SA
                        </div>
                        <div>
                            <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,.6)' }}>Sarah A.</p>
                            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,.25)' }}>Solo traveler · 12 trips planned</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}