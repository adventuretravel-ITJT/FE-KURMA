'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  Bell, Send, Users, User, RefreshCw, AlertCircle, CheckCircle, Info,
  Search, X, Filter, Clock,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/PageHeader';

const API = process.env.NEXT_PUBLIC_API_URL;

function authHeaders() {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token') ?? document.cookie.match(/token=([^;]+)/)?.[1]
    : null;
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function highlight(text: string, query: string) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: '#FEF9C3', color: 'inherit', borderRadius: 2 }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

const TYPE_CONFIG: Record<string, { label: string; bg: string; color: string; icon: React.ReactNode }> = {
  info:    { label: 'Info',    bg: '#EFF6FF', color: '#1D4ED8', icon: <Info size={12} /> },
  success: { label: 'Success', bg: '#F0FDF4', color: '#166534', icon: <CheckCircle size={12} /> },
  warning: { label: 'Warning', bg: '#FFFBEB', color: '#92400E', icon: <AlertCircle size={12} /> },
};

interface BlastSender { id: number; name: string; email: string }
interface Blast {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  action_url: string | null;
  target: 'all' | 'specific';
  target_email: string | null;
  sent_count: number;
  created_at: string;
  sender: BlastSender | null;
}

interface PaginatedBlasts {
  data: Blast[];
  current_page: number;
  last_page: number;
  total: number;
}

const EMPTY_FORM = {
  title: '',
  message: '',
  type: 'info' as 'info' | 'success' | 'warning',
  action_url: '',
  target: 'all' as 'all' | 'specific',
  target_email: '',
};

const RECENT_KEY = 'blast_recent_searches';

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]'); } catch { return []; }
}
function saveRecent(q: string) {
  const list = [q, ...getRecent().filter(r => r !== q)].slice(0, 6);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list));
}
function removeRecent(q: string) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(getRecent().filter(r => r !== q)));
}

// ── Search box with suggestions ──────────────────────────────────────────────

interface SearchBoxProps {
  value: string;
  onChange: (v: string) => void;
  onCommit: (v: string) => void;
  suggestions: string[];
}

function SearchBox({ value, onChange, onCommit, suggestions }: SearchBoxProps) {
  const [open, setOpen]     = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecent(getRecent());
  }, [open]);

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  const filtered = useMemo(() => {
    if (!value.trim()) return [];
    return suggestions
      .filter(s => s.toLowerCase().includes(value.toLowerCase()) && s !== value)
      .slice(0, 6);
  }, [value, suggestions]);

  const showDropdown = open && (filtered.length > 0 || (value === '' && recent.length > 0));

  function pick(v: string) {
    onChange(v);
    onCommit(v);
    saveRecent(v);
    setRecent(getRecent());
    setOpen(false);
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (value.trim()) { saveRecent(value.trim()); setRecent(getRecent()); }
      onCommit(value);
      setOpen(false);
    }
    if (e.key === 'Escape') setOpen(false);
  }

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
      <Search
        size={14}
        style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--kg-ink-40)', pointerEvents: 'none' }}
      />
      <input
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKey}
        placeholder="Cari judul atau pesan..."
        style={{
          width: '100%', padding: '8px 32px 8px 34px',
          border: '1px solid var(--kg-hairline)',
          borderRadius: 9, fontSize: 13,
          background: 'var(--kg-paper)', color: 'var(--kg-ink)',
          outline: 'none', fontFamily: 'inherit',
          boxSizing: 'border-box',
        }}
      />
      {value && (
        <button
          onClick={() => { onChange(''); onCommit(''); setOpen(false); }}
          style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--kg-ink-40)', display: 'flex', alignItems: 'center', padding: 2,
          }}
        >
          <X size={12} />
        </button>
      )}

      {showDropdown && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: 'var(--kg-paper)',
          border: '1px solid var(--kg-hairline)',
          borderRadius: 10,
          boxShadow: '0 8px 24px rgba(13,27,42,.1)',
          zIndex: 50, overflow: 'hidden',
        }}>
          {/* Suggestions from data */}
          {filtered.length > 0 && (
            <>
              <div style={{ padding: '7px 12px 4px', fontSize: 10, fontWeight: 700, color: 'var(--kg-ink-40)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                Saran
              </div>
              {filtered.map(s => (
                <button
                  key={s}
                  onMouseDown={() => pick(s)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '8px 12px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 13, color: 'var(--kg-ink)',
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--kg-surface-mist)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                >
                  <Search size={12} style={{ color: 'var(--kg-ink-40)', flexShrink: 0 }} />
                  {highlight(s, value)}
                </button>
              ))}
            </>
          )}

          {/* Recent searches */}
          {value === '' && recent.length > 0 && (
            <>
              <div style={{ padding: '7px 12px 4px', fontSize: 10, fontWeight: 700, color: 'var(--kg-ink-40)', textTransform: 'uppercase', letterSpacing: '.5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Pencarian Terakhir</span>
                <button
                  onMouseDown={() => { localStorage.removeItem(RECENT_KEY); setRecent([]); }}
                  style={{ fontSize: 10, color: 'var(--kg-ink-40)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Hapus semua
                </button>
              </div>
              {recent.map(r => (
                <div
                  key={r}
                  style={{
                    display: 'flex', alignItems: 'center',
                    padding: '7px 12px',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--kg-surface-mist)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'none'; }}
                >
                  <button
                    onMouseDown={() => pick(r)}
                    style={{
                      flex: 1, textAlign: 'left', background: 'none', border: 'none',
                      cursor: 'pointer', fontSize: 13, color: 'var(--kg-ink)',
                      display: 'flex', alignItems: 'center', gap: 8,
                      fontFamily: 'inherit', padding: 0,
                    }}
                  >
                    <Clock size={12} style={{ color: 'var(--kg-ink-40)', flexShrink: 0 }} />
                    {r}
                  </button>
                  <button
                    onMouseDown={e => { e.stopPropagation(); removeRecent(r); setRecent(getRecent()); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--kg-ink-40)', padding: '0 4px', display: 'flex', alignItems: 'center' }}
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Pill filter button ────────────────────────────────────────────────────────

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '6px 13px', borderRadius: 100,
        border: `1px solid ${active ? 'var(--kg-primary)' : 'var(--kg-hairline)'}`,
        background: active ? 'var(--kg-primary)' : 'transparent',
        color: active ? '#fff' : 'var(--kg-ink-56)',
        cursor: 'pointer', fontSize: 12, fontWeight: 600,
        fontFamily: 'inherit', transition: 'all .15s',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  // Form state
  const [form, setForm]         = useState({ ...EMPTY_FORM });
  const [sending, setSending]   = useState(false);
  const [formError, setFormError]     = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // List + filter state
  const [blasts, setBlasts]         = useState<PaginatedBlasts | null>(null);
  const [allTitles, setAllTitles]   = useState<string[]>([]);  // for suggestions
  const [loadingList, setLoadingList] = useState(false);
  const [page, setPage]             = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchCommit, setSearchCommit] = useState('');
  const [filterType, setFilterType]   = useState('');
  const [filterTarget, setFilterTarget] = useState('');
  const [refreshTick, setRefreshTick] = useState(0);

  const hasFilters = searchCommit || filterType || filterTarget;

  const fetchBlasts = useCallback(async (p: number, q: string, type: string, target: string) => {
    setLoadingList(true);
    try {
      const params = new URLSearchParams({ page: String(p) });
      if (q)      params.set('search', q);
      if (type)   params.set('type', type);
      if (target) params.set('target', target);
      const res = await fetch(`${API}/api/admin/notification-blasts?${params}`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setBlasts(data);
        setPage(p);
      }
    } finally {
      setLoadingList(false);
    }
  }, []);

  // Re-fetch whenever filters or refreshTick change
  useEffect(() => {
    fetchBlasts(1, searchCommit, filterType, filterTarget);
  }, [fetchBlasts, searchCommit, filterType, filterTarget, refreshTick]);

  // Accumulate unique titles for search suggestions
  useEffect(() => {
    if (!blasts) return;
    setAllTitles(prev => {
      const set = new Set([...prev, ...blasts.data.map(b => b.title)]);
      return Array.from(set);
    });
  }, [blasts]);

  function applySearch(q: string) { setSearchCommit(q); }
  function applyType(t: string)   { setFilterType(prev => prev === t ? '' : t); }
  function applyTarget(t: string) { setFilterTarget(prev => prev === t ? '' : t); }

  function clearAll() {
    setSearchInput('');
    setSearchCommit('');
    setFilterType('');
    setFilterTarget('');
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!form.title.trim() || !form.message.trim()) {
      setFormError('Judul dan pesan wajib diisi.');
      return;
    }
    if (form.target === 'specific' && !form.target_email.trim()) {
      setFormError('Email target wajib diisi untuk blast specific.');
      return;
    }

    setSending(true);
    try {
      const body: Record<string, string> = {
        title:   form.title.trim(),
        message: form.message.trim(),
        type:    form.type,
        target:  form.target,
      };
      if (form.action_url.trim()) body.action_url = form.action_url.trim();
      if (form.target === 'specific') body.target_email = form.target_email.trim();

      const res  = await fetch(`${API}/api/admin/notification-blasts`, {
        method: 'POST', headers: authHeaders(), body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        const msg = data.message ?? Object.values(data.errors ?? {}).flat().join(', ');
        setFormError(msg || 'Gagal mengirim blast.');
        return;
      }

      setFormSuccess(`Blast berhasil dikirim ke ${data.sent_count} user.`);
      setForm({ ...EMPTY_FORM });
      // Re-trigger effect by toggling a counter
      setRefreshTick(t => t + 1);
    } catch {
      setFormError('Terjadi kesalahan jaringan.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <PageHeader
        icon={<Bell size={20} />}
        title="Notification Blast"
        subtitle="Kirim notifikasi ke semua user atau user tertentu"
        action={
          <button
            onClick={() => setRefreshTick(t => t + 1)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8,
              border: '1px solid var(--kg-hairline)',
              background: 'var(--kg-paper)', cursor: 'pointer',
              fontSize: 13, color: 'var(--kg-ink-56)',
              fontFamily: 'inherit',
            }}
          >
            <RefreshCw size={14} style={{ animation: loadingList ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        }
      />

      {/* ── Send Form ── */}
      <div style={{
        background: 'var(--kg-paper)',
        border: '1px solid var(--kg-hairline)',
        borderRadius: 14, padding: '20px 24px', marginBottom: 24,
      }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--kg-ink)', marginBottom: 16 }}>
          Kirim Blast Baru
        </h2>

        {formError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, marginBottom: 14, background: '#FEF2F2', border: '1px solid #FECACA', fontSize: 13, color: '#991B1B' }}>
            <AlertCircle size={15} /> {formError}
          </div>
        )}
        {formSuccess && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, marginBottom: 14, background: '#F0FDF4', border: '1px solid #BBF7D0', fontSize: 13, color: '#166534' }}>
            <CheckCircle size={15} /> {formSuccess}
          </div>
        )}

        <form onSubmit={handleSend}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Judul *</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Judul notifikasi" maxLength={200} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Tipe</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as typeof form.type }))} style={inputStyle}>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Pesan *</label>
            <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Isi notifikasi yang akan dikirim..." rows={3}
              style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Target</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['all', 'specific'] as const).map(t => (
                  <button key={t} type="button" onClick={() => setForm(f => ({ ...f, target: t, target_email: '' }))}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 8,
                      border: `1px solid ${form.target === t ? 'var(--kg-primary)' : 'var(--kg-hairline)'}`,
                      background: form.target === t ? 'var(--kg-primary)' : 'transparent',
                      color: form.target === t ? '#fff' : 'var(--kg-ink-56)',
                      cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      fontFamily: 'inherit', transition: 'all .15s',
                    }}>
                    {t === 'all' ? <><Users size={13} /> Semua User</> : <><User size={13} /> Specific</>}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>
                Email Target {form.target === 'specific' && <span style={{ color: '#EF4444' }}>*</span>}
              </label>
              <input type="email" value={form.target_email} onChange={e => setForm(f => ({ ...f, target_email: e.target.value }))}
                placeholder={form.target === 'all' ? 'Tidak diperlukan' : 'user@email.com'}
                disabled={form.target === 'all'}
                style={{ ...inputStyle, opacity: form.target === 'all' ? 0.5 : 1 }} />
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>URL Aksi (opsional)</label>
            <input type="url" value={form.action_url} onChange={e => setForm(f => ({ ...f, action_url: e.target.value }))}
              placeholder="https://..." style={inputStyle} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={sending}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 20px', borderRadius: 9,
                background: sending ? 'var(--kg-ink-40)' : 'var(--kg-primary)',
                border: 'none', color: '#fff',
                cursor: sending ? 'not-allowed' : 'pointer',
                fontSize: 13, fontWeight: 700, fontFamily: 'inherit', transition: 'background .15s',
              }}>
              <Send size={14} /> {sending ? 'Mengirim...' : 'Kirim Blast'}
            </button>
          </div>
        </form>
      </div>

      {/* ── History panel ── */}
      <div style={{
        background: 'var(--kg-paper)',
        border: '1px solid var(--kg-hairline)',
        borderRadius: 14, overflow: 'visible',
      }}>
        {/* Panel header */}
        <div style={{
          padding: '14px 20px', borderBottom: '1px solid var(--kg-hairline)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--kg-ink)' }}>
            Riwayat Blast
            {blasts && (
              <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 600, color: 'var(--kg-ink-40)' }}>
                {blasts.total} total
              </span>
            )}
          </span>

          {/* Search box */}
          <SearchBox
            value={searchInput}
            onChange={setSearchInput}
            onCommit={applySearch}
            suggestions={allTitles}
          />
        </div>

        {/* Filter bar */}
        <div style={{
          padding: '10px 20px', borderBottom: '1px solid var(--kg-hairline)',
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 12, color: 'var(--kg-ink-40)', display: 'flex', alignItems: 'center', gap: 4, marginRight: 4 }}>
            <Filter size={12} /> Filter:
          </span>

          {/* Type pills */}
          <Pill active={filterType === ''} onClick={() => setFilterType('')}>
            Semua Tipe
          </Pill>
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
            <Pill key={key} active={filterType === key} onClick={() => applyType(key)}>
              {cfg.icon} {cfg.label}
            </Pill>
          ))}

          <div style={{ width: 1, height: 18, background: 'var(--kg-hairline)', margin: '0 4px' }} />

          {/* Target pills */}
          <Pill active={filterTarget === ''} onClick={() => setFilterTarget('')}>
            Semua Target
          </Pill>
          <Pill active={filterTarget === 'all'} onClick={() => applyTarget('all')}>
            <Users size={11} /> Semua User
          </Pill>
          <Pill active={filterTarget === 'specific'} onClick={() => applyTarget('specific')}>
            <User size={11} /> Specific
          </Pill>

          {/* Clear all */}
          {hasFilters && (
            <button
              onClick={clearAll}
              style={{
                marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 11px', borderRadius: 100,
                border: '1px solid #FECACA', background: '#FEF2F2',
                color: '#991B1B', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                fontFamily: 'inherit',
              }}
            >
              <X size={11} /> Reset filter
            </button>
          )}
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div style={{
            padding: '8px 20px', borderBottom: '1px solid var(--kg-hairline)',
            display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 11, color: 'var(--kg-ink-40)' }}>Aktif:</span>
            {searchCommit && (
              <FilterChip label={`Cari: "${searchCommit}"`} onRemove={() => { setSearchInput(''); applySearch(''); }} />
            )}
            {filterType && (
              <FilterChip label={`Tipe: ${TYPE_CONFIG[filterType]?.label}`} onRemove={() => applyType(filterType)} />
            )}
            {filterTarget && (
              <FilterChip label={`Target: ${filterTarget === 'all' ? 'Semua User' : 'Specific'}`} onRemove={() => applyTarget(filterTarget)} />
            )}
          </div>
        )}

        {/* Table */}
        {loadingList ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--kg-ink-40)', fontSize: 13 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 480, margin: '0 auto' }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ height: 52, borderRadius: 8, background: 'var(--kg-surface-mist)', animation: 'pulse 1.4s ease-in-out infinite' }} />
              ))}
            </div>
          </div>
        ) : !blasts || blasts.data.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--kg-ink-40)', fontSize: 13 }}>
            <Bell size={28} style={{ margin: '0 auto 10px', opacity: .3, display: 'block' }} />
            <p style={{ fontWeight: 600, marginBottom: 4, color: 'var(--kg-ink-56)' }}>
              {hasFilters ? 'Tidak ada hasil yang cocok' : 'Belum ada blast yang dikirim'}
            </p>
            {hasFilters && (
              <button onClick={clearAll} style={{ fontSize: 12, color: 'var(--kg-primary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', marginTop: 4 }}>
                Hapus semua filter
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--kg-hairline)' }}>
                    {['Judul', 'Pesan', 'Tipe', 'Target', 'Dikirim ke', 'Oleh', 'Waktu'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--kg-ink-40)', textTransform: 'uppercase', letterSpacing: '.5px', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {blasts.data.map(b => {
                    const tc = TYPE_CONFIG[b.type] ?? TYPE_CONFIG.info;
                    return (
                      <tr
                        key={b.id}
                        style={{ borderBottom: '1px solid var(--kg-hairline)', transition: 'background .12s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--kg-surface-mist)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--kg-ink)', maxWidth: 180 }}>
                          {highlight(b.title, searchCommit)}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--kg-ink-56)', maxWidth: 240 }}>
                          <span title={b.message} style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {highlight(b.message, searchCommit)}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 100, background: tc.bg, color: tc.color, fontSize: 11, fontWeight: 700 }}>
                            {tc.icon} {tc.label}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 100, background: b.target === 'all' ? '#F0FDF4' : '#EFF6FF', color: b.target === 'all' ? '#166534' : '#1D4ED8', fontSize: 11, fontWeight: 600 }}>
                            {b.target === 'all' ? <><Users size={10} /> Semua</> : <><User size={10} /> {b.target_email}</>}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--kg-ink)', fontWeight: 600, textAlign: 'center' }}>
                          {b.sent_count}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--kg-ink-56)' }}>
                          {b.sender?.name ?? '—'}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--kg-ink-40)', whiteSpace: 'nowrap' }}>
                          {fmtDate(b.created_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {blasts.last_page > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '14px 20px', borderTop: '1px solid var(--kg-hairline)' }}>
                <button
                  onClick={() => fetchBlasts(page - 1)}
                  disabled={page === 1}
                  style={{ ...pageBtnStyle, opacity: page === 1 ? 0.4 : 1 }}
                >
                  ‹
                </button>
                {Array.from({ length: blasts.last_page }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => fetchBlasts(p)}
                    style={{ ...pageBtnStyle, border: `1px solid ${p === page ? 'var(--kg-primary)' : 'var(--kg-hairline)'}`, background: p === page ? 'var(--kg-primary)' : 'transparent', color: p === page ? '#fff' : 'var(--kg-ink-56)' }}>
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => fetchBlasts(page + 1)}
                  disabled={page === blasts.last_page}
                  style={{ ...pageBtnStyle, opacity: page === blasts.last_page ? 0.4 : 1 }}
                >
                  ›
                </button>
                <span style={{ fontSize: 12, color: 'var(--kg-ink-40)', marginLeft: 8 }}>
                  Halaman {page} dari {blasts.last_page}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 8px 3px 10px', borderRadius: 100,
      background: 'var(--kg-surface-mist)',
      border: '1px solid var(--kg-hairline)',
      fontSize: 11, fontWeight: 600, color: 'var(--kg-ink-56)',
    }}>
      {label}
      <button
        onClick={onRemove}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: 'var(--kg-ink-40)' }}
      >
        <X size={10} />
      </button>
    </span>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', borderRadius: 8,
  border: '1px solid var(--kg-hairline)',
  background: 'var(--kg-paper)', fontSize: 13, color: 'var(--kg-ink)',
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, color: 'var(--kg-ink-56)',
  display: 'block', marginBottom: 6,
};

const pageBtnStyle: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 7,
  border: '1px solid var(--kg-hairline)',
  background: 'transparent', color: 'var(--kg-ink-56)',
  cursor: 'pointer', fontSize: 13, fontWeight: 600,
  fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
