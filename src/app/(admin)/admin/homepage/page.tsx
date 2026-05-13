'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Save, Upload, RefreshCw, AlertCircle, CheckCircle2, Layout } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { Card } from '@/components/admin/ui/Card';
import {
  fetchAdminHomepageContents,
  upsertHomepageSection,
  uploadHomepageImage,
} from '@/lib/homepageApi';
import type { HomepageContentItem } from '@/types/homepage';

// ── Section config ────────────────────────────────────────────────────────────

type FieldDef = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'json';
  placeholder?: string;
};

type SectionDef = {
  id: string;
  label: string;
  fields: FieldDef[];
};

const SECTIONS: SectionDef[] = [
  {
    id: 'navbar',
    label: 'Navbar',
    fields: [
      { key: 'logo_text',   label: 'Logo Text',    type: 'text' },
      { key: 'login_label', label: 'Login Label',  type: 'text' },
      { key: 'login_href',  label: 'Login URL',    type: 'text' },
      { key: 'cta_label',   label: 'CTA Label',    type: 'text' },
      { key: 'cta_href',    label: 'CTA URL',      type: 'text' },
      { key: 'links',       label: 'Nav Links',    type: 'json',
        placeholder: '[{"label":"How it works","href":"#how"}]' },
    ],
  },
  {
    id: 'hero',
    label: 'Hero',
    fields: [
      { key: 'label',                 label: 'Badge Label',           type: 'text' },
      { key: 'heading',               label: 'Heading',               type: 'textarea' },
      { key: 'subheading',            label: 'Subheading',            type: 'textarea' },
      { key: 'button_primary_label',  label: 'Primary Button Label',  type: 'text' },
      { key: 'button_primary_href',   label: 'Primary Button URL',    type: 'text' },
      { key: 'button_secondary_label',label: 'Secondary Button Label',type: 'text' },
      { key: 'button_secondary_href', label: 'Secondary Button URL',  type: 'text' },
      { key: 'image_url',             label: 'Hero Image',            type: 'image' },
      { key: 'image_alt',             label: 'Image Alt Text',        type: 'text' },
    ],
  },
  {
    id: 'trust_stats',
    label: 'Trust Stats',
    fields: [
      { key: 'label', label: 'Trust Label', type: 'text' },
      { key: 'items', label: 'Stats Items', type: 'json',
        placeholder: '[{"num":"200","suffix":"+","label":"Trips planned"}]' },
    ],
  },
  {
    id: 'how_it_works',
    label: 'How It Works',
    fields: [
      { key: 'heading',    label: 'Heading',    type: 'textarea' },
      { key: 'subheading', label: 'Subheading', type: 'textarea' },
      { key: 'steps',      label: 'Steps',      type: 'json',
        placeholder: '[{"num":"01","title":"Create your account","desc":"..."}]' },
    ],
  },
  {
    id: 'features',
    label: 'Features',
    fields: [
      { key: 'heading', label: 'Heading', type: 'textarea' },
      { key: 'items',   label: 'Feature Items', type: 'json',
        placeholder: '[{"title":"Day-by-day itinerary","desc":"...","color":"green"}]' },
    ],
  },
  {
    id: 'day_in_trip',
    label: 'Day in Trip',
    fields: [
      { key: 'heading',    label: 'Heading',    type: 'textarea' },
      { key: 'subheading', label: 'Subheading', type: 'textarea' },
      { key: 'steps', label: 'Steps', type: 'json',
        placeholder: '[{"id":"morning","time":"Morning · 08:00","title":"Check today\'s plan","desc":"..."}]' },
    ],
  },
  {
    id: 'faq',
    label: 'FAQ',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'items',   label: 'FAQ Items', type: 'json',
        placeholder: '[{"q":"What is kurmaGo?","a":"..."}]' },
    ],
  },
  {
    id: 'cta_section',
    label: 'CTA Section',
    fields: [
      { key: 'heading',      label: 'Heading',      type: 'textarea' },
      { key: 'subtitle',     label: 'Subtitle',     type: 'textarea' },
      { key: 'button_label', label: 'Button Label', type: 'text' },
      { key: 'button_href',  label: 'Button URL',   type: 'text' },
    ],
  },
  {
    id: 'footer',
    label: 'Footer',
    fields: [
      { key: 'logo_text',   label: 'Logo Text',    type: 'text' },
      { key: 'tagline',     label: 'Tagline',      type: 'text' },
      { key: 'nav_links',   label: 'Nav Links',    type: 'json',
        placeholder: '[{"label":"Itineraries","href":"#"}]' },
      { key: 'legal_links', label: 'Legal Links',  type: 'json',
        placeholder: '[{"label":"Privacy Policy","href":"/privacy"}]' },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function itemsToMap(items: HomepageContentItem[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const item of items) {
    map[item.key] = item.value ?? '';
  }
  return map;
}

function typeForKey(sectionId: string, key: string): 'text' | 'image' | 'json' {
  const section = SECTIONS.find((s) => s.id === sectionId);
  const field   = section?.fields.find((f) => f.key === key);
  if (!field) return 'text';
  if (field.type === 'json') return 'json';
  if (field.type === 'image') return 'image';
  return 'text';
}

function prettyJson(raw: string): string {
  try { return JSON.stringify(JSON.parse(raw), null, 2); } catch { return raw; }
}

// ── Field components ──────────────────────────────────────────────────────────

function TextField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C6B7A', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '9px 12px', borderRadius: 8,
          border: '1px solid #E5DFD0', fontSize: 13, color: '#0D1B2A',
          background: '#FAFAF7', outline: 'none', boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

function TextareaField({ label, value, onChange, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C6B7A', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        style={{
          width: '100%', padding: '9px 12px', borderRadius: 8,
          border: '1px solid #E5DFD0', fontSize: 13, color: '#0D1B2A',
          background: '#FAFAF7', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
          fontFamily: 'inherit',
        }}
      />
    </div>
  );
}

function JsonField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [error, setError] = useState('');

  const handleChange = (v: string) => {
    onChange(v);
    try { JSON.parse(v); setError(''); } catch { setError('JSON tidak valid'); }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#5C6B7A', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {label} <span style={{ color: '#8A95A2', textTransform: 'none', fontWeight: 400 }}>(JSON)</span>
        </label>
        {error && <span style={{ fontSize: 11, color: '#FF6B6B' }}>{error}</span>}
      </div>
      <textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        rows={8}
        spellCheck={false}
        style={{
          width: '100%', padding: '9px 12px', borderRadius: 8,
          border: `1px solid ${error ? '#FF6B6B' : '#E5DFD0'}`, fontSize: 12, color: '#0D1B2A',
          background: '#F5F1E8', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
          fontFamily: 'monospace',
        }}
      />
    </div>
  );
}

function ImageField({ label, value, onChange, sectionId }: {
  label: string; value: string; onChange: (v: string) => void; sectionId: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setUploadError('');
    try {
      const url = await uploadHomepageImage(file);
      onChange(url);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C6B7A', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </label>

      {/* URL input */}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="URL gambar atau upload di bawah"
        style={{
          width: '100%', padding: '9px 12px', borderRadius: 8,
          border: '1px solid #E5DFD0', fontSize: 13, color: '#0D1B2A',
          background: '#FAFAF7', outline: 'none', boxSizing: 'border-box',
        }}
      />

      {/* Preview + upload */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 10 }}>
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value.startsWith('/storage') ? `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}${value}` : value}
            alt="preview"
            style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #E5DFD0', flexShrink: 0 }}
          />
        )}
        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8,
              border: '1px solid #E5DFD0', background: '#fff',
              fontSize: 12, color: '#5C6B7A', cursor: 'pointer',
            }}
          >
            <Upload size={13} />{uploading ? 'Uploading…' : 'Upload Gambar'}
          </button>
          {uploadError && <p style={{ fontSize: 11, color: '#FF6B6B', marginTop: 4 }}>{uploadError}</p>}
          <p style={{ fontSize: 11, color: '#8A95A2', marginTop: 4 }}>Max 5 MB · JPEG, PNG, WebP</p>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
      />
    </div>
  );
}

// ── Section Editor ─────────────────────────────────────────────────────────────

function SectionEditor({ section, values, onChange, onSave, saving, saved }: {
  section: SectionDef;
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #E5DFD0' }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0D1B2A' }}>Section: {section.label}</h2>
          <p style={{ fontSize: 12, color: '#8A95A2', marginTop: 2 }}>
            Edit konten section <strong>{section.id}</strong> — perubahan langsung tampil di homepage setelah disimpan.
          </p>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '9px 18px', borderRadius: 8,
            background: saving ? '#8A95A2' : '#1E6091', color: '#fff',
            fontSize: 13, fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', border: 'none',
          }}
        >
          {saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
          {saving ? 'Menyimpan…' : saved ? 'Tersimpan' : 'Simpan'}
        </button>
      </div>

      <div style={{ padding: 24 }}>
        {section.fields.map((field) => {
          const val = values[field.key] ?? '';
          if (field.type === 'json') {
            return (
              <JsonField
                key={field.key}
                label={field.label}
                value={val}
                onChange={(v) => onChange(field.key, v)}
                placeholder={field.placeholder}
              />
            );
          }
          if (field.type === 'image') {
            return (
              <ImageField
                key={field.key}
                label={field.label}
                value={val}
                onChange={(v) => onChange(field.key, v)}
                sectionId={section.id}
              />
            );
          }
          if (field.type === 'textarea') {
            return (
              <TextareaField
                key={field.key}
                label={field.label}
                value={val}
                onChange={(v) => onChange(field.key, v)}
              />
            );
          }
          return (
            <TextField
              key={field.key}
              label={field.label}
              value={val}
              onChange={(v) => onChange(field.key, v)}
              placeholder={field.placeholder}
            />
          );
        })}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomepagePage() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [allValues, setAllValues]         = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [saving, setSaving]               = useState(false);
  const [saved, setSaved]                 = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Verify token exists before hitting the API
    const token = localStorage.getItem('token') ??
      document.cookie.split('; ').find(r => r.startsWith('token='))?.replace('token=', '');

    if (!token) {
      window.location.href = '/auth?redirect=/admin/homepage';
      return;
    }

    try {
      const items = await fetchAdminHomepageContents();
      const grouped: Record<string, Record<string, string>> = {};
      for (const item of items) {
        if (!grouped[item.section]) grouped[item.section] = {};
        const val = item.type === 'json' ? prettyJson(item.value ?? '') : (item.value ?? '');
        grouped[item.section][item.key] = val;
      }
      setAllValues(grouped);
    } catch (e) {
      const err = e as Error & { status?: number };
      if (err.status === 401 || err.status === 403) {
        // Token expired / invalid — clear and force re-login
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; max-age=0';
        window.location.href = '/auth?redirect=/admin/homepage';
        return;
      }
      setError(err.message ?? 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleChange = (key: string, value: string) => {
    setAllValues((prev) => ({
      ...prev,
      [activeSection]: { ...(prev[activeSection] ?? {}), [key]: value },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    const section = SECTIONS.find((s) => s.id === activeSection);
    if (!section) return;

    setSaving(true);
    try {
      const fields = section.fields.map((f, i) => ({
        key:   f.key,
        value: allValues[activeSection]?.[f.key] ?? '',
        type:  typeForKey(activeSection, f.key),
        order: i,
      }));
      await upsertHomepageSection(activeSection, fields);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const currentSection = SECTIONS.find((s) => s.id === activeSection)!;

  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Homepage Content"
        subtitle="Kelola semua konten yang tampil di halaman utama"
        action={
          <button
            onClick={load}
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

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderRadius: 10, background: '#FFF5F5', border: '1px solid #FFCCCC' }}>
          <AlertCircle size={16} color="#FF6B6B" />
          <span style={{ fontSize: 13, color: '#CC0000' }}>{error}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* Section selector */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <Card>
            <div style={{ padding: '12px 8px' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#8A95A2', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0 8px', marginBottom: 8 }}>
                Sections
              </p>
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  style={{
                    width: '100%', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 12px', borderRadius: 8, border: 'none',
                    fontSize: 13, cursor: 'pointer',
                    background: activeSection === s.id ? '#EEF4FA' : 'transparent',
                    color: activeSection === s.id ? '#1E6091' : '#5C6B7A',
                    fontWeight: activeSection === s.id ? 600 : 400,
                  }}
                >
                  <Layout size={14} style={{ flexShrink: 0 }} />
                  {s.label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Editor */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Card>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#8A95A2', fontSize: 13 }}>
                Memuat konten…
              </div>
            ) : (
              <SectionEditor
                section={currentSection}
                values={allValues[activeSection] ?? {}}
                onChange={handleChange}
                onSave={handleSave}
                saving={saving}
                saved={saved}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
