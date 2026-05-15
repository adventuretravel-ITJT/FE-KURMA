'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

export interface LegalSection {
  eyebrow: string;
  title: string;
  content: string;
}

interface Props {
  sections: LegalSection[];
  onChange: (sections: LegalSection[]) => void;
}

export default function LegalSectionsEditor({ sections, onChange }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);

  function update(index: number, field: keyof LegalSection, value: string) {
    onChange(sections.map((s, i) => i === index ? { ...s, [field]: value } : s));
  }

  function addSection() {
    const next = [...sections, { eyebrow: '', title: '', content: '' }];
    onChange(next);
    setExpanded(next.length - 1);
  }

  function remove(index: number) {
    onChange(sections.filter((_, i) => i !== index));
    setExpanded(prev => {
      if (prev === index) return null;
      if (prev !== null && prev > index) return prev - 1;
      return prev;
    });
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[target], next[index]] = [next[index], next[target]];
    onChange(next);
    setExpanded(prev =>
      prev === index ? target : prev === target ? index : prev
    );
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '8px 10px', border: '1px solid #E5DFD0', borderRadius: 6,
    fontSize: 13, background: '#FAFAF8', color: '#0D1B2A', outline: 'none',
    fontFamily: 'var(--font-plus-jakarta-sans)', boxSizing: 'border-box',
  };
  const lbl: React.CSSProperties = {
    display: 'block', fontSize: 10, fontWeight: 700, color: '#5C6B7A',
    marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.04em',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {sections.map((sec, i) => {
        const num = String(i + 1).padStart(2, '0');
        const isOpen = expanded === i;
        return (
          <div key={i} style={{ border: '1px solid #E5DFD0', borderRadius: 10, overflow: 'hidden' }}>
            {/* Header row */}
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '11px 14px', cursor: 'pointer',
                background: isOpen ? '#EEF4FA' : '#F9F8F5',
                borderBottom: isOpen ? '1px solid #E5DFD0' : 'none',
                userSelect: 'none',
              }}
              onClick={() => setExpanded(isOpen ? null : i)}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: '#8A95A2', minWidth: 22, flexShrink: 0 }}>{num}</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: sec.title ? '#0D1B2A' : '#B0BEC5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {sec.title || 'Judul belum diisi'}
              </span>
              <button type="button" onClick={e => { e.stopPropagation(); move(i, -1); }} disabled={i === 0}
                style={{ padding: '2px 7px', border: '1px solid #E5DFD0', borderRadius: 4, background: '#fff', cursor: i === 0 ? 'default' : 'pointer', opacity: i === 0 ? 0.3 : 1, fontSize: 12, flexShrink: 0 }}>↑</button>
              <button type="button" onClick={e => { e.stopPropagation(); move(i, 1); }} disabled={i === sections.length - 1}
                style={{ padding: '2px 7px', border: '1px solid #E5DFD0', borderRadius: 4, background: '#fff', cursor: i === sections.length - 1 ? 'default' : 'pointer', opacity: i === sections.length - 1 ? 0.3 : 1, fontSize: 12, flexShrink: 0 }}>↓</button>
              <button type="button" onClick={e => { e.stopPropagation(); remove(i); }}
                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', border: '1px solid #FCA5A5', borderRadius: 4, background: '#FFF5F5', color: '#DC2626', fontSize: 11, cursor: 'pointer', flexShrink: 0 }}>
                <Trash2 size={11} /> Hapus
              </button>
              {isOpen ? <ChevronUp size={14} color="#5C6B7A" style={{ flexShrink: 0 }} /> : <ChevronDown size={14} color="#5C6B7A" style={{ flexShrink: 0 }} />}
            </div>

            {/* Fields */}
            {isOpen && (
              <div style={{ padding: 16, background: '#fff', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={lbl}>Eyebrow <span style={{ fontWeight: 400, textTransform: 'none' }}>(mis. "Section One")</span></label>
                    <input style={inp} value={sec.eyebrow}
                      onChange={e => update(i, 'eyebrow', e.target.value)}
                      placeholder={`Section ${num}`} />
                  </div>
                  <div style={{ flex: 2 }}>
                    <label style={lbl}>Judul Section *</label>
                    <input style={inp} value={sec.title}
                      onChange={e => update(i, 'title', e.target.value)}
                      placeholder="Introduction" />
                  </div>
                </div>
                <div>
                  <label style={lbl}>Konten</label>
                  <RichTextEditor
                    value={sec.content}
                    onChange={html => update(i, 'content', html)}
                    placeholder="Tulis konten section ini…"
                    minHeight={200}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button type="button" onClick={addSection}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: '10px 16px', border: '1.5px dashed #B0BEC5', borderRadius: 10,
          background: 'transparent', color: '#5C6B7A', fontSize: 13, cursor: 'pointer',
          fontFamily: 'var(--font-plus-jakarta-sans)', marginTop: 2,
        }}>
        <Plus size={14} /> Tambah Section
      </button>
    </div>
  );
}
