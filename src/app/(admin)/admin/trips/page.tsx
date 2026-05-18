'use client';

import { useEffect, useState, useCallback } from 'react';
import { Briefcase, Search, RefreshCw, Trash2, AlertCircle, MapPin, User, Calendar, X } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { Badge, STATUS_CONFIG } from '@/components/admin/ui/Badge';

const API = process.env.NEXT_PUBLIC_API_URL;

function authHeaders() {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token') ?? document.cookie.match(/token=([^;]+)/)?.[1]
    : null;
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function ago(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface TripUser { id: number; name: string; email: string; }

interface Trip {
  id: number;
  name: string;
  destination: string;
  destination_flag: string | null;
  travel_type: 'solo' | 'couple' | 'family' | 'group';
  status: 'draft' | 'active' | 'completed';
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  user: TripUser | null;
}

const STATUS_LABELS: Record<string, string> = { draft: 'Draft', active: 'Active', completed: 'Completed' };
const TYPE_LABELS:   Record<string, string> = { solo: 'Solo', couple: 'Couple', family: 'Family', group: 'Group' };
const TYPE_COLORS:   Record<string, { bg: string; color: string }> = {
  solo:   { bg: '#ebf5ff', color: '#1D4ED8' },
  couple: { bg: '#FDF2F8', color: '#9D174D' },
  family: { bg: '#FEF9C3', color: '#854D0E' },
  group:  { bg: '#F0FDF4', color: '#166534' },
};

// ── Status update modal ───────────────────────────────────────────────────────

function StatusModal({ trip, onClose, onUpdated }: { trip: Trip; onClose: () => void; onUpdated: () => void }) {
  const [status, setStatus] = useState<Trip['status']>(trip.status);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  async function handleSave() {
    if (status === trip.status) { onClose(); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch(`${API}/api/admin/trips/${trip.id}/status`, {
        method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 380, padding: 28, boxShadow: '0 24px 64px rgba(26,26,26,.18)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Update Status</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8a8a8a' }}><X size={16} /></button>
        </div>
        <p style={{ fontSize: 12.5, color: '#616161', marginBottom: 16 }}>Trip: <strong style={{ color: '#1a1a1a' }}>{trip.name}</strong></p>

        {error && <p style={{ fontSize: 12, color: '#DC2626', marginBottom: 12 }}>{error}</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {(['draft', 'active', 'completed'] as const).map(s => (
            <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', border: `1.5px solid ${status === s ? '#2c6ecb' : '#e1e3e5'}`, borderRadius: 10, cursor: 'pointer', background: status === s ? '#ebf5ff' : '#fff', transition: 'all .15s' }}>
              <input type="radio" name="status" value={s} checked={status === s} onChange={() => setStatus(s)} style={{ accentColor: '#2c6ecb' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: status === s ? '#2c6ecb' : '#1a1a1a' }}>{STATUS_LABELS[s]}</span>
            </label>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '9px 18px', border: '1px solid #e1e3e5', borderRadius: 8, fontSize: 13, fontWeight: 600, background: '#fff', color: '#616161', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ padding: '9px 18px', background: '#2c6ecb', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', cursor: saving ? 'wait' : 'pointer', opacity: saving ? .7 : 1 }}>
            {saving ? 'Saving…' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete confirm ────────────────────────────────────────────────────────────

function DeleteConfirm({ trip, onClose, onDeleted }: { trip: Trip; onClose: () => void; onDeleted: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function handleDelete() {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/api/admin/trips/${trip.id}`, { method: 'DELETE', headers: authHeaders() });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Delete failed (${res.status})`);
      }
      onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete trip. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 400, padding: 28, boxShadow: '0 24px 64px rgba(26,26,26,.18)' }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FFF5F5', border: '1px solid #FCA5A5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Trash2 size={18} color="#DC2626" />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>Delete trip?</h3>
        <p style={{ fontSize: 13, color: '#616161', lineHeight: 1.6, marginBottom: 20 }}>
          <strong style={{ color: '#1a1a1a' }}>{trip.destination_flag} {trip.name}</strong> will be permanently deleted.
          {trip.user && <span> (owned by {trip.user.name})</span>}
        </p>
        {error && <p style={{ fontSize: 12, color: '#DC2626', marginBottom: 12 }}>{error}</p>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '9px 18px', border: '1px solid #e1e3e5', borderRadius: 8, fontSize: 13, fontWeight: 600, background: '#fff', color: '#616161', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleDelete} disabled={loading} style={{ padding: '9px 18px', background: '#DC2626', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', cursor: loading ? 'wait' : 'pointer', opacity: loading ? .7 : 1 }}>
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminTripsPage() {
  const [trips, setTrips]       = useState<Trip[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType,   setFilterType]   = useState('');
  const [modal, setModal]       = useState<'status' | 'delete' | null>(null);
  const [selected, setSelected] = useState<Trip | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams();
      if (search)       params.set('search', search);
      if (filterStatus) params.set('status', filterStatus);
      if (filterType)   params.set('travel_type', filterType);
      const res  = await fetch(`${API}/api/admin/trips?${params}`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setTrips(data.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterType]);

  useEffect(() => { load(); }, [load]);

  function openStatus(t: Trip) { setSelected(t); setModal('status'); }
  function openDelete(t: Trip) { setSelected(t); setModal('delete'); }
  function closeModal() { setModal(null); setSelected(null); }
  function handleDone() { closeModal(); load(); }

  const selectStyle: React.CSSProperties = {
    padding: '8px 12px', border: '1px solid #e1e3e5', borderRadius: 10, fontSize: 13,
    background: '#f4f6f8', color: '#1a1a1a', outline: 'none', cursor: 'pointer',
  };

  const statusCounts = {
    draft:     trips.filter(t => t.status === 'draft').length,
    active:    trips.filter(t => t.status === 'active').length,
    completed: trips.filter(t => t.status === 'completed').length,
  };

  return (
    <div style={{ padding: 32 }}>
      <PageHeader
        icon={<Briefcase size={20} />}
        title="Trip Manager"
        description="View and manage all user trips across the platform"
      />

      {/* Summary cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Trips', value: trips.length, bg: '#ebf5ff', color: '#1D4ED8' },
          { label: 'Active', value: statusCounts.active, bg: '#ECFDF5', color: '#059669' },
          { label: 'Draft', value: statusCounts.draft, bg: '#f4f6f8', color: '#8a8a8a' },
          { label: 'Completed', value: statusCounts.completed, bg: '#FEF9C3', color: '#854D0E' },
        ].map(s => (
          <div key={s.label} style={{ padding: '14px 20px', background: s.bg, borderRadius: 12, minWidth: 100 }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: 11.5, color: s.color, fontWeight: 600, marginTop: 3, opacity: .8 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8a8a8a' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search trip name or destination…"
            style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #e1e3e5', borderRadius: 10, fontSize: 13, background: '#f4f6f8', color: '#1a1a1a', outline: 'none' }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={selectStyle}>
          <option value="">All Types</option>
          <option value="solo">Solo</option>
          <option value="couple">Couple</option>
          <option value="family">Family</option>
          <option value="group">Group</option>
        </select>
        <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', border: '1px solid #e1e3e5', borderRadius: 10, fontSize: 13, background: '#fff', color: '#616161', cursor: 'pointer' }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3, 4, 5].map(i => <div key={i} style={{ height: 60, background: '#f4f6f8', borderRadius: 10, animation: 'pulse 1.5s infinite' }} />)}
        </div>
      ) : error ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', background: '#FFF5F5', border: '1px solid #FCA5A5', borderRadius: 12, color: '#DC2626', fontSize: 13 }}>
          <AlertCircle size={16} /> {error}
          <button onClick={load} style={{ marginLeft: 'auto', fontSize: 12, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
        </div>
      ) : trips.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8a8a8a' }}>
          <Briefcase size={36} style={{ margin: '0 auto 12px', opacity: .4 }} />
          <p style={{ fontSize: 14, fontWeight: 600, color: '#616161', marginBottom: 4 }}>No trips found</p>
          <p style={{ fontSize: 13 }}>Try adjusting your filters.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e1e3e5', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9F7F4' }}>
                {['Trip', 'User', 'Dates', 'Type', 'Status', 'Created', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '.04em', borderBottom: '1px solid #e1e3e5', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trips.map((trip, i) => {
                const typeColor = TYPE_COLORS[trip.travel_type] ?? { bg: '#f4f6f8', color: '#616161' };
                return (
                  <tr key={trip.id} style={{ borderBottom: i < trips.length - 1 ? '1px solid #e4e7eb' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f4f6f8')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>

                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 6, background: '#e4e7eb', fontSize: 10, fontWeight: 700, letterSpacing: '.05em', fontFamily: 'monospace', color: '#616161' }}>
                          {trip.destination_flag && /^[A-Za-z]{2}$/.test(trip.destination_flag.trim())
                            ? trip.destination_flag.trim().toUpperCase()
                            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}><circle cx="12" cy="12" r="9"/><path d="M12 3a15 15 0 010 18M3 12h18M3.6 8h16.8M3.6 16h16.8"/></svg>
                          }
                        </span>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.2 }}>{trip.name}</p>
                          <p style={{ fontSize: 11.5, color: '#8a8a8a', display: 'flex', alignItems: 'center', gap: 3, marginTop: 1 }}>
                            <MapPin size={10} />{trip.destination}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '12px 14px' }}>
                      {trip.user ? (
                        <div>
                          <p style={{ fontSize: 12.5, fontWeight: 600, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <User size={11} color="#8a8a8a" />{trip.user.name}
                          </p>
                          <p style={{ fontSize: 11, color: '#8a8a8a', marginTop: 1 }}>{trip.user.email}</p>
                        </div>
                      ) : <span style={{ color: '#8a8a8a', fontSize: 12 }}>—</span>}
                    </td>

                    <td style={{ padding: '12px 14px' }}>
                      {trip.start_date ? (
                        <div style={{ fontSize: 11.5, color: '#616161', display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={10} />{fmtDate(trip.start_date)}</span>
                          {trip.end_date && <span style={{ color: '#8a8a8a' }}>→ {fmtDate(trip.end_date)}</span>}
                        </div>
                      ) : <span style={{ color: '#8a8a8a', fontSize: 12 }}>Not set</span>}
                    </td>

                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '4px 10px', background: typeColor.bg, color: typeColor.color, borderRadius: 20, fontSize: 11.5, fontWeight: 600 }}>
                        {TYPE_LABELS[trip.travel_type]}
                      </span>
                    </td>

                    <td style={{ padding: '12px 14px' }}>
                      <Badge status={trip.status} config={STATUS_CONFIG} />
                    </td>

                    <td style={{ padding: '12px 14px', fontSize: 11.5, color: '#8a8a8a', whiteSpace: 'nowrap' }}>
                      {ago(trip.created_at)}
                    </td>

                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openStatus(trip)}
                          style={{ padding: '6px 10px', border: '1px solid #e1e3e5', borderRadius: 7, fontSize: 11.5, fontWeight: 600, color: '#2c6ecb', background: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Status
                        </button>
                        <button onClick={() => openDelete(trip)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', border: '1px solid #FCA5A5', borderRadius: 7, fontSize: 11.5, fontWeight: 600, color: '#DC2626', background: '#FFF5F5', cursor: 'pointer' }}>
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal === 'status' && selected && <StatusModal trip={selected} onClose={closeModal} onUpdated={handleDone} />}
      {modal === 'delete' && selected && <DeleteConfirm trip={selected} onClose={closeModal} onDeleted={handleDone} />}
    </div>
  );
}
