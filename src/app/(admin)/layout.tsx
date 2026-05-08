'use client';

import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[var(--kg-canvas)] min-h-screen">
      <AdminSidebar />
      <main className="min-h-screen" style={{ marginLeft: 'var(--sidebar)' }}>
        {children}
      </main>
    </div>
  );
}
