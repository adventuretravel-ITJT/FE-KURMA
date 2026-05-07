'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: 'Overview',
    href: '/admin/overview',
    icon: '📊',
  },
  {
    label: 'User Management',
    href: '/admin/users',
    icon: '👥',
  },
  {
    label: 'Destination & City',
    href: '/admin/destinations',
    icon: '🌍',
  },
  {
    label: 'Master Templates',
    href: '/admin/templates',
    icon: '📋',
  },
  {
    label: 'CMS Manager',
    href: '/admin/cms',
    icon: '📝',
  },
  {
    label: 'Marketing Tools',
    href: '/admin/marketing',
    icon: '📢',
  },
  {
    label: 'Affiliate Manager',
    href: '/admin/affiliates',
    icon: '🤝',
  },
  {
    label: 'Transactions',
    href: '/admin/transactions',
    icon: '💰',
  },
  {
    label: 'Moderation',
    href: '/admin/moderation',
    icon: '🛡️',
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: '⚙️',
    children: [
      { label: 'Role Management', href: '/admin/role-management', icon: '🔐' },
      { label: 'Configuration', href: '/admin/settings/config', icon: '⚙️' },
      { label: 'Audit Log', href: '/admin/settings/audit', icon: '📋' },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [expandedItem, setExpandedItem] = useState<string | null>('Settings');

  return (
    <aside className="fixed left-0 top-0 w-[var(--sidebar)] h-screen bg-[var(--kg-paper)] border-r border-[var(--kg-hairline)] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--kg-hairline)]">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--kg-primary)] to-[var(--kg-primary-bright)] flex items-center justify-center text-white font-bold">
            K
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-600 text-[var(--kg-ink)]">KurmaGo</span>
            <span className="text-xs text-[var(--kg-ink-40)]">Admin</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedItem === item.label;

          return (
            <div key={item.href}>
              <button
                onClick={() => hasChildren && setExpandedItem(isExpanded ? null : item.label)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-500 transition-all ${
                  isActive
                    ? 'bg-[var(--kg-surface-mist)] text-[var(--kg-primary)] border border-[var(--kg-hairline-mist)]'
                    : 'text-[var(--kg-ink-72)] hover:bg-[var(--kg-canvas)]'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {hasChildren && (
                  <span className={`text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                )}
              </button>

              {/* Submenu */}
              {hasChildren && isExpanded && (
                <div className="ml-6 mt-1 space-y-1 border-l border-[var(--kg-hairline)] pl-3 ml-3">
                  {item.children.map((child) => {
                    const isChildActive = pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-500 transition-all ${
                          isChildActive
                            ? 'text-[var(--kg-primary)] bg-[var(--kg-surface-mist)]'
                            : 'text-[var(--kg-ink-72)] hover:bg-[var(--kg-canvas)]'
                        }`}
                      >
                        <span className="text-sm">{child.icon}</span>
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--kg-hairline)] space-y-3">
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-500 text-[var(--kg-ink-72)] hover:bg-[var(--kg-canvas)] rounded-lg transition-all">
          📚 Help
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/auth/login';
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-500 text-[var(--kg-coral)] hover:bg-[var(--kg-coral-soft)] rounded-lg transition-all"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
