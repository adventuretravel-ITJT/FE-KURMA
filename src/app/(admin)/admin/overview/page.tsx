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
import { PageHeader }           from '@/components/admin/ui/PageHeader';
import { StatCard }             from '@/components/admin/ui/StatCard';
import { Card, CardHeader }     from '@/components/admin/ui/Card';
import { Badge, STATUS_CONFIG } from '@/components/admin/ui/Badge';

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function fmtShort(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short',
  });
}

function ago(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const TYPE_COLORS = ['#1E6091', '#2E86AB', '#A8DADC', '#5C6B7A', '#8A95A2'];
const TYPE_LABEL: Record<string, string> = {
  solo: 'Solo', couple: 'Couple', family: 'Family', group: 'Group',
};

// ── Chart tooltip ─────────────────────────────────────────────────────────────

function ChartTip({ active, payload, label }: {
  active?: boolean; payload?: { value: number }[]; label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E5DFD0',
      borderRadius: 8,
      padding: '6px 10px',
      fontSize: 12,
      boxShadow: '0 4px 12px rgba(13,27,42,.08)',
    }}>
      <p style={{ color: '#5C6B7A', marginBottom: 2 }}>{label}</p>
      <p style={{ fontWeight: 600, color: '#0D1B2A' }}>{payload[0].value}</p>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ width: 120, height: 22, background: '#E5DFD0', borderRadius: 6 }} />
            <div style={{ width: 200, height: 16, background: '#E5DFD0', borderRadius: 6 }} />
          </div>
          <div style={{ width: 80, height: 32, background: '#E5DFD0', borderRadius: 8 }} />
        </div>

        {/* stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: 108, background: '#E5DFD0', borderRadius: 12 }} />
          ))}
        </div>

        {/* charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ height: 280, background: '#E5DFD0', borderRadius: 12 }} />
          <div style={{ height: 280, background: '#E5DFD0', borderRadius: 12 }} />
        </div>
        <div style={{ height: 280, background: '#E5DFD0', borderRadius: 12 }} />

        {/* recent */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ height: 360, background: '#E5DFD0', borderRadius: 12 }} />
          <div style={{ height: 360, background: '#E5DFD0', borderRadius: 12 }} />
        </div>

      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ data, onRefresh }: { data: OverviewData; onRefresh: () => void }) {
  const { stats, charts, recent_users, recent_trips } = data;

  const signupData = charts.signups_last_30d.map(d => ({
    ...d, label: fmtShort(d.date),
  }));
  const tripData = charts.trips_last_30d.map(d => ({
    ...d, label: fmtShort(d.date),
  }));

  const verifiedPct = stats.users.total > 0
    ? Math.round((stats.users.verified / stats.users.total) * 100)
    : 0;

  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Header ── */}
      <PageHeader
        title="Overview"
        subtitle={new Date().toLocaleDateString('en-GB', {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        })}
        action={
          <button
            onClick={onRefresh}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8,
              border: '1px solid #E5DFD0', background: '#fff',
              fontSize: 12, color: '#5C6B7A', cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} /> Refresh
          </button>
        }
      />

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        <StatCard icon={Users}     label="Total Users"    value={stats.users.total}    sub={`+${stats.users.new_this_month} this month`}                      color="#1E6091" />
        <StatCard icon={UserCheck} label="Verified Users" value={stats.users.verified} sub={`${verifiedPct}% of total`}                                       color="#2E86AB" />
        <StatCard icon={MapPin}    label="Total Trips"    value={stats.trips.total}    sub={`+${stats.trips.new_this_month} this month`}                       color="#2E8B57" />
        <StatCard icon={Briefcase} label="Active Trips"   value={stats.trips.active}   sub={`${stats.trips.draft} draft · ${stats.trips.completed} done`}      color="#F4A261" />
      </div>

      {/* ── Charts: signups + donut (2 col) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Signups area chart */}
        <Card>
          <CardHeader title="New Signups — Last 30 Days" />
          <div style={{ padding: '16px 16px 16px 8px' }}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={signupData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <defs>
                  <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1E6091" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1E6091" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5DFD0" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: '#8A95A2' }}
                  tickLine={false}
                  axisLine={false}
                  interval={6}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#8A95A2' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  width={24}
                />
                <RTooltip content={<ChartTip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#1E6091"
                  strokeWidth={2}
                  fill="url(#signupGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#1E6091' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Trips by type donut */}
        <Card>
          <CardHeader title="Trips by Travel Type" />
          <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16, height: 252 }}>
            <div style={{ flex: '0 0 180px' }}>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={charts.trips_by_type}
                    dataKey="count"
                    nameKey="type"
                    cx="50%" cy="50%"
                    innerRadius={54}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {charts.trips_by_type.map((_, i) => (
                      <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RTooltip formatter={(v, n) => [v, TYPE_LABEL[String(n)] ?? n]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {charts.trips_by_type.length === 0 && (
                <p style={{ fontSize: 12, color: '#8A95A2' }}>No data yet</p>
              )}
              {charts.trips_by_type.map((item, i) => (
                <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: TYPE_COLORS[i % TYPE_COLORS.length],
                  }} />
                  <span style={{ flex: 1, color: '#3A4A5C', textTransform: 'capitalize' }}>
                    {TYPE_LABEL[item.type] ?? item.type}
                  </span>
                  <span style={{ fontWeight: 600, color: '#0D1B2A' }}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ── Trip status breakdown + sparkline (full width) ── */}
      <Card>
        <CardHeader title="Trip Status Breakdown" />
        <div style={{ padding: 20 }}>

          {/* Progress bars */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 20 }}>
            {([
              { key: 'draft',     Icon: FileEdit,     label: 'Draft',     value: stats.trips.draft     },
              { key: 'active',    Icon: Clock,        label: 'Active',    value: stats.trips.active    },
              { key: 'completed', Icon: CheckCircle2, label: 'Completed', value: stats.trips.completed },
            ] as const).map(({ key, Icon, label, value }) => {
              const s = STATUS_CONFIG[key];
              const pct = stats.trips.total > 0 ? Math.round((value / stats.trips.total) * 100) : 0;
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon size={14} style={{ color: s.color }} />
                      <span style={{ fontSize: 12, color: '#3A4A5C' }}>{label}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0D1B2A' }}>
                      {value.toLocaleString()}
                      <span style={{ fontWeight: 400, color: '#8A95A2' }}> ({pct}%)</span>
                    </span>
                  </div>
                  <div style={{ height: 6, background: '#F5F1E8', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: s.color, borderRadius: 999, transition: 'width .5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sparkline */}
          <div style={{ borderTop: '1px solid #E5DFD0', paddingTop: 16 }}>
            <p style={{ fontSize: 11, color: '#8A95A2', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
              <TrendingUp size={12} /> New trips — last 30 days
            </p>
            <ResponsiveContainer width="100%" height={56}>
              <AreaChart data={tripData} margin={{ top: 2, right: 4, left: 4, bottom: 2 }}>
                <defs>
                  <linearGradient id="tripGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2E8B57" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2E8B57" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="count" stroke="#2E8B57" strokeWidth={1.5} fill="url(#tripGrad)" dot={false} />
                <RTooltip content={<ChartTip />} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* ── Recent activity ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Recent Users */}
        <Card>
          <CardHeader title="Recent Users" />
          {recent_users.length === 0 && (
            <p style={{ padding: '16px 20px', fontSize: 13, color: '#8A95A2' }}>No users yet</p>
          )}
          {recent_users.map((u: RecentUser) => (
            <div key={u.id} style={{
              padding: '12px 20px',
              display: 'flex', alignItems: 'center', gap: 12,
              borderTop: '1px solid #E5DFD0',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'rgba(30,96,145,.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: '#1E6091', flexShrink: 0,
              }}>
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#0D1B2A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {u.name}
                </p>
                <p style={{ fontSize: 11, color: '#8A95A2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {u.email}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                {u.role && (
                  <span style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 999,
                    background: 'rgba(30,96,145,.08)', color: '#1E6091', fontWeight: 500,
                    textTransform: 'capitalize',
                  }}>
                    {u.role.slug}
                  </span>
                )}
                <span style={{ fontSize: 10, color: '#8A95A2' }}>{ago(u.created_at)}</span>
              </div>
            </div>
          ))}
        </Card>

        {/* Recent Trips */}
        <Card>
          <CardHeader title="Recent Trips" />
          {recent_trips.length === 0 && (
            <p style={{ padding: '16px 20px', fontSize: 13, color: '#8A95A2' }}>No trips yet</p>
          )}
          {recent_trips.map((t: RecentTrip) => {
            const s = STATUS_CONFIG[t.status] ?? STATUS_CONFIG.draft;
            return (
              <div key={t.id} style={{
                padding: '12px 20px',
                display: 'flex', alignItems: 'center', gap: 12,
                borderTop: '1px solid #E5DFD0',
              }}>
                <div style={{ fontSize: 22, flexShrink: 0, width: 32, textAlign: 'center', lineHeight: 1 }}>
                  {t.destination_flag ?? '🗺️'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#0D1B2A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.name}
                  </p>
                  <p style={{ fontSize: 11, color: '#8A95A2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.destination}
                    {t.start_date ? ` · ${fmtDate(t.start_date)}` : ''}
                    {t.user ? ` · ${t.user.name}` : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <Badge label={s.label} color={s.color} bg={s.bg} />
                  <span style={{ fontSize: 10, color: '#8A95A2' }}>{ago(t.created_at)}</span>
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

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

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div style={{
        padding: 32, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 12,
      }}>
        <AlertCircle size={32} color="#FF6B6B" />
        <p style={{ fontSize: 13, color: '#5C6B7A' }}>{error}</p>
        <button
          onClick={load}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 18px', borderRadius: 8,
            background: '#1E6091', color: '#fff',
            fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none',
          }}
        >
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  return <Dashboard data={data!} onRefresh={load} />;
}
