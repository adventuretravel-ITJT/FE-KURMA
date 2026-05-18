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
            {/* Bell Button — styled for dark sidebar */}
            <button
                onClick={() => setOpen(prev => !prev)}
                style={{
                    position: 'relative',
                    width: 28, height: 28,
                    borderRadius: 6,
                    border: 'none',
                    background: open ? 'rgba(255,255,255,0.10)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: open ? '#ffffff' : '#b5b5b5',
                    transition: 'background .15s, color .15s',
                    flexShrink: 0,
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.background = open ? 'rgba(255,255,255,0.10)' : 'transparent';
                    e.currentTarget.style.color = open ? '#ffffff' : '#b5b5b5';
                }}
            >
                <Bell size={16} />
                {unread > 0 && (
                    <span style={{
                        position: 'absolute', top: 4, right: 4,
                        width: 7, height: 7, borderRadius: '50%',
                        background: '#ff6b6b',
                        border: '2px solid #1a1a1a',
                    }} />
                )}
            </button>

            {/* Dropdown — tetap light/white sebagai floating panel */}
            {open && (
                <div style={{
                    position: 'fixed',
                    bottom: 60, left: 12,
                    width: 340, maxHeight: 460,
                    background: '#ffffff',
                    border: '1px solid #e1e3e5',
                    borderRadius: 12,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)',
                    zIndex: 9999,
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
                            <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
                                Notifikasi
                            </span>
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
                                    disabled={loading}
                                    title="Tandai semua dibaca"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 4,
                                        padding: '4px 8px', borderRadius: 6,
                                        border: '1px solid #e1e3e5',
                                        background: 'transparent', cursor: 'pointer',
                                        fontSize: 11, fontWeight: 500, color: '#005bd3',
                                        fontFamily: 'inherit',
                                    }}
                                >
                                    <CheckCheck size={11} /> Baca semua
                                </button>
                            )}
                            <button
                                onClick={() => setOpen(false)}
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
                                    {/* Icon */}
                                    <div style={{
                                        width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                                        background: '#f4f6f8',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 15, border: '1px solid #e1e3e5',
                                    }}>
                                        {getIcon(n.type)}
                                    </div>

                                    {/* Content */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontSize: 13, fontWeight: n.is_read ? 500 : 600,
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

                                    {/* Unread dot */}
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
    );
}