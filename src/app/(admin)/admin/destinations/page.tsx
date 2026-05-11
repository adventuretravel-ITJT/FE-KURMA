'use client';

import { useEffect, useState, useCallback } from 'react';
import { Globe, Plus, Pencil, Trash2, Search, RefreshCw, X, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/PageHeader';

const API = process.env.NEXT_PUBLIC_API_URL;

function authHeaders() {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token') ?? document.cookie.match(/token=([^;]+)/)?.[1]
    : null;
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

interface CityGuide {
  id: number;
  name: string;
  country: string;
  country_code: string;
  flag_emoji: string | null;
  description: string | null;
  image_url: string | null;
  climate: string | null;
  best_time_to_visit: string | null;
  currency: string | null;
  timezone: string | null;
  language: string | null;
  highlights: string[];
  is_active: boolean;
  updated_at: string;
}

type CityForm = Omit<CityGuide, 'id' | 'updated_at'>;

const EMPTY_FORM: CityForm = {
  name: '', country: '', country_code: '', flag_emoji: '',
  description: '', image_url: '', climate: '', best_time_to_visit: '',
  currency: '', timezone: '', language: '', highlights: [], is_active: true,
};

// ── Modal ─────────────────────────────────────────────────────────────────────

function CityModal({ city, onClose, onSaved }: { city: CityGuide | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!city;
  const [form, setForm] = useState<CityForm>(
    city ? { name: city.name, country: city.country, country_code: city.country_code, flag_emoji: city.flag_emoji ?? '', description: city.description ?? '', image_url: city.image_url ?? '', climate: city.climate ?? '', best_time_to_visit: city.best_time_to_visit ?? '', currency: city.currency ?? '', timezone: city.timezone ?? '', language: city.language ?? '', highlights: city.highlights ?? [], is_active: city.is_active } : { ...EMPTY_FORM }
  );
  const [highlightInput, setHighlightInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  function setField<K extends keyof CityForm>(k: K, v: CityForm[K]) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function addHighlight() {
    const h = highlightInput.trim();
    if (h && !form.highlights.includes(h)) {
      setField('highlights', [...form.highlights, h]);
    }
    setHighlightInput('');
  }

  function removeHighlight(h: string) {
    setField('highlights', form.highlights.filter(x => x !== h));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError('City name is required.'); return; }
    if (!form.country.trim()) { setError('Country is required.'); return; }
    if (!form.country_code.trim()) { setError('Country code is required.'); return; }
    setSaving(true); setError('');
    try {
      const payload = { ...form, flag_emoji: form.flag_emoji || null, description: form.description || null, image_url: form.image_url || null, climate: form.climate || null, best_time_to_visit: form.best_time_to_visit || null, currency: form.currency || null, timezone: form.timezone || null, language: form.language || null };
      const url = isEdit ? `${API}/api/admin/city-guides/${city!.id}` : `${API}/api/admin/city-guides`;
      const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
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
  const row2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,27,42,.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 680, maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(13,27,42,.18)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #F0EBE1' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0D1B2A' }}>{isEdit ? 'Edit City Guide' : 'Add City Guide'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A95A2', padding: 4 }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#FFF5F5', border: '1px solid #FCA5A5', borderRadius: 8, fontSize: 12.5, color: '#DC2626' }}>
              <AlertCircle size={14} />{error}
            </div>
          )}

          <div style={row2}>
            <div>
              <label style={labelStyle}>City Name *</label>
              <input style={inputStyle} value={form.name} onChange={e => setField('name', e.target.value)} placeholder="e.g. Tokyo" required />
            </div>
            <div>
              <label style={labelStyle}>Flag Emoji</label>
              <input style={inputStyle} value={form.flag_emoji ?? ''} onChange={e => setField('flag_emoji', e.target.value)} placeholder="🇯🇵" maxLength={10} />
            </div>
          </div>

          <div style={row2}>
            <div>
              <label style={labelStyle}>Country *</label>
              <input style={inputStyle} value={form.country} onChange={e => setField('country', e.target.value)} placeholder="e.g. Japan" required />
            </div>
            <div>
              <label style={labelStyle}>Country Code *</label>
              <input style={inputStyle} value={form.country_code} onChange={e => setField('country_code', e.target.value.toUpperCase())} placeholder="JP" maxLength={5} required />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical', lineHeight: 1.6 }}
              value={form.description ?? ''} onChange={e => setField('description', e.target.value)}
              placeholder="Brief description of the city…" />
          </div>

          <div>
            <label style={labelStyle}>Image URL</label>
            <input style={inputStyle} value={form.image_url ?? ''} onChange={e => setField('image_url', e.target.value)} placeholder="https://…" />
          </div>

          <div style={row2}>
            <div>
              <label style={labelStyle}>Climate</label>
              <input style={inputStyle} value={form.climate ?? ''} onChange={e => setField('climate', e.target.value)} placeholder="e.g. Temperate" />
            </div>
            <div>
              <label style={labelStyle}>Best Time to Visit</label>
              <input style={inputStyle} value={form.best_time_to_visit ?? ''} onChange={e => setField('best_time_to_visit', e.target.value)} placeholder="e.g. March–May, Sep–Nov" />
            </div>
          </div>

          <div style={row2}>
            <div>
              <label style={labelStyle}>Currency</label>
              <input style={inputStyle} value={form.currency ?? ''} onChange={e => setField('currency', e.target.value)} placeholder="e.g. JPY (¥)" />
            </div>
            <div>
              <label style={labelStyle}>Timezone</label>
              <input style={inputStyle} value={form.timezone ?? ''} onChange={e => setField('timezone', e.target.value)} placeholder="e.g. Asia/Tokyo (UTC+9)" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Language</label>
            <input style={inputStyle} value={form.language ?? ''} onChange={e => setField('language', e.target.value)} placeholder="e.g. Japanese" />
          </div>

          <div>
            <label style={labelStyle}>Highlights</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input style={{ ...inputStyle, flex: 1 }} value={highlightInput} onChange={e => setHighlightInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addHighlight(); } }}
                placeholder="Add a highlight and press Enter or Add" />
              <button type="button" onClick={addHighlight}
                style={{ padding: '9px 14px', background: '#F0F7FF', border: '1px solid #BFDBFE', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#1E6091', cursor: 'pointer', flexShrink: 0 }}>
                Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {form.highlights.map(h => (
                <span key={h} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 20, fontSize: 12, color: '#1E6091' }}>
                  {h}
                  <button type="button" onClick={() => removeHighlight(h)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93C5FD', padding: 0, display: 'flex' }}><X size={11} /></button>
                </span>
              ))}
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_active} onChange={e => setField('is_active', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#1E6091', cursor: 'pointer' }} />
            <span style={{ fontSize: 13, color: '#0D1B2A', fontWeight: 500 }}>Active (visible to users)</span>
          </label>
        </form>

        <div style={{ padding: '16px 24px', borderTop: '1px solid #F0EBE1', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button type="button" onClick={onClose} style={{ padding: '9px 18px', border: '1px solid #E5DFD0', borderRadius: 8, fontSize: 13, fontWeight: 600, background: '#fff', color: '#5C6B7A', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={saving}
            style={{ padding: '9px 20px', background: '#1E6091', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', cursor: saving ? 'wait' : 'pointer', opacity: saving ? .7 : 1 }}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add city'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete confirm ────────────────────────────────────────────────────────────

function DeleteConfirm({ city, onClose, onDeleted }: { city: CityGuide; onClose: () => void; onDeleted: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function handleDelete() {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/api/admin/city-guides/${city.id}`, { method: 'DELETE', headers: authHeaders() });
      if (!res.ok) throw new Error('Delete failed');
      onDeleted();
    } catch {
      setError('Failed to delete. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,27,42,.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 400, padding: 28, boxShadow: '0 24px 64px rgba(13,27,42,.18)' }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FFF5F5', border: '1px solid #FCA5A5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Trash2 size={18} color="#DC2626" />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0D1B2A', marginBottom: 8 }}>Delete city guide?</h3>
        <p style={{ fontSize: 13, color: '#5C6B7A', lineHeight: 1.6, marginBottom: 20 }}>
          <strong style={{ color: '#0D1B2A' }}>{city.flag_emoji} {city.name}</strong> will be permanently deleted.
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

export default function DestinationsPage() {
  const [cities, setCities]     = useState<CityGuide[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [modal, setModal]       = useState<'create' | 'edit' | 'delete' | null>(null);
  const [selected, setSelected] = useState<CityGuide | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filterActive !== 'all') params.set('is_active', filterActive === 'active' ? 'true' : 'false');
      const res  = await fetch(`${API}/api/admin/city-guides?${params}`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCities(data.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load city guides');
    } finally {
      setLoading(false);
    }
  }, [search, filterActive]);

  useEffect(() => { load(); }, [load]);

  async function toggleActive(city: CityGuide) {
    try {
      const res = await fetch(`${API}/api/admin/city-guides/${city.id}`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify({ is_active: !city.is_active }),
      });
      if (!res.ok) throw new Error();
      setCities(prev => prev.map(c => c.id === city.id ? { ...c, is_active: !c.is_active } : c));
    } catch {
      alert('Failed to update status');
    }
  }

  function openEdit(c: CityGuide) { setSelected(c); setModal('edit'); }
  function openDelete(c: CityGuide) { setSelected(c); setModal('delete'); }
  function closeModal() { setModal(null); setSelected(null); }
  function handleSaved() { closeModal(); load(); }

  const filterBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '7px 14px', border: `1px solid ${active ? '#1E6091' : '#E5DFD0'}`,
    borderRadius: 8, fontSize: 12.5, fontWeight: 600,
    background: active ? '#EFF6FF' : '#fff', color: active ? '#1E6091' : '#5C6B7A', cursor: 'pointer',
  });

  return (
    <div style={{ padding: 32 }}>
      <PageHeader
        icon={<Globe size={20} />}
        title="Destination & City Guide"
        description="Manage city guides, local tips, and travel information"
        action={
          <button onClick={() => setModal('create')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: '#1E6091', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
            <Plus size={15} /> Add City
          </button>
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8A95A2' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cities or countries…"
            style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #E5DFD0', borderRadius: 10, fontSize: 13, background: '#FAFAF8', color: '#0D1B2A', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'active', 'inactive'] as const).map(f => (
            <button key={f} onClick={() => setFilterActive(f)} style={filterBtnStyle(filterActive === f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', border: '1px solid #E5DFD0', borderRadius: 10, fontSize: 13, background: '#fff', color: '#5C6B7A', cursor: 'pointer' }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Total', value: cities.length, color: '#1E6091', bg: '#EFF6FF' },
          { label: 'Active', value: cities.filter(c => c.is_active).length, color: '#059669', bg: '#ECFDF5' },
          { label: 'Inactive', value: cities.filter(c => !c.is_active).length, color: '#8A95A2', bg: '#F5F3EF' },
        ].map(s => (
          <div key={s.label} style={{ padding: '10px 18px', background: s.bg, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</span>
            <span style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} style={{ height: 120, background: '#F5F3EF', borderRadius: 12, animation: 'pulse 1.5s infinite' }} />)}
        </div>
      ) : error ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', background: '#FFF5F5', border: '1px solid #FCA5A5', borderRadius: 12, color: '#DC2626', fontSize: 13 }}>
          <AlertCircle size={16} /> {error}
          <button onClick={load} style={{ marginLeft: 'auto', fontSize: 12, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
        </div>
      ) : cities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8A95A2' }}>
          <Globe size={36} style={{ margin: '0 auto 12px', opacity: .4 }} />
          <p style={{ fontSize: 14, fontWeight: 600, color: '#5C6B7A', marginBottom: 4 }}>No city guides yet</p>
          <p style={{ fontSize: 13 }}>Add your first city to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {cities.map(city => (
            <div key={city.id} style={{ background: '#fff', border: '1px solid #E5DFD0', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, opacity: city.is_active ? 1 : .65 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 28, lineHeight: 1 }}>{city.flag_emoji || '🌍'}</div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#0D1B2A', lineHeight: 1.2 }}>{city.name}</p>
                    <p style={{ fontSize: 12, color: '#8A95A2' }}>{city.country} · {city.country_code}</p>
                  </div>
                </div>
                <button onClick={() => toggleActive(city)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: city.is_active ? '#059669' : '#8A95A2', flexShrink: 0, display: 'flex', alignItems: 'center' }} title={city.is_active ? 'Deactivate' : 'Activate'}>
                  {city.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                </button>
              </div>

              {city.description && (
                <p style={{ fontSize: 12, color: '#5C6B7A', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as React.CSSProperties['WebkitBoxOrient'] }}>
                  {city.description}
                </p>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {city.climate && <span style={{ fontSize: 11, padding: '3px 8px', background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 20, color: '#16A34A' }}>🌤 {city.climate}</span>}
                {city.currency && <span style={{ fontSize: 11, padding: '3px 8px', background: '#FEF9C3', border: '1px solid #FDE047', borderRadius: 20, color: '#CA8A04' }}>💰 {city.currency}</span>}
                {city.best_time_to_visit && <span style={{ fontSize: 11, padding: '3px 8px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 20, color: '#1D4ED8' }}>📅 {city.best_time_to_visit}</span>}
              </div>

              <div style={{ display: 'flex', gap: 7, marginTop: 'auto', paddingTop: 8, borderTop: '1px solid #F0EBE1' }}>
                <button onClick={() => openEdit(city)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px', border: '1px solid #E5DFD0', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#1E6091', background: '#fff', cursor: 'pointer' }}>
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => openDelete(city)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px', border: '1px solid #FCA5A5', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#DC2626', background: '#FFF5F5', cursor: 'pointer' }}>
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(modal === 'create' || modal === 'edit') && (
        <CityModal city={modal === 'edit' ? selected : null} onClose={closeModal} onSaved={handleSaved} />
      )}
      {modal === 'delete' && selected && (
        <DeleteConfirm city={selected} onClose={closeModal} onDeleted={handleSaved} />
      )}
    </div>
  );
}
