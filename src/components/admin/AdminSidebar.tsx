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
  label: string;
  items: NavItem[];
}

interface AdminSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navGroups: NavGroup[] = [
  {
    label: 'Dashboard',
    items: [
      { label: 'Overview', href: '/admin/overview', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Users',
    items: [
      { label: 'User Management', href: '/admin/users', icon: Users },
      { label: 'Trip Manager', href: '/admin/trips', icon: Briefcase },
    ],
  },
  {
    label: 'Content',
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
    label: 'Growth',
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
    label: 'Operations',
    items: [
      { label: 'Transactions', href: '/admin/transactions', icon: CreditCard },
      { label: 'Moderation', href: '/admin/moderation', icon: Shield },
    ],
  },
  {
    label: 'System',
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

  const [expanded, setExpanded] = useState<string[]>(defaultExpanded);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close mobile sidebar on navigation
  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      onCloseRef.current();
    }
  }, [pathname]);

  // Cmd+K / Ctrl+K global shortcut
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
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 w-[var(--sidebar)] h-screen flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: '#1a1a1a', borderRight: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Logo */}
        <div
          className="px-4 py-3.5 flex items-center flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <Link href="/admin/overview" className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center text-white flex-shrink-0"
              style={{
                width: 26, height: 26, borderRadius: 6,
                background: 'linear-gradient(135deg, #2c6ecb, #1a4d8f)',
                fontSize: 13, fontWeight: 700, letterSpacing: '-0.3px',
              }}
            >
              K
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', letterSpacing: '-0.1px', lineHeight: 1.2 }}>
                KurmaGo
              </p>
              <p style={{ fontSize: 10, color: '#8a8a8a', fontWeight: 500, letterSpacing: '0.3px', marginTop: 1 }}>
                Admin Panel
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 pb-3" style={{ scrollbarWidth: 'none' }}>
          {navGroups.map((group, gi) => (
            <div key={gi} style={{ marginTop: gi === 0 ? 8 : 12 }}>
              {/* Section label */}
              <p
                className="px-2.5"
                style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.4px',
                  textTransform: 'uppercase', color: '#8a8a8a',
                  paddingTop: 4, paddingBottom: 4,
                }}
              >
                {group.label}
              </p>

              <div className="space-y-px">
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
                          className={`w-full flex items-center gap-2.5 px-2.5 rounded-md text-[13px] font-medium transition-colors ${
                            childActive
                              ? 'text-white bg-[rgba(255,255,255,0.12)]'
                              : 'text-[#ebebeb] hover:bg-[rgba(255,255,255,0.07)] hover:text-white'
                          }`}
                          style={{ paddingTop: 7, paddingBottom: 7 }}
                        >
                          <item.icon className="w-4 h-4 flex-shrink-0" style={{ opacity: 0.85 }} />
                          <span className="flex-1 text-left">{item.label}</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                            style={{ opacity: 0.5 }}
                          />
                        </button>

                        {isExpanded && (
                          <div
                            className="mt-px ml-3 pl-3 space-y-px"
                            style={{ borderLeft: '1px solid rgba(255,255,255,0.12)' }}
                          >
                            {item.children!.map((child) => {
                              const isChildItemActive = !!pathname && (
                                pathname === child.href || pathname.startsWith(child.href + '/')
                              );
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className={`flex items-center gap-2.5 px-2.5 rounded-md text-[13px] transition-colors ${
                                    isChildItemActive
                                      ? 'text-white bg-[rgba(255,255,255,0.12)] font-semibold'
                                      : 'text-[#b5b5b5] hover:bg-[rgba(255,255,255,0.07)] hover:text-white'
                                  }`}
                                  style={{ paddingTop: 7, paddingBottom: 7 }}
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
                      className={`flex items-center gap-2.5 px-2.5 rounded-md text-[13px] font-medium transition-colors ${
                        isActive
                          ? 'text-white bg-[rgba(255,255,255,0.12)]'
                          : 'text-[#ebebeb] hover:bg-[rgba(255,255,255,0.07)] hover:text-white'
                      }`}
                      style={{ paddingTop: 7, paddingBottom: 7 }}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" style={{ opacity: 0.85 }} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div
          className="flex-shrink-0 p-2 space-y-px"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="px-2.5 py-2 flex items-center gap-2.5">
            <NotificationBell />
            <span className="text-[13px] font-medium" style={{ color: '#ebebeb' }}>Notifikasi</span>
          </div>

          <div className="mx-1" style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />

          <button
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] transition-colors text-[#b5b5b5] hover:bg-[rgba(255,255,255,0.07)] hover:text-white"
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            Help & Docs
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              document.cookie = 'token=; path=/; max-age=0';
              window.location.href = '/auth';
            }}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] transition-colors text-[#b5b5b5] hover:bg-[rgba(255,107,107,0.12)] hover:text-[#ff8a8a]"
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
