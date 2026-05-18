'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Bell, Check, CheckCheck, X, Menu } from 'lucide-react';
import GlobalSearch from '@/components/admin/GlobalSearch';

const API = process.env.NEXT_PUBLIC_API_URL;

interface Notification {
    id: number;
    type: string;
    title: string;
    body: string;
    data: Record<string, unknown>;
    is_read: boolean;
    created_at: string;
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Baru saja';
    if (m < 60) return `${m} menit lalu`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} jam lalu`;
    return `${Math.floor(h / 24)} hari lalu`;
}

function getNotifIcon(type: string) {
    switch (type) {
        case 'trip_created': return '✈️';
        case 'role_changed': return '🔑';
        default: return '🔔';
    }
}

function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
}

interface AdminTopbarProps {
    onMobileMenuOpen: () => void;
}

export default function AdminTopbar({ onMobileMenuOpen }: AdminTopbarProps) {
    const [notifs, setNotifs] = useState<Notification[]>([]);
    const [unread, setUnread] = useState(0);
    const [notifsOpen, setNotifsOpen] = useState(false);
    const [loadingAll, setLoadingAll] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    async function fetchNotifs() {
        const token = getToken();
        if (!token) return;
        try {
            const res = await fetch(`${API}/api/admin/notifications`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setNotifs(data.notifications ?? []);
                setUnread(data.unread_count ?? 0);
            }
        } catch {
            // silent
        }
    }

    async function markRead(id: number) {
        const token = getToken();
        await fetch(`${API}/api/admin/notifications/${id}/read`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` },
        });
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnread(prev => Math.max(0, prev - 1));
    }

    async function markAllRead() {
        const token = getToken();
        setLoadingAll(true);
        await fetch(`${API}/api/admin/notifications/read-all`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` },
        });
        setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnread(0);
        setLoadingAll(false);
    }

    // Poll every 15 s
    useEffect(() => {
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 15000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        function onMouseDown(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setNotifsOpen(false);
            }
        }
        document.addEventListener('mousedown', onMouseDown);
        return () => document.removeEventListener('mousedown', onMouseDown);
    }, []);

    // Cmd+K / Ctrl+K → open search
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    return (
        <>
            <header style={{
                height: 52,
                background: '#ffffff',
                borderBottom: '1px solid #e1e3e5',
                display: 'flex',
                alignItems: 'center',
                padding: '0 20px',
                gap: 10,
                position: 'sticky',
                top: 0,
                zIndex: 50,
                flexShrink: 0,
            }}>
                {/* Hamburger — mobile only */}
                <button
                    className="lg:hidden"
                    onClick={onMobileMenuOpen}
                    style={{
                        width: 32, height: 32, borderRadius: 6,
                        background: 'transparent', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#616161', cursor: 'pointer', flexShrink: 0,
                    }}
                    aria-label="Buka menu"
                >
                    <Menu size={18} />
                </button>

                {/* Logo — mobile only */}
                <Link href="/admin/overview" className="lg:hidden flex items-center gap-2 flex-shrink-0">
                    <div style={{
                        width: 24, height: 24, borderRadius: 5,
                        background: 'linear-gradient(135deg, #2c6ecb, #1a4d8f)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 11, fontWeight: 700,
                    }}>K</div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', letterSpacing: '-0.1px' }}>KurmaGo</span>
                </Link>

                {/* Search input */}
                <div style={{ flex: 1, maxWidth: 420, position: 'relative' }}>
                    <span style={{
                        position: 'absolute', left: 11, top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#8a8a8a', pointerEvents: 'none', display: 'flex',
                    }}>
                        <Search size={14} />
                    </span>
                    <input
                        type="text"
                        placeholder="Cari user, itinerary, blog post..."
                        readOnly
                        onClick={() => setSearchOpen(true)}
                        style={{
                            width: '100%', height: 32,
                            background: '#f1f1f1',
                            border: '1px solid transparent',
                            borderRadius: 6,
                            padding: '0 40px 0 32px',
                            fontSize: 13, color: '#1a1a1a',
                            cursor: 'pointer', outline: 'none',
                            transition: 'background .12s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#e4e7eb'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#f1f1f1'; }}
                    />
                    {/* Cmd+K hint — desktop only */}
                    <span className="hidden lg:flex" style={{
                        position: 'absolute', right: 8, top: '50%',
                        transform: 'translateY(-50%)',
                        alignItems: 'center', gap: 2,
                        fontSize: 10, color: '#8a8a8a',
                        pointerEvents: 'none',
                    }}>
                        <kbd style={{
                            background: '#ffffff', border: '1px solid #d2d5d8',
                            borderRadius: 3, padding: '1px 4px',
                            fontSize: 10, color: '#616161', lineHeight: 1.4,
                            fontFamily: 'inherit',
                        }}>⌘K</kbd>
                    </span>
                </div>

                {/* Right actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>

                    {/* Notification bell */}
                    <div ref={dropdownRef} style={{ position: 'relative' }}>
                        <button
                            onClick={() => setNotifsOpen(prev => !prev)}
                            title="Notifikasi"
                            style={{
                                width: 32, height: 32, borderRadius: 6, border: 'none',
                                background: notifsOpen ? '#f4f6f8' : 'transparent',
                                color: notifsOpen ? '#1a1a1a' : '#616161',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', position: 'relative',
                                transition: 'background .12s, color .12s',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = '#f4f6f8';
                                e.currentTarget.style.color = '#1a1a1a';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = notifsOpen ? '#f4f6f8' : 'transparent';
                                e.currentTarget.style.color = notifsOpen ? '#1a1a1a' : '#616161';
                            }}
                        >
                            <Bell size={16} />
                            {unread > 0 && (
                                <span style={{
                                    position: 'absolute', top: 6, right: 6,
                                    width: 7, height: 7, borderRadius: '50%',
                                    background: '#d72c0d',
                                    border: '2px solid #ffffff',
                                }} />
                            )}
                        </button>

                        {/* Notification dropdown */}
                        {notifsOpen && (
                            <div style={{
                                position: 'absolute',
                                top: 'calc(100% + 8px)', right: 0,
                                width: 340, maxHeight: 460,
                                background: '#ffffff',
                                border: '1px solid #e1e3e5',
                                borderRadius: 12,
                                boxShadow: '0 8px 32px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.06)',
                                zIndex: 200,
                                display: 'flex', flexDirection: 'column',
                                overflow: 'hidden',
                            }}>
                                {/* Header */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '12px 14px 10px',
                                    borderBottom: '1px solid #e1e3e5',
                                    flexShrink: 0,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>Notifikasi</span>
                                        {unread > 0 && (
                                            <span style={{
                                                fontSize: 11, fontWeight: 600,
                                                background: '#d72c0d', color: '#fff',
                                                padding: '1px 6px', borderRadius: 999,
                                            }}>
                                                {unread}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        {unread > 0 && (
                                            <button
                                                onClick={markAllRead}
                                                disabled={loadingAll}
                                                title="Tandai semua dibaca"
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 4,
                                                    padding: '4px 8px', borderRadius: 6,
                                                    border: '1px solid #e1e3e5',
                                                    background: 'transparent', cursor: 'pointer',
                                                    fontSize: 11, fontWeight: 500, color: '#2c6ecb',
                                                    fontFamily: 'inherit',
                                                }}
                                            >
                                                <CheckCheck size={11} /> Baca semua
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setNotifsOpen(false)}
                                            style={{
                                                width: 26, height: 26, borderRadius: 6,
                                                border: '1px solid #e1e3e5',
                                                background: 'transparent', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#8a8a8a',
                                            }}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                </div>

                                {/* List */}
                                <div style={{ overflowY: 'auto', flex: 1 }}>
                                    {notifs.length === 0 ? (
                                        <div style={{
                                            padding: '36px 20px', textAlign: 'center',
                                            color: '#8a8a8a', fontSize: 13,
                                        }}>
                                            <Bell size={26} style={{ margin: '0 auto 10px', opacity: .3 }} />
                                            <p style={{ fontWeight: 500 }}>Belum ada notifikasi</p>
                                        </div>
                                    ) : (
                                        notifs.map(n => (
                                            <div
                                                key={n.id}
                                                onClick={() => !n.is_read && markRead(n.id)}
                                                style={{
                                                    display: 'flex', gap: 10, padding: '10px 14px',
                                                    borderBottom: '1px solid #ebebeb',
                                                    background: n.is_read ? 'transparent' : '#f4f6f8',
                                                    cursor: n.is_read ? 'default' : 'pointer',
                                                    transition: 'background .12s',
                                                }}
                                                onMouseEnter={e => {
                                                    if (!n.is_read) e.currentTarget.style.background = '#e4e7eb';
                                                }}
                                                onMouseLeave={e => {
                                                    if (!n.is_read) e.currentTarget.style.background = '#f4f6f8';
                                                }}
                                            >
                                                <div style={{
                                                    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                                                    background: '#f4f6f8',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: 15, border: '1px solid #e1e3e5',
                                                }}>
                                                    {getNotifIcon(n.type)}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{
                                                        fontSize: 13,
                                                        fontWeight: n.is_read ? 500 : 600,
                                                        color: '#1a1a1a', marginBottom: 2,
                                                    }}>
                                                        {n.title}
                                                    </div>
                                                    <div style={{
                                                        fontSize: 12, color: '#616161',
                                                        lineHeight: 1.45, marginBottom: 3,
                                                    }}>
                                                        {n.body}
                                                    </div>
                                                    <div style={{
                                                        fontSize: 11, color: '#8a8a8a',
                                                        display: 'flex', alignItems: 'center', gap: 6,
                                                    }}>
                                                        {timeAgo(n.created_at)}
                                                        {n.is_read && (
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: 2, color: '#008060' }}>
                                                                <Check size={10} /> Dibaca
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {!n.is_read && (
                                                    <div style={{
                                                        width: 7, height: 7, borderRadius: '50%',
                                                        background: '#2c6ecb', flexShrink: 0, marginTop: 5,
                                                    }} />
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    );
}
