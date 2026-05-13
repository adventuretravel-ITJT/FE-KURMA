'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft, Save, Eye, EyeOff, Plus, Trash2, GripVertical,
  ChevronDown, ChevronUp, Clock, MapPin, X, CheckCircle2,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

function authHeaders() {
  const token = typeof window !== 'undefined'
    ? (localStorage.getItem('token') ?? document.cookie.match(/token=([^;]+)/)?.[1])
    : null;
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

function uid() { return Math.random().toString(36).slice(2, 9); }

// ── Types ─────────────────────────────────────────────────────────────────────

type TravelType = 'solo' | 'couple' | 'family' | 'group';
type ActivityType = 'activity' | 'transport' | 'hotel';
type ActivityCat = 'culture' | 'food' | 'nature' | 'shopping' | 'activity' | 'transport' | 'stay';

interface TemplateActivity {
  id: string;
  type: ActivityType;
  name: string;
  time?: string;
  cat?: ActivityCat;
  note?: string;
  cost?: number;
}

interface TemplateDay {
  id: string;
  num: number;
  label: string;
  city: string;
  acts: TemplateActivity[];
}

interface TemplateItineraryData {
  currency: string;
  days: TemplateDay[];
}

interface TemplateMeta {
  title: string;
  destination: string;
  destination_flag: string;
  travel_type: TravelType;
  duration_days: number;
  description: string;
  cover_image: string;
  tags: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CAT_COLORS: Record<string, { bg: string; color: string }> = {
  culture:   { bg: 'rgba(59,130,246,.08)',  color: '#1D4ED8' },
  food:      { bg: 'rgba(245,158,11,.08)',  color: '#92400E' },
  nature:    { bg: 'rgba(34,197,94,.08)',   color: '#166534' },
  shopping:  { bg: 'rgba(168,85,247,.08)',  color: '#7C3AED' },
  activity:  { bg: 'rgba(236,72,153,.08)', color: '#9D174D' },
  transport: { bg: 'rgba(139,92,246,.08)', color: '#5B21B6' },
  stay:      { bg: 'rgba(184,149,106,.10)', color: '#7A5E36' },
};

const TYPE_ICON: Record<ActivityType, string> = {
  activity:  '🎯',
  transport: '✈️',
  hotel:     '🏨',
};

// ── Activity form modal ───────────────────────────────────────────────────────

function ActivityForm({
  initial,
  onSave,
  onClose,
}: {
  initial?: TemplateActivity;
  onSave: (a: TemplateActivity) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<TemplateActivity>(
    initial ?? { id: uid(), type: 'activity', name: '', time: '', cat: 'culture', note: '', cost: undefined }
  );

  const set = (k: keyof TemplateActivity, v: string | number | undefined) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  function handleSave() {
    if (!form.name.trim()) return;
    onSave(form);
  }

  const labelStyle: React.CSSProperties = { fontSize: 11.5, fontWeight: 600, color: '#5C6B7A', marginBottom: 5, display: 'block', letterSpacing: '.02em' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid #E5DFD0', borderRadius: 9, fontSize: 13, color: '#0D1B2A', outline: 'none', background: '#FAFAF8', boxSizing: 'border-box' };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(13,27,42,.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 440, padding: 28, boxShadow: '0 24px 64px rgba(13,27,42,.18)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0D1B2A' }}>
            {initial ? 'Edit Aktivitas' : 'Tambah Aktivitas'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A95A2' }}><X size={16} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Type */}
          <div>
            <label style={labelStyle}>Tipe</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['activity', 'transport', 'hotel'] as ActivityType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => set('type', t)}
                  style={{
                    flex: 1, padding: '8px 6px', border: `1.5px solid ${form.type === t ? '#1E6091' : '#E5DFD0'}`,
                    borderRadius: 9, fontSize: 12, fontWeight: 600,
                    background: form.type === t ? '#F0F7FF' : '#fff',
                    color: form.type === t ? '#1E6091' : '#5C6B7A',
                    cursor: 'pointer', textTransform: 'capitalize',
                  }}
                >
                  {TYPE_ICON[t]} {t}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label style={labelStyle}>Nama Aktivitas *</label>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="cth: Kunjungi Senso-ji Temple"
              style={inputStyle}
            />
          </div>

          {/* Time + Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>Waktu</label>
              <input
                type="time"
                value={form.time ?? ''}
                onChange={(e) => set('time', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Kategori</label>
              <select
                value={form.cat ?? ''}
                onChange={(e) => set('cat', e.target.value as ActivityCat)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">— Pilih —</option>
                <option value="culture">🏛 Culture</option>
                <option value="food">🍜 Food</option>
                <option value="nature">🌿 Nature</option>
                <option value="shopping">🛍 Shopping</option>
                <option value="activity">🎯 Activity</option>
                <option value="transport">🚗 Transport</option>
                <option value="stay">🏨 Stay</option>
              </select>
            </div>
          </div>

          {/* Cost */}
          <div>
            <label style={labelStyle}>Estimasi Biaya (IDR, opsional)</label>
            <input
              type="number"
              min="0"
              value={form.cost ?? ''}
              onChange={(e) => set('cost', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="cth: 150000"
              style={inputStyle}
            />
          </div>

          {/* Note */}
          <div>
            <label style={labelStyle}>Catatan</label>
            <textarea
              value={form.note ?? ''}
              onChange={(e) => set('note', e.target.value)}
              placeholder="Tips atau informasi tambahan…"
              rows={2}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
          <button onClick={onClose} style={{ padding: '9px 18px', border: '1px solid #E5DFD0', borderRadius: 8, fontSize: 13, fontWeight: 600, background: '#fff', color: '#5C6B7A', cursor: 'pointer' }}>
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={!form.name.trim()}
            style={{ padding: '9px 18px', background: '#1E6091', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', cursor: !form.name.trim() ? 'not-allowed' : 'pointer', opacity: !form.name.trim() ? .6 : 1 }}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Day section ───────────────────────────────────────────────────────────────

function DaySection({
  day,
  onUpdateCity,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  onDeleteDay,
  canDelete,
}: {
  day: TemplateDay;
  onUpdateCity: (city: string) => void;
  onAddActivity: () => void;
  onEditActivity: (act: TemplateActivity) => void;
  onDeleteActivity: (id: string) => void;
  onDeleteDay: () => void;
  canDelete: boolean;
}) {
  const [expanded, setExpanded]   = useState(true);
  const [editCity, setEditCity]   = useState(false);
  const [cityDraft, setCityDraft] = useState(day.city);

  function commitCity() {
    setEditCity(false);
    if (cityDraft.trim()) onUpdateCity(cityDraft.trim());
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #E5DFD0', borderRadius: 12, overflow: 'hidden' }}>
      {/* Day header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
        background: '#F9F7F4', cursor: 'pointer',
      }} onClick={() => setExpanded((p) => !p)}>
        <GripVertical size={14} color="#C4BDB0" style={{ flexShrink: 0 }} />
        <div style={{ width: 28, height: 28, borderRadius: 8, background: '#1E6091', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{day.num}</span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }} onClick={(e) => e.stopPropagation()}>
          {editCity ? (
            <input
              autoFocus
              value={cityDraft}
              onChange={(e) => setCityDraft(e.target.value)}
              onBlur={commitCity}
              onKeyDown={(e) => { if (e.key === 'Enter') commitCity(); if (e.key === 'Escape') setEditCity(false); }}
              style={{ fontSize: 13, fontWeight: 600, color: '#0D1B2A', border: 'none', outline: 'none', background: 'transparent', width: '100%' }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0D1B2A' }}>{day.label}</span>
              <span style={{ fontSize: 12, color: '#8A95A2', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <MapPin size={10} />
                <span
                  style={{ cursor: 'text', textDecoration: 'underline dotted', textUnderlineOffset: 2 }}
                  onClick={(e) => { e.stopPropagation(); setEditCity(true); }}
                >
                  {day.city || 'Tambah kota'}
                </span>
              </span>
            </div>
          )}
        </div>

        <span style={{ fontSize: 11, color: '#8A95A2', flexShrink: 0 }}>{day.acts.length} aktivitas</span>

        {canDelete && (
          <button
            title="Hapus hari ini"
            onClick={(e) => { e.stopPropagation(); onDeleteDay(); }}
            style={{ width: 26, height: 26, border: '1px solid #FCA5A5', borderRadius: 6, background: '#FFF5F5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <Trash2 size={11} color="#DC2626" />
          </button>
        )}

        {expanded ? <ChevronUp size={14} color="#8A95A2" /> : <ChevronDown size={14} color="#8A95A2" />}
      </div>

      {/* Activities */}
      {expanded && (
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {day.acts.length === 0 && (
            <p style={{ fontSize: 12.5, color: '#8A95A2', textAlign: 'center', padding: '12px 0', fontStyle: 'italic' }}>
              Belum ada aktivitas — tambahkan di bawah
            </p>
          )}

          {day.acts.map((act) => {
            const cs = act.cat ? CAT_COLORS[act.cat] : null;
            return (
              <div
                key={act.id}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '10px 12px', border: '1px solid #EEE8DF', borderRadius: 9,
                  background: '#FAFAF8', transition: 'background .15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#F5F1E8')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#FAFAF8')}
              >
                <span style={{ fontSize: 16, flexShrink: 0, lineHeight: 1.3 }}>{TYPE_ICON[act.type]}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0D1B2A' }}>{act.name}</span>
                    {act.time && (
                      <span style={{ fontSize: 11, color: '#8A95A2', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                        <Clock size={9} />{act.time}
                      </span>
                    )}
                    {act.cat && cs && (
                      <span style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 20, background: cs.bg, color: cs.color, textTransform: 'capitalize' }}>
                        {act.cat}
                      </span>
                    )}
                    {act.cost !== undefined && (
                      <span style={{ fontSize: 11, color: act.cost === 0 ? '#059669' : '#5C6B7A' }}>
                        {act.cost === 0 ? 'Free' : `Rp ${act.cost.toLocaleString('id-ID')}`}
                      </span>
                    )}
                  </div>
                  {act.note && <p style={{ fontSize: 11.5, color: '#8A95A2', marginTop: 3, lineHeight: 1.4 }}>{act.note}</p>}
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button
                    onClick={() => onEditActivity(act)}
                    style={{ width: 26, height: 26, border: '1px solid #E5DFD0', borderRadius: 6, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E6091' }}
                  >
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: 11, height: 11 }}>
                      <path d="M8.5 1.5l2 2L3 11H1V9L8.5 1.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteActivity(act.id)}
                    style={{ width: 26, height: 26, border: '1px solid #FCA5A5', borderRadius: 6, background: '#FFF5F5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            );
          })}

          <button
            onClick={onAddActivity}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '9px', border: '1.5px dashed #C4BDB0', borderRadius: 9,
              background: 'transparent', fontSize: 12.5, fontWeight: 600, color: '#8A95A2',
              cursor: 'pointer', transition: 'all .15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1E6091'; e.currentTarget.style.color = '#1E6091'; e.currentTarget.style.background = 'rgba(30,96,145,.04)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#C4BDB0'; e.currentTarget.style.color = '#8A95A2'; e.currentTarget.style.background = 'transparent'; }}
          >
            <Plus size={13} /> Tambah Aktivitas
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main builder page ─────────────────────────────────────────────────────────

export default function TemplateBuilderPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const isNew  = params.id === 'new';

  const [loading, setLoading]   = useState(!isNew);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState('');
  const [published, setPublished] = useState(false);
  const [templateId, setTemplateId] = useState<number | null>(null);

  const [meta, setMeta] = useState<TemplateMeta>({
    title: '', destination: '', destination_flag: '', travel_type: 'solo',
    duration_days: 3, description: '', cover_image: '', tags: '',
  });

  const [itinerary, setItinerary] = useState<TemplateItineraryData>({
    currency: 'IDR',
    days: [],
  });

  const [actModal, setActModal] = useState<{
    dayId: string;
    editing?: TemplateActivity;
  } | null>(null);

  // Load existing template
  useEffect(() => {
    if (isNew) {
      // Start with duration_days days
      setItinerary({ currency: 'IDR', days: buildDays(3) });
      return;
    }
    (async () => {
      try {
        const res  = await fetch(`${API}/api/admin/templates/${params.id}`, { headers: authHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message ?? 'Not found');
        const t = data.data;
        setTemplateId(t.id);
        setPublished(t.is_published);
        setMeta({
          title:           t.title,
          destination:     t.destination,
          destination_flag: t.destination_flag ?? '',
          travel_type:     t.travel_type,
          duration_days:   t.duration_days,
          description:     t.description ?? '',
          cover_image:     t.cover_image ?? '',
          tags:            (t.tags ?? []).join(', '),
        });
        setItinerary(t.itinerary_data ?? { currency: 'IDR', days: buildDays(t.duration_days) });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load template');
      } finally {
        setLoading(false);
      }
    })();
  }, [isNew, params.id]);

  function buildDays(count: number): TemplateDay[] {
    return Array.from({ length: count }, (_, i) => ({
      id: uid(), num: i + 1, label: `Day ${i + 1}`, city: '', acts: [],
    }));
  }

  // Sync days when duration changes
  const handleDurationChange = useCallback((newDays: number) => {
    setMeta((p) => ({ ...p, duration_days: newDays }));
    setItinerary((prev) => {
      const current = prev.days;
      if (newDays > current.length) {
        const extra = Array.from({ length: newDays - current.length }, (_, i) => ({
          id: uid(), num: current.length + i + 1, label: `Day ${current.length + i + 1}`, city: '', acts: [],
        }));
        return { ...prev, days: [...current, ...extra] };
      }
      return { ...prev, days: current.slice(0, newDays).map((d, i) => ({ ...d, num: i + 1, label: `Day ${i + 1}` })) };
    });
  }, []);

  function updateDayCity(dayId: string, city: string) {
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map((d) => d.id === dayId ? { ...d, city } : d),
    }));
  }

  function addDay() {
    setItinerary((prev) => {
      const n = prev.days.length + 1;
      return { ...prev, days: [...prev.days, { id: uid(), num: n, label: `Day ${n}`, city: '', acts: [] }] };
    });
    setMeta((p) => ({ ...p, duration_days: p.duration_days + 1 }));
  }

  function deleteDay(dayId: string) {
    setItinerary((prev) => {
      const days = prev.days.filter((d) => d.id !== dayId).map((d, i) => ({ ...d, num: i + 1, label: `Day ${i + 1}` }));
      return { ...prev, days };
    });
    setMeta((p) => ({ ...p, duration_days: Math.max(1, p.duration_days - 1) }));
  }

  function openAddActivity(dayId: string) { setActModal({ dayId }); }
  function openEditActivity(dayId: string, act: TemplateActivity) { setActModal({ dayId, editing: act }); }

  function handleSaveActivity(act: TemplateActivity) {
    if (!actModal) return;
    const { dayId, editing } = actModal;
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map((d) => {
        if (d.id !== dayId) return d;
        const acts = editing
          ? d.acts.map((a) => (a.id === editing.id ? act : a))
          : [...d.acts, act];
        return { ...d, acts };
      }),
    }));
    setActModal(null);
  }

  function deleteActivity(dayId: string, actId: string) {
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.id === dayId ? { ...d, acts: d.acts.filter((a) => a.id !== actId) } : d
      ),
    }));
  }

  async function handleSave() {
    if (!meta.title.trim() || !meta.destination.trim()) {
      setError('Judul dan destinasi wajib diisi.');
      return;
    }
    setSaving(true); setError(''); setSaved(false);

    const payload = {
      title:            meta.title.trim(),
      destination:      meta.destination.trim(),
      destination_flag: meta.destination_flag.trim() || null,
      travel_type:      meta.travel_type,
      duration_days:    meta.duration_days,
      description:      meta.description.trim() || null,
      cover_image:      meta.cover_image.trim() || null,
      tags:             meta.tags.split(',').map((t) => t.trim()).filter(Boolean),
      itinerary_data:   itinerary,
    };

    try {
      let res: Response;
      if (isNew) {
        res = await fetch(`${API}/api/admin/templates`, {
          method: 'POST', headers: authHeaders(), body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API}/api/admin/templates/${params.id}`, {
          method: 'PUT', headers: authHeaders(), body: JSON.stringify(payload),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Save failed');
      setSaved(true);
      if (isNew) {
        router.replace(`/admin/templates/${data.data.id}`);
      }
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish() {
    if (isNew || !templateId) { setError('Simpan template terlebih dahulu.'); return; }
    try {
      const res  = await fetch(`${API}/api/admin/templates/${params.id}/publish`, {
        method: 'PATCH', headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setPublished(data.data.is_published);
    } catch {
      setError('Gagal mengubah status publish.');
    }
  }

  // ── Styles ────────────────────────────────────────────────────────────────

  const labelStyle: React.CSSProperties = {
    fontSize: 11.5, fontWeight: 600, color: '#5C6B7A',
    marginBottom: 5, display: 'block', letterSpacing: '.02em',
  };
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', border: '1px solid #E5DFD0',
    borderRadius: 9, fontSize: 13, color: '#0D1B2A', outline: 'none',
    background: '#FAFAF8', boxSizing: 'border-box', fontFamily: 'inherit',
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <div style={{ width: 32, height: 32, border: '3px solid #E5DFD0', borderTopColor: '#1E6091', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F1E8', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: '#fff', borderBottom: '1px solid #E5DFD0',
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px',
      }}>
        <button
          onClick={() => router.push('/admin/templates')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', border: '1px solid #E5DFD0', borderRadius: 8, fontSize: 13, color: '#5C6B7A', background: '#fff', cursor: 'pointer' }}
        >
          <ArrowLeft size={14} /> Kembali
        </button>

        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#0D1B2A', lineHeight: 1 }}>
            {isNew ? 'Template Baru' : meta.title || 'Edit Template'}
          </p>
          {!isNew && (
            <p style={{ fontSize: 11, color: '#8A95A2', marginTop: 2 }}>
              {meta.destination_flag} {meta.destination} · {meta.duration_days} hari
            </p>
          )}
        </div>

        {error && <p style={{ fontSize: 12, color: '#DC2626', maxWidth: 300 }}>{error}</p>}

        {saved && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#059669', fontWeight: 600 }}>
            <CheckCircle2 size={13} /> Tersimpan
          </span>
        )}

        {!isNew && (
          <button
            onClick={handleTogglePublish}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
              border: `1px solid ${published ? '#FCA5A5' : '#86EFAC'}`,
              borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: published ? '#FFF5F5' : '#F0FDF4',
              color: published ? '#DC2626' : '#059669', cursor: 'pointer',
            }}
          >
            {published ? <EyeOff size={13} /> : <Eye size={13} />}
            {published ? 'Unpublish' : 'Publish'}
          </button>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px',
            background: '#1E6091', border: 'none', borderRadius: 8,
            fontSize: 13, fontWeight: 600, color: '#fff',
            cursor: saving ? 'wait' : 'pointer', opacity: saving ? .7 : 1,
          }}
        >
          <Save size={13} /> {saving ? 'Menyimpan…' : 'Simpan'}
        </button>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'flex', flex: 1, gap: 0, overflow: 'hidden' }}>

        {/* ── Left: Meta panel ── */}
        <div style={{
          width: 320, flexShrink: 0, background: '#fff',
          borderRight: '1px solid #E5DFD0', overflowY: 'auto',
          padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 18,
        }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#0D1B2A', letterSpacing: '.05em', textTransform: 'uppercase', marginBottom: 14 }}>
              Info Template
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Judul Template *</label>
                <input
                  value={meta.title}
                  onChange={(e) => setMeta((p) => ({ ...p, title: e.target.value }))}
                  placeholder="cth: 7 Hari di Jepang"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 64px', gap: 8 }}>
                <div>
                  <label style={labelStyle}>Destinasi *</label>
                  <input
                    value={meta.destination}
                    onChange={(e) => setMeta((p) => ({ ...p, destination: e.target.value }))}
                    placeholder="cth: Jepang"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Flag</label>
                  <input
                    value={meta.destination_flag}
                    onChange={(e) => setMeta((p) => ({ ...p, destination_flag: e.target.value }))}
                    placeholder="🇯🇵"
                    style={{ ...inputStyle, textAlign: 'center', fontSize: 20, padding: '6px 8px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <label style={labelStyle}>Tipe Perjalanan</label>
                  <select
                    value={meta.travel_type}
                    onChange={(e) => setMeta((p) => ({ ...p, travel_type: e.target.value as TravelType }))}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="solo">Solo</option>
                    <option value="couple">Couple</option>
                    <option value="family">Family</option>
                    <option value="group">Group</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Durasi (hari)</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={meta.duration_days}
                    onChange={(e) => handleDurationChange(Math.max(1, Math.min(90, Number(e.target.value))))}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Deskripsi</label>
                <textarea
                  value={meta.description}
                  onChange={(e) => setMeta((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Jelaskan singkat template ini…"
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={labelStyle}>Cover Image URL</label>
                <input
                  value={meta.cover_image}
                  onChange={(e) => setMeta((p) => ({ ...p, cover_image: e.target.value }))}
                  placeholder="https://…"
                  style={inputStyle}
                />
                {meta.cover_image && (
                  <div style={{ marginTop: 8, height: 80, borderRadius: 8, overflow: 'hidden', border: '1px solid #E5DFD0' }}>
                    <img src={meta.cover_image} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>Tags (pisah dengan koma)</label>
                <input
                  value={meta.tags}
                  onChange={(e) => setMeta((p) => ({ ...p, tags: e.target.value }))}
                  placeholder="cth: kuliner, budaya, budget"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Publish status indicator */}
          {!isNew && (
            <div style={{ padding: '12px 14px', borderRadius: 10, background: published ? '#F0FDF4' : '#F5F3EF', border: `1px solid ${published ? '#86EFAC' : '#E5DFD0'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: published ? '#059669' : '#8A95A2' }}>
                {published ? <Eye size={12} /> : <EyeOff size={12} />}
                {published ? 'Template sudah dipublish' : 'Template masih draft'}
              </div>
              <p style={{ fontSize: 11, color: '#8A95A2', marginTop: 4, lineHeight: 1.4 }}>
                {published ? 'User bisa melihat dan menggunakan template ini.' : 'Hanya admin yang dapat melihat template ini.'}
              </p>
            </div>
          )}
        </div>

        {/* ── Right: Day builder ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#0D1B2A' }}>Itinerary Builder</p>
              <p style={{ fontSize: 12, color: '#8A95A2', marginTop: 2 }}>
                {itinerary.days.length} hari · {itinerary.days.reduce((s, d) => s + d.acts.length, 0)} aktivitas total
              </p>
            </div>
            <button
              onClick={addDay}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '8px 14px', border: '1px solid #E5DFD0', borderRadius: 9,
                fontSize: 13, fontWeight: 600, color: '#1E6091', background: '#EFF6FF', cursor: 'pointer',
              }}
            >
              <Plus size={13} /> Tambah Hari
            </button>
          </div>

          {itinerary.days.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8A95A2', border: '2px dashed #E5DFD0', borderRadius: 12 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#5C6B7A', marginBottom: 8 }}>Belum ada hari</p>
              <p style={{ fontSize: 13 }}>Tambah hari untuk mulai membangun itinerary.</p>
            </div>
          ) : (
            itinerary.days.map((day) => (
              <DaySection
                key={day.id}
                day={day}
                onUpdateCity={(city) => updateDayCity(day.id, city)}
                onAddActivity={() => openAddActivity(day.id)}
                onEditActivity={(act) => openEditActivity(day.id, act)}
                onDeleteActivity={(actId) => deleteActivity(day.id, actId)}
                onDeleteDay={() => deleteDay(day.id)}
                canDelete={itinerary.days.length > 1}
              />
            ))
          )}

          {itinerary.days.length > 0 && (
            <button
              onClick={addDay}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '12px', border: '2px dashed #C4BDB0', borderRadius: 12,
                background: 'transparent', fontSize: 13, fontWeight: 600, color: '#8A95A2',
                cursor: 'pointer', transition: 'all .15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1E6091'; e.currentTarget.style.color = '#1E6091'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#C4BDB0'; e.currentTarget.style.color = '#8A95A2'; }}
            >
              <Plus size={14} /> Tambah Hari
            </button>
          )}
        </div>
      </div>

      {/* Activity modal */}
      {actModal && (
        <ActivityForm
          initial={actModal.editing}
          onSave={handleSaveActivity}
          onClose={() => setActModal(null)}
        />
      )}
    </div>
  );
}
