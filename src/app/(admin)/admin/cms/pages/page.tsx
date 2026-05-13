'use client';

import { useEffect, useState, useCallback } from 'react';
import { FileStack, Plus, Pencil, Trash2, Search, Eye, EyeOff, RefreshCw, X, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/PageHeader';

const API = process.env.NEXT_PUBLIC_API_URL;

function authHeaders() {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token') ?? document.cookie.match(/token=([^;]+)/)?.[1]
    : null;
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface LegalPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_description: string | null;
  is_published: boolean;
  published_at: string | null;
  updated_at: string;
}

const EMPTY: Omit<LegalPage, 'id' | 'updated_at' | 'published_at'> = {
  title: '', slug: '', content: '', meta_description: '', is_published: false,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function PageModal({
  page, onClose, onSaved,
}: { page: LegalPage | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!page;
  const [form, setForm] = useState({
    title:            page?.title            ?? '',
    slug:             page?.slug             ?? '',
    content:          page?.content          ?? '',
    meta_description: page?.meta_description ?? '',
    is_published:     page?.is_published     ?? false,
  });
  const [slugManual, setSlugManual] = useState(isEdit);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  function setField<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function handleTitleChange(v: string) {
    setField('title', v);
    if (!slugManual) setField('slug', slugify(v));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.content.trim()) { setError('Content is required.'); return; }
    setSaving(true); setError('');
    try {
      const url  = isEdit ? `${API}/api/admin/legal-pages/${page!.id}` : `${API}/api/admin/legal-pages`;
      const res  = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: authHeaders(), body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Save failed');
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', border: '1px solid #E5DFD0', borderRadius: 8,
    fontSize: 13, background: '#FAFAF8', color: '#0D1B2A', outline: 'none',
    fontFamily: 'var(--font-plus-jakarta-sans)',
  };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 600, color: '#5C6B7A', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.04em' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,27,42,.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 640, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(13,27,42,.18)' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #F0EBE1' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0D1B2A' }}>{isEdit ? 'Edit Page' : 'New Legal Page'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A95A2', padding: 4 }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#FFF5F5', border: '1px solid #FCA5A5', borderRadius: 8, fontSize: 12.5, color: '#DC2626' }}>
              <AlertCircle size={14} />{error}
            </div>
          )}

          <div>
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="e.g. Privacy Policy" required />
          </div>

          <div>
            <label style={{ ...labelStyle, display: 'flex', justifyContent: 'space-between' }}>
              <span>Slug</span>
              <button type="button" onClick={() => setSlugManual(v => !v)} style={{ fontSize: 10, fontWeight: 500, color: '#1E6091', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'none', letterSpacing: 0 }}>
                {slugManual ? 'Auto-generate' : 'Edit manually'}
              </button>
            </label>
            <input style={{ ...inputStyle, background: slugManual ? '#FAFAF8' : '#F5F3EF', color: slugManual ? '#0D1B2A' : '#8A95A2' }}
              value={form.slug} onChange={e => { setSlugManual(true); setField('slug', slugify(e.target.value)); }}
              readOnly={!slugManual} placeholder="auto-generated-from-title" />
          </div>

          <div>
            <label style={labelStyle}>Content *</label>
            <textarea style={{ ...inputStyle, minHeight: 200, resize: 'vertical', lineHeight: 1.6 }}
              value={form.content} onChange={e => setField('content', e.target.value)}
              placeholder="Write the full legal page content here..." required />
          </div>

          <div>
            <label style={labelStyle}>Meta Description</label>
            <input style={inputStyle} value={form.meta_description ?? ''} onChange={e => setField('meta_description', e.target.value)} placeholder="Short description for SEO (max 500 chars)" maxLength={500} />
            <p style={{ fontSize: 10.5, color: '#8A95A2', marginTop: 3 }}>{(form.meta_description ?? '').length}/500</p>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_published} onChange={e => setField('is_published', e.target.checked)}
              style={{ width: 16, height: 16, accentColor: '#1E6091', cursor: 'pointer' }} />
            <span style={{ fontSize: 13, color: '#0D1B2A', fontWeight: 500 }}>Publish immediately</span>
          </label>
        </form>

        <div style={{ padding: '16px 24px', borderTop: '1px solid #F0EBE1', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button type="button" onClick={onClose} style={{ padding: '9px 18px', border: '1px solid #E5DFD0', borderRadius: 8, fontSize: 13, fontWeight: 600, background: '#fff', color: '#5C6B7A', cursor: 'pointer' }}>Cancel</button>
          <button type="submit" form="legal-form" disabled={saving} onClick={handleSubmit}
            style={{ padding: '9px 20px', background: '#1E6091', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', cursor: saving ? 'wait' : 'pointer', opacity: saving ? .7 : 1 }}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create page'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete confirm ────────────────────────────────────────────────────────────

function DeleteConfirm({ page, onClose, onDeleted }: { page: LegalPage; onClose: () => void; onDeleted: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function handleDelete() {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/api/admin/legal-pages/${page.id}`, { method: 'DELETE', headers: authHeaders() });
      if (!res.ok) throw new Error('Delete failed');
      onDeleted();
    } catch {
      setError('Failed to delete page. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,27,42,.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 400, padding: 28, boxShadow: '0 24px 64px rgba(13,27,42,.18)' }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FFF5F5', border: '1px solid #FCA5A5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Trash2 size={18} color="#DC2626" />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0D1B2A', marginBottom: 8 }}>Delete page?</h3>
        <p style={{ fontSize: 13, color: '#5C6B7A', lineHeight: 1.6, marginBottom: 20 }}>
          <strong style={{ color: '#0D1B2A' }}>{page.title}</strong> will be permanently deleted. This action cannot be undone.
        </p>
        {error && <p style={{ fontSize: 12, color: '#DC2626', marginBottom: 12 }}>{error}</p>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '9px 18px', border: '1px solid #E5DFD0', borderRadius: 8, fontSize: 13, fontWeight: 600, background: '#fff', color: '#5C6B7A', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleDelete} disabled={loading} style={{ padding: '9px 18px', background: '#DC2626', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', cursor: loading ? 'wait' : 'pointer', opacity: loading ? .7 : 1 }}>
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function LegalPagesPage() {
  const [pages, setPages]       = useState<LegalPage[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState<'create' | 'edit' | 'delete' | null>(null);
  const [selected, setSelected] = useState<LegalPage | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const res  = await fetch(`${API}/api/admin/legal-pages?${params}`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPages(data.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pages');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const filtered = pages.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase())
  );

  function openEdit(p: LegalPage) { setSelected(p); setModal('edit'); }
  function openDelete(p: LegalPage) { setSelected(p); setModal('delete'); }
  function closeModal() { setModal(null); setSelected(null); }
  function handleSaved() { closeModal(); load(); }

  return (
    <div style={{ padding: 32 }}>
      <PageHeader
        icon={<FileStack size={20} />}
        title="Legal Pages"
        description="Manage privacy policy, terms of service, and other legal documents"
        action={
          <button onClick={() => setModal('create')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: '#1E6091', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
            <Plus size={15} /> New Page
          </button>
        }
      />

      {/* Slug guide */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, padding: '12px 16px', background: '#EEF4FA', borderRadius: 10, border: '1px solid #C3D9ED', fontSize: 12.5, color: '#1E6091' }}>
        <span style={{ fontWeight: 600, flexShrink: 0 }}>💡 Slug penting:</span>
        <span>Halaman <strong>Privacy Policy</strong> harus pakai slug <code style={{ background: '#fff', padding: '1px 6px', borderRadius: 4 }}>privacy-policy</code> · Halaman <strong>Terms of Service</strong> harus pakai slug <code style={{ background: '#fff', padding: '1px 6px', borderRadius: 4 }}>terms-of-service</code> agar tampil otomatis di halaman publik.</span>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8A95A2' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search pages…"
            style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #E5DFD0', borderRadius: 10, fontSize: 13, background: '#FAFAF8', color: '#0D1B2A', outline: 'none' }} />
        </div>
        <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', border: '1px solid #E5DFD0', borderRadius: 10, fontSize: 13, background: '#fff', color: '#5C6B7A', cursor: 'pointer' }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3].map(i => <div key={i} style={{ height: 52, background: '#F5F3EF', borderRadius: 10, animation: 'pulse 1.5s infinite' }} />)}
        </div>
      ) : error ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', background: '#FFF5F5', border: '1px solid #FCA5A5', borderRadius: 12, color: '#DC2626', fontSize: 13 }}>
          <AlertCircle size={16} /> {error}
          <button onClick={load} style={{ marginLeft: 'auto', fontSize: 12, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8A95A2' }}>
          <FileStack size={36} style={{ margin: '0 auto 12px', opacity: .4 }} />
          <p style={{ fontSize: 14, fontWeight: 600, color: '#5C6B7A', marginBottom: 4 }}>No pages yet</p>
          <p style={{ fontSize: 13 }}>Create your first legal page to get started.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #E5DFD0', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9F7F4' }}>
                {['Title', 'Slug', 'Status', 'Last Updated', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#8A95A2', textTransform: 'uppercase', letterSpacing: '.04em', borderBottom: '1px solid #E5DFD0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F0EBE1' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FAFAF8')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0D1B2A' }}>{p.title}</span>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <code style={{ fontSize: 11.5, color: '#5C6B7A', background: '#F5F3EF', padding: '3px 7px', borderRadius: 5 }}>{p.slug}</code>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, background: p.is_published ? '#ECFDF5' : '#F5F3EF', color: p.is_published ? '#059669' : '#8A95A2' }}>
                      {p.is_published ? <Eye size={11} /> : <EyeOff size={11} />}
                      {p.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 12.5, color: '#8A95A2' }}>{fmtDate(p.updated_at)}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(p)}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', border: '1px solid #E5DFD0', borderRadius: 7, fontSize: 12, fontWeight: 600, color: '#1E6091', background: '#fff', cursor: 'pointer' }}>
                        <Pencil size={12} /> Edit
                      </button>
                      <button onClick={() => openDelete(p)}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', border: '1px solid #FCA5A5', borderRadius: 7, fontSize: 12, fontWeight: 600, color: '#DC2626', background: '#FFF5F5', cursor: 'pointer' }}>
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(modal === 'create' || modal === 'edit') && (
        <PageModal page={modal === 'edit' ? selected : null} onClose={closeModal} onSaved={handleSaved} />
      )}
      {modal === 'delete' && selected && (
        <DeleteConfirm page={selected} onClose={closeModal} onDeleted={handleSaved} />
      )}
    </div>
  );
}
