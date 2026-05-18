'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Users,
  Globe,
  LayoutTemplate,
  FileText,
  BookOpen,
  Images,
  Megaphone,
  Ticket,
  Bell,
  Handshake,
  CreditCard,
  Shield,
  Settings,
  Lock,
  ClipboardList,
  SlidersHorizontal,
  MonitorPlay,
  ChevronDown,
  LogOut,
  HelpCircle,
  Briefcase,
  Scale,
  Search,
  ShieldCheck,
  FileCheck,
  type LucideIcon,
} from 'lucide-react';

import NotificationBell from '@/components/admin/NotificationBell';
import GlobalSearch from '@/components/admin/GlobalSearch';

interface NavChild {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  children?: NavChild[];
}

interface NavGroup {
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    items: [
      { label: 'Overview', href: '/admin/overview', icon: LayoutDashboard },
      { label: 'User Management', href: '/admin/users', icon: Users },
      { label: 'Trip Manager', href: '/admin/trips', icon: Briefcase },
    ],
  },
  {
    items: [
      { label: 'Destination & City', href: '/admin/destinations', icon: Globe },
      { label: 'Master Templates', href: '/admin/templates', icon: LayoutTemplate },
      {
        label: 'CMS Manager',
        icon: FileText,
        children: [
          { label: 'Homepage', href: '/admin/homepage', icon: MonitorPlay },
          { label: 'Blog Posts', href: '/admin/cms/posts', icon: BookOpen },
          { label: 'Privacy Policy', href: '/admin/cms/pages/privacy', icon: ShieldCheck },
          { label: 'Terms of Service', href: '/admin/cms/pages/terms', icon: FileCheck },
          { label: 'Media Library', href: '/admin/cms/media', icon: Images },
        ],
      },
    ],
  },
  {
    items: [
      {
        label: 'Marketing Tools',
        icon: Megaphone,
        children: [
          { label: 'Vouchers & Promo', href: '/admin/marketing/vouchers', icon: Ticket },
          { label: 'Notification Blast', href: '/admin/marketing/notifications', icon: Bell },
        ],
      },
      { label: 'Affiliate Manager', href: '/admin/affiliates', icon: Handshake },
    ],
  },
  {
    items: [
      { label: 'Transactions', href: '/admin/transactions', icon: CreditCard },
      { label: 'Moderation', href: '/admin/moderation', icon: Shield },
    ],
  },
  {
    items: [
      {
        label: 'Settings',
        icon: Settings,
        children: [
          { label: 'Role Management', href: '/admin/role-management', icon: Lock },
          { label: 'Audit Log', href: '/admin/settings/audit', icon: ClipboardList },
          { label: 'Configuration', href: '/admin/settings/config', icon: SlidersHorizontal },
        ],
      },
    ],
  },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function isChildActive(children: NavChild[], pathname: string | null) {
  if (!pathname) return false;
  return children.some((c) => pathname === c.href || pathname.startsWith(c.href + '/'));
}

export default function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const onCloseRef = useRef(onMobileClose);
  useEffect(() => { onCloseRef.current = onMobileClose; });

  const defaultExpanded = navGroups
    .flatMap((g) => g.items)
    .filter((item) => item.children && isChildActive(item.children, pathname))
    .map((item) => item.label);

  const [expanded, setExpanded]       = useState<string[]>(defaultExpanded);
  const [searchOpen, setSearchOpen]   = useState(false);

  // Close mobile sidebar on navigation
  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      onCloseRef.current();
    }
  }, [pathname]);

  // Ctrl+K / Cmd+K global shortcut
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

  const toggle = (label: string) => {
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 w-[var(--sidebar)] h-screen bg-[var(--kg-paper)] border-r border-[var(--kg-hairline)] flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
      {/* Logo */}
      <div className="px-5 py-4 border-b border-[var(--kg-hairline)]">
        <Link href="/admin/overview" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--kg-primary)] to-[var(--kg-primary-bright)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            K
          </div>
          <div>
            <p className="font-serif text-[17px] font-medium text-[var(--kg-ink)] tracking-[-0.03em] leading-none">
              Kurma<em className="font-light italic text-[var(--kg-primary)]">Go.</em>
            </p>
            <p className="text-[10px] text-[var(--kg-ink-40)] tracking-[0.06em] uppercase mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Global search trigger */}
      <div className="px-3 pt-3 pb-1">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border border-[var(--kg-hairline)] bg-[var(--kg-canvas)] text-[var(--kg-ink-56)] hover:border-[var(--kg-primary)] hover:text-[var(--kg-primary)] transition-colors text-sm"
        >
          <Search className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="flex-1 text-left text-xs">Cari apa saja...</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--kg-hairline)] bg-[var(--kg-paper)] font-sans leading-none">
            ⌃K
          </kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-hide">
        {navGroups.map((group, gi) => (
          <div key={gi} className="space-y-0.5">
            {group.items.map((item) => {
              const hasChildren = !!item.children?.length;
              const isExpanded = expanded.includes(item.label);
              const isActive = item.href && pathname
                ? pathname === item.href || pathname.startsWith(item.href + '/')
                : false;
              const childActive = hasChildren && isChildActive(item.children!, pathname);

              if (hasChildren) {
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => toggle(item.label)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${childActive
                        ? 'text-[var(--kg-primary)] bg-[var(--kg-surface-mist)]'
                        : 'text-[var(--kg-ink-72)] hover:bg-[var(--kg-canvas)] hover:text-[var(--kg-ink)]'
                        }`}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 text-left font-medium">{item.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                          }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="mt-0.5 ml-3 pl-3 border-l border-[var(--kg-hairline)] space-y-0.5">
                        {item.children!.map((child) => {
                          const isChildActive = !!pathname && (pathname === child.href || pathname.startsWith(child.href + '/'));
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${isChildActive
                                ? 'text-[var(--kg-primary)] bg-[var(--kg-surface-mist)] font-medium'
                                : 'text-[var(--kg-ink-72)] hover:bg-[var(--kg-canvas)] hover:text-[var(--kg-ink)]'
                                }`}
                            >
                              <child.icon className="w-3.5 h-3.5 flex-shrink-0" />
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href!}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                    ? 'text-[var(--kg-primary)] bg-[var(--kg-surface-mist)] font-medium'
                    : 'text-[var(--kg-ink-72)] hover:bg-[var(--kg-canvas)] hover:text-[var(--kg-ink)]'
                    }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}

            {gi < navGroups.length - 1 && (
              <div className="mt-3 h-px bg-[var(--kg-hairline)] mx-1" />
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-[var(--kg-hairline)] space-y-0.5">

        {/* Notification Bell */}
        <div className="px-3 py-2 flex items-center gap-2.5">
          <NotificationBell />
          <span className="text-sm text-[var(--kg-ink-72)] font-medium">Notifikasi</span>
        </div>

        <div className="h-px bg-[var(--kg-hairline)] mx-1 my-1" />

        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--kg-ink-72)] hover:bg-[var(--kg-canvas)] hover:text-[var(--kg-ink)] transition-colors">
          <HelpCircle className="w-4 h-4 flex-shrink-0" />
          Help & Docs
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            document.cookie = 'token=; path=/; max-age=0';
            window.location.href = '/auth';
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--kg-coral)] hover:bg-[var(--kg-coral-soft)] transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Logout
        </button>
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </aside>
    </>
  );
}
