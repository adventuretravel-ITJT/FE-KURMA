'use client';

import { useEffect, useState, useCallback } from 'react';
import { Save, CheckCircle2, AlertCircle, ExternalLink, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/PageHeader';

const API = process.env.NEXT_PUBLIC_API_URL;
const SLUG = 'terms-of-service';

function authHeaders() {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token') ?? document.cookie.match(/token=([^;]+)/)?.[1]
    : null;
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
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

export default function TermsEditor() {
  const [page, setPage]       = useState<LegalPage | null>(null);
  const [form, setForm]       = useState({ title: 'Terms of Service', meta_description: '', content: '', is_published: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res  = await fetch(`${API}/api/admin/legal-pages?search=${SLUG}`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Gagal memuat');
      const found: LegalPage | undefined = (data.data ?? []).find((p: LegalPage) => p.slug === SLUG);
      if (found) {
        setPage(found);
        setForm({ title: found.title, meta_description: found.meta_description ?? '', content: found.content, is_published: found.is_published });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSave() {
    if (!form.title.trim()) { setError('Title wajib diisi.'); return; }
    if (!form.content.trim()) { setError('Content wajib diisi.'); return; }
    setSaving(true); setError(''); setSaved(false);
    try {
      const isEdit = !!page;
      const url    = isEdit ? `${API}/api/admin/legal-pages/${page!.id}` : `${API}/api/admin/legal-pages`;
      const res    = await fetch(url, {
        method:  isEdit ? 'PUT' : 'POST',
        headers: authHeaders(),
        body:    JSON.stringify({ ...form, slug: SLUG }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Gagal menyimpan');
      setPage(data.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', border: '1px solid #E5DFD0', borderRadius: 8,
    fontSize: 13, background: '#FAFAF8', color: '#0D1B2A', outline: 'none',
    fontFamily: 'var(--font-plus-jakarta-sans)', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 600, color: '#5C6B7A',
    marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.04em',
  };

  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <PageHeader
        title="Terms of Service"
        subtitle="Edit konten halaman terms of service yang tampil di /terms"
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <a href="/terms" target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid #E5DFD0', borderRadius: 8, fontSize: 12, color: '#5C6B7A', background: '#fff', cursor: 'pointer', textDecoration: 'none' }}>
              <ExternalLink size={13} /> Preview
            </a>
            <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid #E5DFD0', borderRadius: 8, fontSize: 12, color: '#5C6B7A', background: '#fff', cursor: 'pointer' }}>
              <RefreshCw size={13} /> Refresh
            </button>
            <button onClick={handleSave} disabled={saving}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: saving ? '#8A95A2' : '#1E6091', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', cursor: saving ? 'wait' : 'pointer' }}>
              {saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
              {saving ? 'Menyimpan…' : saved ? 'Tersimpan!' : 'Simpan'}
            </button>
          </div>
        }
      />

      {/* Status badge */}
      {page && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, background: page.is_published ? '#ECFDF5' : '#F5F3EF', color: page.is_published ? '#059669' : '#8A95A2' }}>
            {page.is_published ? <Eye size={11} /> : <EyeOff size={11} />}
            {page.is_published ? 'Published' : 'Draft'}
          </span>
          {page.updated_at && (
            <span style={{ fontSize: 12, color: '#8A95A2' }}>
              Terakhir diupdate: {new Date(page.updated_at).toLocaleString('id-ID')}
            </span>
          )}
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: '#FFF5F5', border: '1px solid #FCA5A5', borderRadius: 10, fontSize: 13, color: '#DC2626', marginBottom: 20 }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#8A95A2', fontSize: 13 }}>Memuat konten…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, background: '#fff', border: '1px solid #E5DFD0', borderRadius: 12, padding: 28 }}>

          {/* Title */}
          <div>
            <label style={labelStyle}>Judul Halaman *</label>
            <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Terms of Service" />
          </div>

          {/* Meta description */}
          <div>
            <label style={labelStyle}>Meta Description <span style={{ fontWeight: 400, textTransform: 'none', color: '#8A95A2' }}>(untuk SEO & hero subtitle di halaman publik)</span></label>
            <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical', lineHeight: 1.6 }}
              value={form.meta_description ?? ''} onChange={e => setForm(f => ({ ...f, meta_description: e.target.value }))}
              placeholder="Deskripsi singkat yang tampil sebagai subtitle di halaman terms dan untuk SEO…" />
            <p style={{ fontSize: 11, color: '#8A95A2', marginTop: 3 }}>{(form.meta_description ?? '').length}/500 karakter</p>
          </div>

          {/* Content */}
          <div>
            <label style={labelStyle}>
              Konten *{' '}
              <span style={{ fontWeight: 400, textTransform: 'none', color: '#8A95A2' }}>(HTML — akan dirender langsung di halaman /terms)</span>
            </label>
            <div style={{ fontSize: 11.5, color: '#1E6091', background: '#EEF4FA', border: '1px solid #C3D9ED', borderRadius: 6, padding: '8px 12px', marginBottom: 8 }}>
              💡 Tulis konten dalam format HTML. Gunakan tag seperti <code>&lt;h2&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;ul&gt;&lt;li&gt;</code>, <code>&lt;section id="s01"&gt;</code> untuk membuat struktur yang rapi.
            </div>
            <textarea
              style={{ ...inputStyle, minHeight: 480, resize: 'vertical', lineHeight: 1.6, fontFamily: 'monospace', fontSize: 12 }}
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder={`<section id="s01">\n  <h2>Acceptance of Terms</h2>\n  <p>Your terms of service content here...</p>\n</section>\n\n<section id="s02">\n  <h2>The Service</h2>\n  <p>...</p>\n</section>`}
              spellCheck={false}
            />
          </div>

          {/* Publish toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', paddingTop: 4 }}>
            <input type="checkbox" checked={form.is_published} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
              style={{ width: 16, height: 16, accentColor: '#1E6091', cursor: 'pointer' }} />
            <div>
              <span style={{ fontSize: 13, color: '#0D1B2A', fontWeight: 600 }}>Publish halaman</span>
              <p style={{ fontSize: 11.5, color: '#8A95A2', marginTop: 2 }}>
                Jika dicentang, konten ini akan tampil di <strong>/terms</strong>. Jika tidak, halaman publik akan menampilkan konten default.
              </p>
            </div>
          </label>

          {/* Bottom save */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid #F0EBE1' }}>
            <button onClick={handleSave} disabled={saving}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px', background: saving ? '#8A95A2' : '#1E6091', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', cursor: saving ? 'wait' : 'pointer' }}>
              {saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
              {saving ? 'Menyimpan…' : saved ? 'Tersimpan!' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
