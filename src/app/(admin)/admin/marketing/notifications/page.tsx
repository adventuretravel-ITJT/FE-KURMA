'use client';

import { useEffect, useState, useCallback } from 'react';
import { Bell, Send, Users, User, RefreshCw, AlertCircle, CheckCircle, Info } from 'lucide-react';
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

export default function NotificationsPage() {
  const [blasts, setBlasts]     = useState<PaginatedBlasts | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [page, setPage]         = useState(1);
  const [form, setForm]         = useState({ ...EMPTY_FORM });
  const [sending, setSending]   = useState(false);
  const [formError, setFormError]   = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fetchBlasts = useCallback(async (p = 1) => {
    setLoadingList(true);
    try {
      const res = await fetch(`${API}/api/admin/notification-blasts?page=${p}`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setBlasts(data);
        setPage(p);
      }
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => { fetchBlasts(1); }, [fetchBlasts]);

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

      const res = await fetch(`${API}/api/admin/notification-blasts`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        const msg = data.message ?? Object.values(data.errors ?? {}).flat().join(', ');
        setFormError(msg || 'Gagal mengirim blast.');
        return;
      }

      setFormSuccess(`Blast berhasil dikirim ke ${data.sent_count} user.`);
      setForm({ ...EMPTY_FORM });
      fetchBlasts(1);
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
            onClick={() => fetchBlasts(page)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8,
              border: '1px solid var(--kg-hairline)',
              background: 'var(--kg-paper)', cursor: 'pointer',
              fontSize: 13, color: 'var(--kg-ink-56)',
              fontFamily: 'inherit',
            }}
          >
            <RefreshCw size={14} className={loadingList ? 'animate-spin' : ''} />
            Refresh
          </button>
        }
      />

      {/* Send Form */}
      <div style={{
        background: 'var(--kg-paper)',
        border: '1px solid var(--kg-hairline)',
        borderRadius: 14,
        padding: '20px 24px',
        marginBottom: 24,
      }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--kg-ink)', marginBottom: 16 }}>
          Kirim Blast Baru
        </h2>

        {formError && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', borderRadius: 8, marginBottom: 14,
            background: '#FEF2F2', border: '1px solid #FECACA',
            fontSize: 13, color: '#991B1B',
          }}>
            <AlertCircle size={15} /> {formError}
          </div>
        )}
        {formSuccess && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', borderRadius: 8, marginBottom: 14,
            background: '#F0FDF4', border: '1px solid #BBF7D0',
            fontSize: 13, color: '#166534',
          }}>
            <CheckCircle size={15} /> {formSuccess}
          </div>
        )}

        <form onSubmit={handleSend}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            {/* Title */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--kg-ink-56)', display: 'block', marginBottom: 6 }}>
                Judul *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Judul notifikasi"
                maxLength={200}
                style={inputStyle}
              />
            </div>

            {/* Type */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--kg-ink-56)', display: 'block', marginBottom: 6 }}>
                Tipe
              </label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value as typeof form.type }))}
                style={inputStyle}
              >
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--kg-ink-56)', display: 'block', marginBottom: 6 }}>
              Pesan *
            </label>
            <textarea
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Isi notifikasi yang akan dikirim..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            {/* Target */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--kg-ink-56)', display: 'block', marginBottom: 6 }}>
                Target
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['all', 'specific'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, target: t, target_email: '' }))}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 8,
                      border: `1px solid ${form.target === t ? 'var(--kg-primary)' : 'var(--kg-hairline)'}`,
                      background: form.target === t ? 'var(--kg-primary)' : 'transparent',
                      color: form.target === t ? '#fff' : 'var(--kg-ink-56)',
                      cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      fontFamily: 'inherit',
                      transition: 'all .15s',
                    }}
                  >
                    {t === 'all' ? <><Users size={13} /> Semua User</> : <><User size={13} /> Specific</>}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Email (if specific) */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--kg-ink-56)', display: 'block', marginBottom: 6 }}>
                Email Target {form.target === 'specific' && <span style={{ color: '#EF4444' }}>*</span>}
              </label>
              <input
                type="email"
                value={form.target_email}
                onChange={e => setForm(f => ({ ...f, target_email: e.target.value }))}
                placeholder={form.target === 'all' ? 'Tidak diperlukan' : 'user@email.com'}
                disabled={form.target === 'all'}
                style={{ ...inputStyle, opacity: form.target === 'all' ? 0.5 : 1 }}
              />
            </div>
          </div>

          {/* Action URL */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--kg-ink-56)', display: 'block', marginBottom: 6 }}>
              URL Aksi (opsional)
            </label>
            <input
              type="url"
              value={form.action_url}
              onChange={e => setForm(f => ({ ...f, action_url: e.target.value }))}
              placeholder="https://..."
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={sending}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 20px', borderRadius: 9,
                background: sending ? 'var(--kg-ink-40)' : 'var(--kg-primary)',
                border: 'none', color: '#fff',
                cursor: sending ? 'not-allowed' : 'pointer',
                fontSize: 13, fontWeight: 700,
                fontFamily: 'inherit',
                transition: 'background .15s',
              }}
            >
              <Send size={14} />
              {sending ? 'Mengirim...' : 'Kirim Blast'}
            </button>
          </div>
        </form>
      </div>

      {/* Blast History */}
      <div style={{
        background: 'var(--kg-paper)',
        border: '1px solid var(--kg-hairline)',
        borderRadius: 14,
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--kg-hairline)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--kg-ink)' }}>
            Riwayat Blast
          </span>
          {blasts && (
            <span style={{ fontSize: 12, color: 'var(--kg-ink-40)' }}>
              {blasts.total} blast dikirim
            </span>
          )}
        </div>

        {loadingList ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--kg-ink-40)', fontSize: 13 }}>
            Memuat...
          </div>
        ) : !blasts || blasts.data.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--kg-ink-40)', fontSize: 13 }}>
            <Bell size={28} style={{ margin: '0 auto 10px', opacity: .3 }} />
            <p>Belum ada blast yang dikirim</p>
          </div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--kg-hairline)' }}>
                  {['Judul', 'Pesan', 'Tipe', 'Target', 'Dikirim ke', 'Oleh', 'Waktu'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--kg-ink-40)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {blasts.data.map(b => {
                  const tc = TYPE_CONFIG[b.type] ?? TYPE_CONFIG.info;
                  return (
                    <tr key={b.id} style={{ borderBottom: '1px solid var(--kg-hairline)' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--kg-ink)', maxWidth: 160 }}>
                        {b.title}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--kg-ink-56)', maxWidth: 220 }}>
                        <span title={b.message} style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {b.message}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '3px 8px', borderRadius: 100,
                          background: tc.bg, color: tc.color,
                          fontSize: 11, fontWeight: 700,
                        }}>
                          {tc.icon} {tc.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '3px 8px', borderRadius: 100,
                          background: b.target === 'all' ? '#F0FDF4' : '#EFF6FF',
                          color: b.target === 'all' ? '#166534' : '#1D4ED8',
                          fontSize: 11, fontWeight: 600,
                        }}>
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

            {/* Pagination */}
            {blasts.last_page > 1 && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '14px 20px', borderTop: '1px solid var(--kg-hairline)',
              }}>
                {Array.from({ length: blasts.last_page }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => fetchBlasts(p)}
                    style={{
                      width: 32, height: 32, borderRadius: 7,
                      border: `1px solid ${p === page ? 'var(--kg-primary)' : 'var(--kg-hairline)'}`,
                      background: p === page ? 'var(--kg-primary)' : 'transparent',
                      color: p === page ? '#fff' : 'var(--kg-ink-56)',
                      cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      fontFamily: 'inherit',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid var(--kg-hairline)',
  background: 'var(--kg-paper)',
  fontSize: 13,
  color: 'var(--kg-ink)',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};
