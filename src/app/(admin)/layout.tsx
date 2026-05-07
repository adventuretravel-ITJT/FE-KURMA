'use client';

import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--kg-canvas)]">
      <AdminSidebar />
      <main className="flex-1 ml-[var(--sidebar)] transition-all">
        <div className="border-b border-[var(--kg-hairline)]">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="text-xs font-500 text-[var(--kg-ink-40)] uppercase tracking-wide">Admin Panel</div>
          </div>
        </div>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
