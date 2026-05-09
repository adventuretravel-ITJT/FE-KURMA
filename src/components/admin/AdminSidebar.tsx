'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Settings2,
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
  FileStack,
  MonitorPlay,
  ChevronDown,
  LogOut,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';

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
      { label: 'Overview',         href: '/admin/overview',  icon: LayoutDashboard },
      { label: 'User Management',  href: '/admin/users',     icon: Users           },
      { label: 'Product Config',   href: '/admin/product',   icon: Settings2       },
    ],
  },
  {
    items: [
      { label: 'Destination & City', href: '/admin/destinations', icon: Globe          },
      { label: 'Master Templates',   href: '/admin/templates',    icon: LayoutTemplate },
      {
        label: 'CMS Manager',
        icon: FileText,
        children: [
          { label: 'Homepage',      href: '/admin/homepage',   icon: MonitorPlay },
          { label: 'Blog Posts',    href: '/admin/cms/posts',  icon: BookOpen    },
          { label: 'Static Pages',  href: '/admin/cms/pages',  icon: FileStack   },
          { label: 'Media Library', href: '/admin/cms/media',  icon: Images      },
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
          { label: 'Vouchers & Promo',  href: '/admin/marketing/vouchers',       icon: Ticket },
          { label: 'Notification Blast', href: '/admin/marketing/notifications',  icon: Bell   },
        ],
      },
      { label: 'Affiliate Manager', href: '/admin/affiliates', icon: Handshake },
    ],
  },
  {
    items: [
      { label: 'Transactions', href: '/admin/transactions', icon: CreditCard },
      { label: 'Moderation',   href: '/admin/moderation',   icon: Shield     },
    ],
  },
  {
    items: [
      {
        label: 'Settings',
        icon: Settings,
        children: [
          { label: 'Role Management', href: '/admin/role-management',  icon: Lock           },
          { label: 'Audit Log',       href: '/admin/settings/audit',   icon: ClipboardList  },
          { label: 'Configuration',   href: '/admin/settings/config',  icon: SlidersHorizontal },
        ],
      },
    ],
  },
];

function isChildActive(children: NavChild[], pathname: string | null) {
  if (!pathname) return false;
  return children.some((c) => pathname === c.href || pathname.startsWith(c.href + '/'));
}

export default function AdminSidebar() {
  const pathname = usePathname();

  const defaultExpanded = navGroups
    .flatMap((g) => g.items)
    .filter((item) => item.children && isChildActive(item.children, pathname))
    .map((item) => item.label);

  const [expanded, setExpanded] = useState<string[]>(defaultExpanded);

  const toggle = (label: string) => {
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  return (
    <aside className="fixed left-0 top-0 w-[var(--sidebar)] h-screen bg-[var(--kg-paper)] border-r border-[var(--kg-hairline)] flex flex-col z-50">
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

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-hide">
        {navGroups.map((group, gi) => (
          <div key={gi} className="space-y-0.5">
            {group.items.map((item) => {
              const hasChildren = !!item.children?.length;
              const isExpanded  = expanded.includes(item.label);
              const isActive    = item.href && pathname
                ? pathname === item.href || pathname.startsWith(item.href + '/')
                : false;
              const childActive = hasChildren && isChildActive(item.children!, pathname);

              if (hasChildren) {
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => toggle(item.label)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                        childActive
                          ? 'text-[var(--kg-primary)] bg-[var(--kg-surface-mist)]'
                          : 'text-[var(--kg-ink-72)] hover:bg-[var(--kg-canvas)] hover:text-[var(--kg-ink)]'
                      }`}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 text-left font-medium">{item.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
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
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                                isChildActive
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
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
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
    </aside>
  );
}
