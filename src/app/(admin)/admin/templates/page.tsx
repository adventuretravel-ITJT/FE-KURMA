'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutTemplate, Search, Plus, Globe, Clock,
  Eye, EyeOff, Pencil, Trash2, RefreshCw, AlertCircle, Users,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/PageHeader';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

function authHeaders() {
  const token = typeof window !== 'undefined'
    ? (localStorage.getItem('token') ?? document.cookie.match(/token=([^;]+)/)?.[1])
    : null;
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

function ago(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface Template {
  id: number;
  title: string;
  destination: string;
  destination_flag: string | null;
  travel_type: 'solo' | 'couple' | 'family' | 'group';
  duration_days: number;
  description: string | null;
  cover_image: string | null;
  tags: string[] | null;
  is_published: boolean;
  updated_at: string;
  creator: { id: number; name: string } | null;
}

interface Meta {
  total: number; per_page: number; current_page: number; last_page: number;
}

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  solo:   { bg: '#ebf5ff', color: '#1D4ED8' },
  couple: { bg: '#FDF2F8', color: '#9D174D' },
  family: { bg: '#FEF9C3', color: '#854D0E' },
  group:  { bg: '#F0FDF4', color: '#166534' },
};

// ── Delete confirm modal ──────────────────────────────────────────────────────

function DeleteModal({ template, onClose, onDeleted }: {
  template: Template; onClose: () => void; onDeleted: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function handleDelete() {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/api/admin/templates/${template.id}`, {
        method: 'DELETE', headers: authHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete');
      onDeleted();
    } catch {
      setError('Gagal menghapus template.');
      setLoading(false);
    }
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 400, padding: 28, boxShadow: '0 24px 64px rgba(26,26,26,.18)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FFF5F5', border: '1px solid #FCA5A5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Trash2 size={18} color="#DC2626" />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>Hapus template?</h3>
        <p style={{ fontSize: 13, color: '#616161', lineHeight: 1.6, marginBottom: 20 }}>
          <strong style={{ color: '#1a1a1a' }}>"{template.title}"</strong> akan dihapus permanen.
        </p>
        {error && <p style={{ fontSize: 12, color: '#DC2626', marginBottom: 12 }}>{error}</p>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '9px 18px', border: '1px solid #e1e3e5', borderRadius: 8, fontSize: 13, fontWeight: 600, background: '#fff', color: '#616161', cursor: 'pointer' }}>Batal</button>
          <button onClick={handleDelete} disabled={loading} style={{ padding: '9px 18px', background: '#DC2626', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', cursor: loading ? 'wait' : 'pointer', opacity: loading ? .7 : 1 }}>
            {loading ? 'Menghapus…' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Template card ─────────────────────────────────────────────────────────────

function TemplateCard({
  template, onEdit, onDelete, onTogglePublish,
}: {
  template: Template;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
}) {
  const tc = TYPE_COLORS[template.travel_type] ?? TYPE_COLORS.solo;

  return (
    <div style={{
      background: '#fff', border: '1px solid #e1e3e5', borderRadius: 14,
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      transition: 'box-shadow .2s', cursor: 'pointer',
    }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(26,26,26,.09)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
      onClick={onEdit}
    >
      {/* Cover */}
      <div style={{
        height: 140, background: template.cover_image
          ? `url(${template.cover_image}) center/cover`
          : 'linear-gradient(135deg, #2c6ecb, #1a4d8f)',
        position: 'relative', flexShrink: 0,
      }}>
        {/* Published badge */}
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
            background: template.is_published ? 'rgba(5,150,105,.9)' : 'rgba(0,0,0,.45)',
            color: '#fff', backdropFilter: 'blur(4px)',
          }}>
            {template.is_published ? <Eye size={10} /> : <EyeOff size={10} />}
            {template.is_published ? 'Published' : 'Draft'}
          </span>
        </div>
        {/* Flag overlay */}
        {template.destination_flag && (
          <div style={{ position: 'absolute', bottom: 10, left: 12, fontSize: 28 }}>
            {template.destination_flag}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: tc.bg, color: tc.color, textTransform: 'capitalize' }}>
            <Users size={9} style={{ display: 'inline', marginRight: 3 }} />{template.travel_type}
          </span>
          <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#f4f6f8', color: '#616161', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <Clock size={9} />{template.duration_days} hari
          </span>
        </div>

        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.3, marginBottom: 2 }}>
            {template.title}
          </p>
          <p style={{ fontSize: 12, color: '#8a8a8a', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Globe size={10} />{template.destination}
          </p>
        </div>

        {template.description && (
          <p style={{ fontSize: 12, color: '#616161', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {template.description}
          </p>
        )}

        {template.tags && template.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {template.tags.slice(0, 3).map((tag) => (
              <span key={tag} style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10.5, background: '#f4f6f8', color: '#8a8a8a' }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #e4e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: '#8a8a8a' }}>
            {template.creator?.name ?? 'Admin'} · {ago(template.updated_at)}
          </span>
          <div style={{ display: 'flex', gap: 4 }} onClick={(e) => e.stopPropagation()}>
            <button
              title={template.is_published ? 'Unpublish' : 'Publish'}
              onClick={onTogglePublish}
              style={{ width: 28, height: 28, border: '1px solid #e1e3e5', borderRadius: 7, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: template.is_published ? '#059669' : '#8a8a8a' }}
            >
              {template.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
            <button
              title="Edit"
              onClick={onEdit}
              style={{ width: 28, height: 28, border: '1px solid #e1e3e5', borderRadius: 7, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2c6ecb' }}
            >
              <Pencil size={12} />
            </button>
            <button
              title="Hapus"
              onClick={onDelete}
              style={{ width: 28, height: 28, border: '1px solid #FCA5A5', borderRadius: 7, background: '#FFF5F5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div style={{ background: '#fff', border: '1px solid #e1e3e5', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ height: 140, background: '#e4e7eb', animation: 'psk 1.4s ease infinite' }} />
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[100, 160, 120].map((w, i) => (
          <div key={i} style={{ height: 12, borderRadius: 6, background: '#e4e7eb', width: w, animation: 'psk 1.4s ease infinite' }} />
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function TemplatesPage() {
  const router = useRouter();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [meta, setMeta]           = useState<Meta>({ total: 0, per_page: 20, current_page: 1, last_page: 1 });
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  const [search, setSearch]             = useState('');
  const [filterType, setFilterType]     = useState('');
  const [filterPub, setFilterPub]       = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Template | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const q = new URLSearchParams();
      if (search)     q.set('search',      search);
      if (filterType) q.set('travel_type', filterType);
      if (filterPub)  q.set('published',   filterPub);
      const res  = await fetch(`${API}/api/admin/templates?${q}`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Failed');
      setTemplates(data.data ?? []);
      setMeta(data.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [search, filterType, filterPub]);

  useEffect(() => { load(); }, [load]);

  async function handleTogglePublish(t: Template) {
    try {
      const res = await fetch(`${API}/api/admin/templates/${t.id}/publish`, {
        method: 'PATCH', headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      setTemplates((prev) => prev.map((x) => x.id === t.id ? { ...x, is_published: !x.is_published } : x));
    } catch {
      alert('Gagal mengubah status publish.');
    }
  }

  const selectStyle: React.CSSProperties = {
    padding: '8px 12px', border: '1px solid #e1e3e5', borderRadius: 10, fontSize: 13,
    background: '#f4f6f8', color: '#1a1a1a', outline: 'none', cursor: 'pointer',
  };

  const publishedCount = templates.filter((t) => t.is_published).length;
  const draftCount     = templates.filter((t) => !t.is_published).length;

  return (
    <div style={{ padding: 32 }}>
      <PageHeader
        icon={<LayoutTemplate size={20} />}
        title="Master Templates"
        description="Buat template itinerary siap pakai untuk user"
        action={
          <button
            onClick={() => router.push('/admin/templates/new')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 16px', borderRadius: 8,
              background: '#2c6ecb', border: 'none',
              fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer',
            }}
          >
            <Plus size={14} /> Buat Template
          </button>
        }
      />

      {/* Summary */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Total',     value: meta.total,    bg: '#ebf5ff', color: '#1D4ED8' },
          { label: 'Published', value: publishedCount, bg: '#ECFDF5', color: '#059669' },
          { label: 'Draft',     value: draftCount,    bg: '#f4f6f8', color: '#8a8a8a' },
        ].map((s) => (
          <div key={s.label} style={{ padding: '14px 20px', background: s.bg, borderRadius: 12, minWidth: 100 }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: 11.5, color: s.color, fontWeight: 600, marginTop: 3, opacity: .8 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8a8a8a' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul atau destinasi…"
            style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #e1e3e5', borderRadius: 10, fontSize: 13, background: '#f4f6f8', color: '#1a1a1a', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={selectStyle}>
          <option value="">Semua Tipe</option>
          <option value="solo">Solo</option>
          <option value="couple">Couple</option>
          <option value="family">Family</option>
          <option value="group">Group</option>
        </select>

        <select value={filterPub} onChange={(e) => setFilterPub(e.target.value)} style={selectStyle}>
          <option value="">Semua Status</option>
          <option value="1">Published</option>
          <option value="0">Draft</option>
        </select>

        <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', border: '1px solid #e1e3e5', borderRadius: 10, fontSize: 13, background: '#fff', color: '#616161', cursor: 'pointer' }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', background: '#FFF5F5', border: '1px solid #FCA5A5', borderRadius: 12, color: '#DC2626', fontSize: 13, marginBottom: 20 }}>
          <AlertCircle size={16} /> {error}
          <button onClick={load} style={{ marginLeft: 'auto', fontSize: 12, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : templates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#8a8a8a' }}>
          <LayoutTemplate size={40} style={{ margin: '0 auto 14px', opacity: .35 }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: '#616161', marginBottom: 6 }}>Belum ada template</p>
          <p style={{ fontSize: 13, marginBottom: 20 }}>Mulai buat template itinerary pertama.</p>
          <button
            onClick={() => router.push('/admin/templates/new')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: '#2c6ecb', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer' }}
          >
            <Plus size={14} /> Buat Template
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {templates.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              onEdit={() => router.push(`/admin/templates/${t.id}`)}
              onDelete={() => setDeleteTarget(t)}
              onTogglePublish={() => handleTogglePublish(t)}
            />
          ))}
        </div>
      )}

      {deleteTarget && (
        <DeleteModal
          template={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => { setDeleteTarget(null); load(); }}
        />
      )}

      <style>{`
        @keyframes psk { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
    </div>
  );
}
