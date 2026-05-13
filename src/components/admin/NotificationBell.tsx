'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, X } from 'lucide-react';

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

function getIcon(type: string) {
    switch (type) {
        case 'trip_created': return '✈️';
        case 'role_changed': return '🔑';
        default: return '🔔';
    }
}

export default function NotificationBell() {
    const [notifs, setNotifs] = useState<Notification[]>([]);
    const [unread, setUnread] = useState(0);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    function getToken() {
        return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    }

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
            // silent fail
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
        setLoading(true);
        await fetch(`${API}/api/admin/notifications/read-all`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` },
        });
        setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnread(0);
        setLoading(false);
    }

    // Polling setiap 15 detik
    useEffect(() => {
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 15000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown saat klik di luar
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} style={{ position: 'relative' }}>
            {/* Bell Button */}
            <button
                onClick={() => setOpen(prev => !prev)}
                style={{
                    position: 'relative',
                    width: 38, height: 38,
                    borderRadius: 10,
                    border: '1px solid var(--kg-hairline)',
                    background: open ? 'var(--kg-surface-mist)' : 'var(--kg-paper)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--kg-ink-56)',
                    transition: 'all .18s',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--kg-surface-mist)';
                    e.currentTarget.style.color = 'var(--kg-primary)';
                }}
                onMouseLeave={e => {
                    if (!open) {
                        e.currentTarget.style.background = 'var(--kg-paper)';
                        e.currentTarget.style.color = 'var(--kg-ink-56)';
                    }
                }}
            >
                <Bell size={17} />
                {unread > 0 && (
                    <span style={{
                        position: 'absolute', top: 6, right: 6,
                        width: 8, height: 8, borderRadius: '50%',
                        background: '#FF6B6B',
                        border: '2px solid var(--kg-paper)',
                    }} />
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    width: 340, maxHeight: 440,
                    background: 'var(--kg-paper)',
                    border: '1px solid var(--kg-hairline)',
                    borderRadius: 14,
                    boxShadow: '0 8px 32px rgba(13,27,42,.12)',
                    zIndex: 999,
                    display: 'flex', flexDirection: 'column',
                    overflow: 'hidden',
                }}>
                    {/* Header */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 16px 12px',
                        borderBottom: '1px solid var(--kg-hairline)',
                    }}>
                        <div>
                            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--kg-ink)' }}>
                                Notifikasi
                            </span>
                            {unread > 0 && (
                                <span style={{
                                    marginLeft: 8, fontSize: 11, fontWeight: 600,
                                    background: 'var(--kg-primary)', color: '#fff',
                                    padding: '2px 7px', borderRadius: 100,
                                }}>
                                    {unread} baru
                                </span>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                            {unread > 0 && (
                                <button
                                    onClick={markAllRead}
                                    disabled={loading}
                                    title="Tandai semua dibaca"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 4,
                                        padding: '4px 10px', borderRadius: 8,
                                        border: '1px solid var(--kg-hairline)',
                                        background: 'transparent', cursor: 'pointer',
                                        fontSize: 11, fontWeight: 600, color: 'var(--kg-primary)',
                                        fontFamily: 'inherit',
                                    }}
                                >
                                    <CheckCheck size={12} /> Baca semua
                                </button>
                            )}
                            <button
                                onClick={() => setOpen(false)}
                                style={{
                                    width: 26, height: 26, borderRadius: 6,
                                    border: '1px solid var(--kg-hairline)',
                                    background: 'transparent', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--kg-ink-40)',
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
                                padding: '40px 20px', textAlign: 'center',
                                color: 'var(--kg-ink-40)', fontSize: 13,
                            }}>
                                <Bell size={28} style={{ margin: '0 auto 10px', opacity: .3 }} />
                                <p>Belum ada notifikasi</p>
                            </div>
                        ) : (
                            notifs.map(n => (
                                <div
                                    key={n.id}
                                    onClick={() => !n.is_read && markRead(n.id)}
                                    style={{
                                        display: 'flex', gap: 12, padding: '12px 16px',
                                        borderBottom: '1px solid var(--kg-hairline)',
                                        background: n.is_read ? 'transparent' : 'rgba(30,96,145,.04)',
                                        cursor: n.is_read ? 'default' : 'pointer',
                                        transition: 'background .15s',
                                    }}
                                    onMouseEnter={e => {
                                        if (!n.is_read) e.currentTarget.style.background = 'rgba(30,96,145,.08)';
                                    }}
                                    onMouseLeave={e => {
                                        if (!n.is_read) e.currentTarget.style.background = 'rgba(30,96,145,.04)';
                                    }}
                                >
                                    {/* Icon */}
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                        background: 'var(--kg-surface-mist)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 16,
                                    }}>
                                        {getIcon(n.type)}
                                    </div>

                                    {/* Content */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontSize: 13, fontWeight: n.is_read ? 500 : 700,
                                            color: 'var(--kg-ink)', marginBottom: 2,
                                        }}>
                                            {n.title}
                                        </div>
                                        <div style={{
                                            fontSize: 12, color: 'var(--kg-ink-56)',
                                            lineHeight: 1.5, marginBottom: 4,
                                        }}>
                                            {n.body}
                                        </div>
                                        <div style={{
                                            fontSize: 11, color: 'var(--kg-ink-40)',
                                            display: 'flex', alignItems: 'center', gap: 6,
                                        }}>
                                            {timeAgo(n.created_at)}
                                            {n.is_read && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 2, color: 'var(--kg-primary)' }}>
                                                    <Check size={10} /> Dibaca
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Unread dot */}
                                    {!n.is_read && (
                                        <div style={{
                                            width: 8, height: 8, borderRadius: '50%',
                                            background: 'var(--kg-primary)', flexShrink: 0, marginTop: 4,
                                        }} />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}