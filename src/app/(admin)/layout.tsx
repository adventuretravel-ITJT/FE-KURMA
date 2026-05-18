'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

const API = process.env.NEXT_PUBLIC_API_URL;

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('token') ??
    document.cookie.match(/(?:^|;\s*)token=([^;]+)/)?.[1] ??
    null
  );
}

function isTokenExpired(token: string): boolean {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(base64)) as { exp?: number };
    return !!exp && Date.now() / 1000 > exp;
  } catch {
    return true;
  }
}

function saveToken(token: string) {
  localStorage.setItem('token', token);
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 14}`;
}

function clearAuth() {
  localStorage.removeItem('token');
  document.cookie = 'token=; path=/; max-age=0';
}

async function tryRefreshToken(): Promise<string | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API}/api/refresh-token`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json() as { access_token?: string };
    if (!data.access_token) return null;
    saveToken(data.access_token);
    return data.access_token;
  } catch {
    return null;
  }
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const originalFetch = useRef<typeof fetch | null>(null);
  const isRefreshing = useRef(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkAndRefresh() {
      const token = getToken();
      if (!token) {
        router.replace('/auth');
        return;
      }
      if (isTokenExpired(token)) {
        const refreshed = await tryRefreshToken();
        if (!refreshed) {
          clearAuth();
          router.replace('/auth');
        }
      }
    }

    // Check on mount
    checkAndRefresh();

    // Proactively refresh every 55 min (token TTL is 60 min)
    refreshTimer.current = setInterval(() => {
      tryRefreshToken();
    }, 55 * 60 * 1000);

    // Re-check when user returns to tab after being away
    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        checkAndRefresh();
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Intercept all fetch calls — on 401 try refresh once, redirect if it fails.
    // isRefreshing prevents recursive calls when tryRefreshToken itself hits 401.
    originalFetch.current = window.fetch.bind(window);
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const res = await originalFetch.current!(...args);
      if (res.status === 401 && !isRefreshing.current) {
        isRefreshing.current = true;
        try {
          const refreshed = await tryRefreshToken();
          if (!refreshed) {
            clearAuth();
            router.replace('/auth');
          }
        } finally {
          isRefreshing.current = false;
        }
      }
      return res;
    };

    return () => {
      if (refreshTimer.current) clearInterval(refreshTimer.current);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (originalFetch.current) window.fetch = originalFetch.current;
    };
  }, [router]);

  return (
    <div data-admin className="min-h-screen" style={{ background: '#f1f1f1' }}>
      {/* Mobile top bar — visible on < lg */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 flex items-center px-4 gap-3 z-30"
        style={{ background: '#ffffff', borderBottom: '1px solid #e1e3e5' }}>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-lg transition-colors"
          style={{ color: '#616161' }}
          aria-label="Buka menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/admin/overview" className="flex items-center gap-2">
          <div
            className="flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
            style={{ width: 26, height: 26, borderRadius: 6, background: 'linear-gradient(135deg, #2c6ecb, #1a4d8f)', fontSize: 13, fontWeight: 700 }}
          >
            K
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', letterSpacing: '-0.1px', lineHeight: 1.2 }}>KurmaGo</p>
            <p style={{ fontSize: 10, color: '#8a8a8a', fontWeight: 500, letterSpacing: '0.3px', marginTop: 1 }}>Admin Panel</p>
          </div>
        </Link>
      </header>

      <AdminSidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

      <main className="min-h-screen pt-14 lg:pt-0 lg:ml-[var(--sidebar)]">
        {children}
      </main>
    </div>
  );
}
