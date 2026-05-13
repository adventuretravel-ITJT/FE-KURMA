'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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

    // Intercept all fetch calls — on 401 try refresh once, redirect if it fails
    originalFetch.current = window.fetch;
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const res = await originalFetch.current!(...args);
      if (res.status === 401) {
        const refreshed = await tryRefreshToken();
        if (!refreshed) {
          clearAuth();
          router.replace('/auth');
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
    <div className="bg-[var(--kg-canvas)] min-h-screen">
      <AdminSidebar />
      <main className="min-h-screen" style={{ marginLeft: 'var(--sidebar)' }}>
        {children}
      </main>
    </div>
  );
}
