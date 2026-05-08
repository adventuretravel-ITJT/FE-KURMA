'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { UserContext, User } from '@/contexts/UserContext'
import Sidebar from '@/components/dashboard/Sidebar'

const API = process.env.NEXT_PUBLIC_API_URL

async function tryRefreshToken(): Promise<string | null> {
    const token = localStorage.getItem('token')
    if (!token) return null
    try {
        const res = await fetch(`${API}/api/refresh-token`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return null
        const data = await res.json()
        const newToken = data.access_token as string
        localStorage.setItem('token', newToken)
        return newToken
    } catch {
        return null
    }
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const isTripPage = /^\/dashboard\/trips\/[^/]+(\/.*)?$/.test(pathname ?? '')
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        async function init() {
            let token = localStorage.getItem('token')
            if (!token) { router.replace('/auth'); return }

            const ctrl = new AbortController()
            const t1 = setTimeout(() => ctrl.abort(), 10000)
            let res = await fetch(`${API}/api/me`, {
                headers: { Authorization: `Bearer ${token}` },
                signal: ctrl.signal,
            }).catch(() => null)
            clearTimeout(t1)

            // Token expired â€” try to refresh once
            if (!res || res.status === 401) {
                token = await tryRefreshToken()
                if (!token) {
                    localStorage.removeItem('token')
                    router.replace('/auth')
                    return
                }
                const ctrl2 = new AbortController()
                const t2 = setTimeout(() => ctrl2.abort(), 10000)
                res = await fetch(`${API}/api/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                    signal: ctrl2.signal,
                }).catch(() => null)
                clearTimeout(t2)
            }

            if (!res || !res.ok) {
                localStorage.removeItem('token')
                router.replace('/auth')
                return
            }

            const data = await res.json()

            if (!data.email_verified_at) {
                router.replace('/auth/verify-email')
                return
            }

            setUser(data)
            setLoading(false)

            // Proactively refresh token every 55 minutes (TTL is 60 min)
            refreshTimer.current = setInterval(async () => {
                await tryRefreshToken()
            }, 55 * 60 * 1000)
        }

        init()

        return () => {
            if (refreshTimer.current) clearInterval(refreshTimer.current)
        }
    }, [router])

    function handleLogout() {
        if (refreshTimer.current) clearInterval(refreshTimer.current)
        const token = localStorage.getItem('token')
        fetch(`${API}/api/logout`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token ?? ''}` },
        }).finally(() => {
            localStorage.removeItem('token')
            router.replace('/auth')
        })
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--line-strong)', borderTopColor: 'var(--ink)', animation: 'spin .7s linear infinite' }} />
            </div>
        )
    }

    if (!user) return null

    return (
        <UserContext.Provider value={{
            user,
            onLogout: handleLogout,
            sidebarOpen,
            onToggleSidebar: () => setSidebarOpen((p) => !p),
            onCloseSidebar: () => setSidebarOpen(false),
        }}>
            <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
                {!isTripPage && (
                    <>
                        <div
                            className={`dash-overlay${sidebarOpen ? ' is-open' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        />
                        <Sidebar />
                    </>
                )}

                <div className="dash-main" style={isTripPage ? { marginLeft: 0 } : undefined}>
                    {children}
                </div>
            </div>
        </UserContext.Provider>
    )
}

