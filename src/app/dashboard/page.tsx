'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
    id: number
    name: string
    email: string
    role?: { name: string; slug: string }
}

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.replace('/auth')
            return
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) {
                    localStorage.removeItem('token')
                    router.replace('/auth')
                    return null
                }
                return res.json()
            })
            .then((data) => {
                if (data) setUser(data)
            })
            .catch(() => {
                localStorage.removeItem('token')
                router.replace('/auth')
            })
            .finally(() => setLoading(false))
    }, [router])

    function handleLogout() {
        const token = localStorage.getItem('token')
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        }).finally(() => {
            localStorage.removeItem('token')
            router.replace('/auth')
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#FBFAF8' }}>
                <div className="w-5 h-5 rounded-full border-2 border-black/10 border-t-black"
                    style={{ animation: 'spin .7s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
        )
    }

    if (!user) return null

    return (
        <main className="min-h-screen" style={{ background: '#FBFAF8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>

                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <span style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, letterSpacing: '-.03em', color: '#111110' }}>
                        Kurma<em style={{ fontStyle: 'italic', color: 'rgba(44,150,100,.85)', fontWeight: 300 }}>.Guide</em>
                    </span>
                    <button onClick={handleLogout}
                        className="flex items-center gap-1.5 text-[13px] font-medium transition-colors duration-200"
                        style={{ color: 'rgba(17,17,16,.5)', background: 'none', border: 'none', cursor: 'pointer' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#111110')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(17,17,16,.5)')}>
                        Sign out
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-3.5 h-3.5" strokeLinecap="round">
                            <path d="M10 3h3v10h-3M7 11l4-3-4-3M1 8h8" />
                        </svg>
                    </button>
                </div>

                {/* Welcome card */}
                <div style={{
                    background: '#fff',
                    border: '1px solid rgba(17,17,16,.07)',
                    borderRadius: 16,
                    padding: '32px 36px',
                    boxShadow: '0 1px 8px rgba(17,17,16,.04)',
                }}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                            style={{ background: 'linear-gradient(135deg, #2C5F4E, rgba(184,149,106,.6))', color: 'white' }}>
                            {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h1 style={{ fontSize: 18, fontWeight: 600, color: '#111110', marginBottom: 2 }}>
                                Welcome , {user.name.split(' ')[0]}!
                            </h1>
                            <p style={{ fontSize: 13, color: 'rgba(17,17,16,.45)' }}>{user.email}</p>
                        </div>
                        {user.role && (
                            <span className="ml-auto text-[11px] font-semibold uppercase tracking-widest"
                                style={{ color: '#2C5F4E', background: 'rgba(44,95,78,.08)', borderRadius: 6, padding: '4px 10px' }}>
                                {user.role.name}
                            </span>
                        )}
                    </div>
                    <p style={{ fontSize: 14, color: 'rgba(17,17,16,.45)', lineHeight: 1.65 }}>
                        Dashboard is under construction. More features coming soon.
                    </p>
                </div>

            </div>
        </main>
    )
}
