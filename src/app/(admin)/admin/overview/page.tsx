'use client';

import { useEffect, useState } from 'react';
import {
  Users, MapPin, Briefcase, TrendingUp,
  UserCheck, Clock, CheckCircle2, FileEdit,
  RefreshCw, AlertCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart, Area,
  PieChart, Pie, Cell, Tooltip as RTooltip,
  XAxis, YAxis, CartesianGrid,
} from 'recharts';
import {
  fetchAdminOverview,
  type OverviewData,
  type RecentUser,
  type RecentTrip,
} from '@/lib/adminApi';

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtShort(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function ago(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  draft:     { label: 'Draft',     color: '#8A95A2', bg: 'rgba(138,149,162,.12)' },
  active:    { label: 'Active',    color: '#1E6091', bg: 'rgba(30,96,145,.10)'   },
  completed: { label: 'Completed', color: '#2E8B57', bg: 'rgba(46,139,87,.10)'   },
};

const TYPE_COLORS = ['#1E6091', '#2E86AB', '#A8DADC', '#5C6B7A', '#8A95A2'];

const TYPE_LABEL: Record<string, string> = {
  solo: 'Solo', couple: 'Couple', family: 'Family', group: 'Group',
};

// ── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  sub: string;
  color: string;
}) {
  return (
    <div className="bg-[var(--kg-paper)] border border-[var(--kg-hairline)] rounded-xl p-5 flex items-start gap-4"
         style={{ boxShadow: 'var(--kg-shadow-soft-1)' }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
           style={{ background: `${color}18` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-[var(--kg-ink-40)] font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-[var(--kg-ink)] leading-tight mt-0.5">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <p className="text-xs text-[var(--kg-ink-56)] mt-1">{sub}</p>
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--kg-paper)] border border-[var(--kg-hairline)] rounded-xl overflow-hidden"
         style={{ boxShadow: 'var(--kg-shadow-soft-1)' }}>
      <div className="px-5 py-3.5 border-b border-[var(--kg-hairline)]">
        <h2 className="text-sm font-semibold text-[var(--kg-ink)]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--kg-paper)] border border-[var(--kg-hairline)] rounded-lg px-3 py-2 text-xs shadow-md">
      <p className="text-[var(--kg-ink-56)]">{label}</p>
      <p className="font-semibold text-[var(--kg-ink)]">{payload[0].value}</p>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function OverviewPage() {
  const [data, setData]       = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchAdminOverview());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-[var(--kg-canvas)] rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 h-64 bg-[var(--kg-canvas)] rounded-xl" />
          <div className="h-64 bg-[var(--kg-canvas)] rounded-xl" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="h-72 bg-[var(--kg-canvas)] rounded-xl" />
          <div className="h-72 bg-[var(--kg-canvas)] rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] gap-3">
        <AlertCircle className="w-8 h-8 text-[var(--kg-coral)]" />
        <p className="text-sm text-[var(--kg-ink-56)]">{error}</p>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-[var(--kg-primary)] text-white hover:opacity-90 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      </div>
    );
  }

  const { stats, charts, recent_users, recent_trips } = data!;

  const signupChartData = charts.signups_last_30d.map(d => ({ ...d, label: fmtShort(d.date) }));
  const tripChartData   = charts.trips_last_30d.map(d => ({ ...d, label: fmtShort(d.date) }));

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--kg-ink)]">Overview</h1>
          <p className="text-sm text-[var(--kg-ink-56)] mt-0.5">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--kg-hairline)] text-xs text-[var(--kg-ink-72)] hover:bg-[var(--kg-canvas)] transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.users.total}
          sub={`+${stats.users.new_this_month} this month`}
          color="#1E6091"
        />
        <StatCard
          icon={UserCheck}
          label="Verified Users"
          value={stats.users.verified}
          sub={`${stats.users.total > 0 ? Math.round((stats.users.verified / stats.users.total) * 100) : 0}% of total`}
          color="#2E86AB"
        />
        <StatCard
          icon={MapPin}
          label="Total Trips"
          value={stats.trips.total}
          sub={`+${stats.trips.new_this_month} this month`}
          color="#2E8B57"
        />
        <StatCard
          icon={Briefcase}
          label="Active Trips"
          value={stats.trips.active}
          sub={`${stats.trips.draft} draft · ${stats.trips.completed} done`}
          color="#F4A261"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Signups 30d area chart */}
        <div className="xl:col-span-1">
          <SectionCard title="New Signups — Last 30 Days">
            <div className="p-4 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={signupChartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#1E6091" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1E6091" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--kg-hairline)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--kg-ink-40)' }} tickLine={false} axisLine={false} interval={6} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--kg-ink-40)' }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <RTooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="count" stroke="#1E6091" strokeWidth={2} fill="url(#signupGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        {/* Trips by type donut */}
        <SectionCard title="Trips by Travel Type">
          <div className="p-4 h-[220px] flex items-center gap-4">
            <ResponsiveContainer width="55%" height="100%">
              <PieChart>
                <Pie
                  data={charts.trips_by_type}
                  dataKey="count"
                  nameKey="type"
                  cx="50%" cy="50%"
                  innerRadius={52} outerRadius={80}
                  paddingAngle={3}
                >
                  {charts.trips_by_type.map((_, i) => (
                    <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
                  ))}
                </Pie>
                <RTooltip formatter={(v, n) => [v, TYPE_LABEL[String(n)] ?? n]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {charts.trips_by_type.map((item, i) => (
                <div key={item.type} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: TYPE_COLORS[i % TYPE_COLORS.length] }} />
                  <span className="text-[var(--kg-ink-72)] flex-1">{TYPE_LABEL[item.type] ?? item.type}</span>
                  <span className="font-semibold text-[var(--kg-ink)]">{item.count}</span>
                </div>
              ))}
              {charts.trips_by_type.length === 0 && (
                <p className="text-xs text-[var(--kg-ink-40)]">No data yet</p>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Trip status breakdown + sparkline */}
        <SectionCard title="Trip Status Breakdown">
          <div className="p-4 space-y-3">
            {([
              { key: 'draft',     icon: FileEdit,     label: 'Draft',     value: stats.trips.draft     },
              { key: 'active',    icon: Clock,        label: 'Active',    value: stats.trips.active    },
              { key: 'completed', icon: CheckCircle2, label: 'Completed', value: stats.trips.completed },
            ] as const).map(({ key, icon: Icon, label, value }) => {
              const s = STATUS_STYLE[key];
              const pct = stats.trips.total > 0 ? Math.round((value / stats.trips.total) * 100) : 0;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                      <span className="text-xs text-[var(--kg-ink-72)]">{label}</span>
                    </div>
                    <span className="text-xs font-semibold text-[var(--kg-ink)]">
                      {value.toLocaleString()}{' '}
                      <span className="text-[var(--kg-ink-40)] font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-[var(--kg-canvas)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                         style={{ width: `${pct}%`, background: s.color }} />
                  </div>
                </div>
              );
            })}
            <div className="pt-2 border-t border-[var(--kg-hairline)] flex justify-between text-xs">
              <span className="text-[var(--kg-ink-40)]">Total trips</span>
              <span className="font-bold text-[var(--kg-ink)]">{stats.trips.total.toLocaleString()}</span>
            </div>
            <div className="pt-1">
              <p className="text-[10px] text-[var(--kg-ink-40)] mb-1.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> New trips — last 30 days
              </p>
              <ResponsiveContainer width="100%" height={48}>
                <AreaChart data={tripChartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tripGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#2E8B57" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2E8B57" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="count" stroke="#2E8B57" strokeWidth={1.5} fill="url(#tripGrad)" dot={false} />
                  <RTooltip content={<ChartTooltip />} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Recent Users */}
        <SectionCard title="Recent Users">
          <div className="divide-y divide-[var(--kg-hairline)]">
            {recent_users.length === 0 && (
              <p className="px-5 py-4 text-sm text-[var(--kg-ink-40)]">No users yet</p>
            )}
            {recent_users.map((u: RecentUser) => (
              <div key={u.id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--kg-surface-mist)] flex items-center justify-center text-xs font-bold text-[var(--kg-primary)] flex-shrink-0">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--kg-ink)] truncate">{u.name}</p>
                  <p className="text-xs text-[var(--kg-ink-40)] truncate">{u.email}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {u.role && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--kg-surface-mist)] text-[var(--kg-primary)] font-medium capitalize">
                      {u.role.slug}
                    </span>
                  )}
                  <span className="text-[10px] text-[var(--kg-ink-40)]">{ago(u.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Recent Trips */}
        <SectionCard title="Recent Trips">
          <div className="divide-y divide-[var(--kg-hairline)]">
            {recent_trips.length === 0 && (
              <p className="px-5 py-4 text-sm text-[var(--kg-ink-40)]">No trips yet</p>
            )}
            {recent_trips.map((t: RecentTrip) => {
              const s = STATUS_STYLE[t.status] ?? STATUS_STYLE.draft;
              return (
                <div key={t.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="text-lg flex-shrink-0 w-8 text-center leading-none">
                    {t.destination_flag ?? '🗺️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--kg-ink)] truncate">{t.name}</p>
                    <p className="text-xs text-[var(--kg-ink-40)] truncate">
                      {t.destination}
                      {t.start_date ? ` · ${fmtDate(t.start_date)}` : ''}
                      {t.user ? ` · ${t.user.name}` : ''}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize"
                          style={{ color: s.color, background: s.bg }}>
                      {s.label}
                    </span>
                    <span className="text-[10px] text-[var(--kg-ink-40)]">{ago(t.created_at)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

    </div>
  );
}
