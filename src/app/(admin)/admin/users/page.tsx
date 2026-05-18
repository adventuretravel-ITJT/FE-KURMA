'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, Search, RefreshCw, AlertCircle,
  CheckCircle2, XCircle, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { fetchAdminUsers, type AdminUser, type UserListMeta } from '@/lib/adminApi';

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
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

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');
}

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  superadmin: { bg: '#FDF2F8', color: '#9D174D' },
  admin:      { bg: '#EFF6FF', color: '#0044a4' },
  cs:         { bg: '#FEF9C3', color: '#854D0E' },
  editor:     { bg: '#F0FDF4', color: '#166534' },
  marketing:  { bg: '#FFF7ED', color: '#C2410C' },
  user:       { bg: '#F5F3EF', color: '#616161' },
};

function roleStyle(slug: string | undefined) {
  return ROLE_COLORS[slug ?? 'user'] ?? ROLE_COLORS.user;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonRows() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <tr key={i}>
          {[140, 200, 80, 70, 60, 90].map((w, j) => (
            <td key={j} style={{ padding: '14px' }}>
              <div style={{ height: 13, borderRadius: 6, background: '#e4e7eb', width: w, animation: 'pulse-sk 1.4s ease infinite' }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({
  meta, page, onPage,
}: {
  meta: UserListMeta;
  page: number;
  onPage: (p: number) => void;
}) {
  if (meta.last_page <= 1) return null;

  const pages: (number | '…')[] = [];
  for (let i = 1; i <= meta.last_page; i++) {
    if (i === 1 || i === meta.last_page || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }

  const btnBase: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 32, height: 32, borderRadius: 8, border: '1px solid #e1e3e5',
    fontSize: 13, cursor: 'pointer', background: '#fff', color: '#616161',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderTop: '1px solid #e1e3e5' }}>
      <span style={{ fontSize: 12, color: '#8a8a8a' }}>
        {(page - 1) * meta.per_page + 1}–{Math.min(page * meta.per_page, meta.total)} of {meta.total.toLocaleString()} users
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button
          style={{ ...btnBase, opacity: page <= 1 ? .4 : 1 }}
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          <ChevronLeft size={14} />
        </button>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`e${i}`} style={{ width: 32, textAlign: 'center', fontSize: 13, color: '#8a8a8a' }}>…</span>
          ) : (
            <button
              key={p}
              style={{
                ...btnBase,
                background: p === page ? '#2c6ecb' : '#fff',
                color: p === page ? '#fff' : '#616161',
                borderColor: p === page ? '#2c6ecb' : '#e1e3e5',
                fontWeight: p === page ? 600 : 400,
              }}
              onClick={() => onPage(p as number)}
            >
              {p}
            </button>
          )
        )}
        <button
          style={{ ...btnBase, opacity: page >= meta.last_page ? .4 : 1 }}
          disabled={page >= meta.last_page}
          onClick={() => onPage(page + 1)}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const router = useRouter();

  const [users, setUsers]   = useState<AdminUser[]>([]);
  const [meta, setMeta]     = useState<UserListMeta>({ total: 0, per_page: 20, current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  const [search, setSearch]       = useState('');
  const [filterRole, setFilterRole]       = useState('');
  const [filterVerified, setFilterVerified] = useState('');
  const [sort, setSort]           = useState('created_at');
  const [dir, setDir]             = useState<'asc' | 'desc'>('desc');
  const [page, setPage]           = useState(1);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const result = await fetchAdminUsers({
        search: search || undefined,
        role: filterRole || undefined,
        verified: (filterVerified as '0' | '1' | '') || undefined,
        sort, dir, per_page: 20, page,
      });
      setUsers(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [search, filterRole, filterVerified, sort, dir, page]);

  useEffect(() => { load(); }, [load]);

  function handleSearch(val: string) { setSearch(val); setPage(1); }
  function handleRole(val: string)   { setFilterRole(val); setPage(1); }
  function handleVerified(val: string) { setFilterVerified(val); setPage(1); }

  function handleSort(key: string) {
    if (sort === key) setDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSort(key); setDir('asc'); setPage(1); }
  }

  const selectStyle: React.CSSProperties = {
    padding: '8px 12px', border: '1px solid #e1e3e5', borderRadius: 10, fontSize: 13,
    background: '#f4f6f8', color: '#1a1a1a', outline: 'none', cursor: 'pointer',
  };

  const SortArrow = ({ key: k }: { key: string }) => (
    <span style={{ fontSize: 10, color: sort === k ? '#2c6ecb' : '#d2d5d8', marginLeft: 4 }}>
      {sort === k ? (dir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  const verifiedCount   = users.filter((u) => u.email_verified_at).length;
  const unverifiedCount = users.filter((u) => !u.email_verified_at).length;

  return (
    <div className="p-4 lg:p-8">
      <PageHeader
        icon={<Users size={20} />}
        title="Customer List"
        description="Kelola semua akun customer — cari, filter, dan lihat detail"
        action={
          <button
            onClick={load}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 8,
              border: '1px solid #e1e3e5', background: '#fff',
              fontSize: 12, color: '#616161', cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} /> Refresh
          </button>
        }
      />

      {/* Summary cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Users', value: meta.total, bg: '#EFF6FF', color: '#0044a4' },
          { label: 'Verified',    value: verifiedCount,   bg: '#ECFDF5', color: '#059669' },
          { label: 'Unverified',  value: unverifiedCount, bg: '#FFF5F5', color: '#DC2626' },
        ].map((s) => (
          <div key={s.label} style={{ padding: '14px 20px', background: s.bg, borderRadius: 12, minWidth: 110 }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: 11.5, color: s.color, fontWeight: 600, marginTop: 3, opacity: .8 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8a8a8a' }} />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Cari nama atau email…"
            style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #e1e3e5', borderRadius: 10, fontSize: 13, background: '#f4f6f8', color: '#1a1a1a', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <select value={filterRole} onChange={(e) => handleRole(e.target.value)} style={selectStyle}>
          <option value="">Semua Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
          <option value="cs">CS</option>
          <option value="editor">Editor</option>
          <option value="marketing">Marketing</option>
        </select>

        <select value={filterVerified} onChange={(e) => handleVerified(e.target.value)} style={selectStyle}>
          <option value="">Semua Status</option>
          <option value="1">Verified</option>
          <option value="0">Unverified</option>
        </select>
      </div>

      {/* Error state */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', background: '#FFF5F5', border: '1px solid #FCA5A5', borderRadius: 12, color: '#DC2626', fontSize: 13, marginBottom: 16 }}>
          <AlertCircle size={16} /> {error}
          <button onClick={load} style={{ marginLeft: 'auto', fontSize: 12, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e1e3e5', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f4f6f8' }}>
                {[
                  { label: 'User', key: 'name' },
                  { label: 'Email', key: 'email' },
                  { label: 'Role', key: null },
                  { label: 'Status', key: null },
                  { label: 'Trips', key: 'trips_count' },
                  { label: 'Bergabung', key: 'created_at' },
                ].map(({ label, key: k }) => (
                  <th
                    key={label}
                    onClick={() => k && handleSort(k)}
                    style={{
                      padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600,
                      color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '.04em',
                      borderBottom: '1px solid #e1e3e5', whiteSpace: 'nowrap',
                      cursor: k ? 'pointer' : 'default', userSelect: 'none',
                    }}
                  >
                    {label}
                    {k && <SortArrow key={k} />}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <SkeletonRows />
              ) : !error && users.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div style={{ padding: '60px 20px', textAlign: 'center', color: '#8a8a8a' }}>
                      <Users size={36} style={{ margin: '0 auto 12px', opacity: .35 }} />
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#616161', marginBottom: 4 }}>Tidak ada user ditemukan</p>
                      <p style={{ fontSize: 13 }}>Coba ubah filter atau kata kunci pencarian.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u, i) => {
                  const rs = roleStyle(u.role?.slug);
                  return (
                    <tr
                      key={u.id}
                      style={{ borderBottom: i < users.length - 1 ? '1px solid #ebebeb' : 'none', cursor: 'pointer' }}
                      onClick={() => router.push(`/admin/users/${u.id}`)}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f4f6f8')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* User */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                            background: '#ebf5ff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 700, color: '#2c6ecb',
                          }}>
                            {initials(u.name)}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap' }}>
                            {u.name}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding: '12px 14px', color: '#616161', fontSize: 12.5 }}>{u.email}</td>

                      {/* Role */}
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600,
                          background: rs.bg, color: rs.color, textTransform: 'capitalize',
                        }}>
                          {u.role?.slug ?? 'user'}
                        </span>
                      </td>

                      {/* Verified */}
                      <td style={{ padding: '12px 14px' }}>
                        {u.email_verified_at ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#059669', fontWeight: 500 }}>
                            <CheckCircle2 size={13} /> Verified
                          </span>
                        ) : (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#DC2626', fontWeight: 500 }}>
                            <XCircle size={13} /> Unverified
                          </span>
                        )}
                      </td>

                      {/* Trips count */}
                      <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: u.trips_count > 0 ? '#2c6ecb' : '#d2d5d8' }}>
                        {u.trips_count}
                      </td>

                      {/* Joined */}
                      <td style={{ padding: '12px 14px' }}>
                        <p style={{ fontSize: 12, color: '#1a1a1a' }}>{fmtDate(u.created_at)}</p>
                        <p style={{ fontSize: 11, color: '#8a8a8a', marginTop: 1 }}>{ago(u.created_at)}</p>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination meta={meta} page={page} onPage={setPage} />
      </div>

      <style>{`
        @keyframes pulse-sk {
          0%, 100% { opacity: 1; }
          50% { opacity: .4; }
        }
      `}</style>
    </div>
  );
}
