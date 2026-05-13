'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, X, Users, Briefcase, Globe, FileText,
  ArrowRight, Clock, Hash,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL;
const RECENT_KEY = 'admin_search_recent';
const MAX_RECENT = 8;

function authHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token') ?? document.cookie.match(/token=([^;]+)/)?.[1] ?? '';
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]'); } catch { return []; }
}
function pushRecent(q: string) {
  const list = [q, ...getRecent().filter(r => r !== q)].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list));
}
function clearRecent() { localStorage.removeItem(RECENT_KEY); }

type ResultType = 'user' | 'trip' | 'guide' | 'page';

interface SearchResult {
  type: ResultType;
  id: number;
  title: string;
  subtitle: string;
  meta: string | null;
  href: string;
}

const TYPE_CONFIG: Record<ResultType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  user:  { label: 'User',        icon: <Users size={13} />,    color: '#1D4ED8', bg: '#EFF6FF' },
  trip:  { label: 'Trip',        icon: <Briefcase size={13} />, color: '#166534', bg: '#F0FDF4' },
  guide: { label: 'Destinasi',   icon: <Globe size={13} />,    color: '#92400E', bg: '#FFFBEB' },
  page:  { label: 'Legal Page',  icon: <FileText size={13} />, color: '#6B21A8', bg: '#F5F3FF' },
};

const FILTER_TABS: { key: string; label: string }[] = [
  { key: 'all',    label: 'Semua' },
  { key: 'users',  label: 'Users' },
  { key: 'trips',  label: 'Trips' },
  { key: 'guides', label: 'Destinasi' },
  { key: 'pages',  label: 'Halaman' },
];

function highlight(text: string, query: string) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: '#FEF9C3', color: 'inherit', borderRadius: 2, padding: 0 }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const router = useRouter();
  const inputRef    = useRef<HTMLInputElement>(null);
  const listRef     = useRef<HTMLDivElement>(null);

  const [query, setQuery]       = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults]   = useState<SearchResult[]>([]);
  const [loading, setLoading]   = useState(false);
  const [recent, setRecent]     = useState<string[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setActiveTab('all');
      setActiveIdx(-1);
      setRecent(getRecent());
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Debounced search
  const doSearch = useCallback(async (q: string, tab: string) => {
    if (q.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams({ q, type: tab === 'all' ? 'all' : tab });
      const res = await fetch(`${API}/api/admin/search?${params}`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setResults(data.results ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => doSearch(query, activeTab), 300);
    return () => clearTimeout(t);
  }, [query, activeTab, doSearch]);

  // Keyboard nav
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return; }

      const items = results.length > 0 ? results : [];
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx(i => Math.min(i + 1, items.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx(i => Math.max(i - 1, -1));
      }
      if (e.key === 'Enter' && activeIdx >= 0 && items[activeIdx]) {
        navigate(items[activeIdx]);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, activeIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll active item into view
  useEffect(() => {
    if (activeIdx < 0 || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  function navigate(result: SearchResult) {
    pushRecent(query.trim());
    onClose();
    router.push(result.href);
  }

  function pickRecent(q: string) {
    setQuery(q);
    doSearch(q, activeTab);
  }

  function handleRemoveRecent(e: React.MouseEvent, item: string) {
    e.stopPropagation();
    const next = getRecent().filter(r => r !== item);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    setRecent(next);
  }

  if (!open) return null;

  const grouped = FILTER_TABS.slice(1).reduce<Record<string, SearchResult[]>>((acc, tab) => {
    acc[tab.key] = results.filter(r => {
      if (tab.key === 'users')  return r.type === 'user';
      if (tab.key === 'trips')  return r.type === 'trip';
      if (tab.key === 'guides') return r.type === 'guide';
      if (tab.key === 'pages')  return r.type === 'page';
      return false;
    });
    return acc;
  }, {});

  const displayResults = activeTab === 'all' ? results : (grouped[activeTab] ?? []);
  const isEmpty = !loading && query.length >= 2 && displayResults.length === 0;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(13,27,42,.5)',
          backdropFilter: 'blur(2px)',
          zIndex: 200,
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed',
        top: '12vh',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 600,
        zIndex: 201,
        borderRadius: 16,
        background: 'var(--kg-paper)',
        border: '1px solid var(--kg-hairline)',
        boxShadow: '0 24px 64px rgba(13,27,42,.2)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '72vh',
      }}>

        {/* Search input row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 16px',
          borderBottom: '1px solid var(--kg-hairline)',
        }}>
          <Search size={18} style={{ color: loading ? 'var(--kg-primary)' : 'var(--kg-ink-40)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIdx(-1); }}
            placeholder="Cari user, trip, destinasi, halaman..."
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: 15, background: 'transparent',
              color: 'var(--kg-ink)', fontFamily: 'inherit',
            }}
          />
          {query && (
            <button onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--kg-ink-40)', padding: 2, display: 'flex' }}>
              <X size={15} />
            </button>
          )}
          <kbd style={{
            padding: '3px 6px', borderRadius: 5,
            border: '1px solid var(--kg-hairline)',
            background: 'var(--kg-canvas)',
            fontSize: 11, color: 'var(--kg-ink-40)', fontFamily: 'inherit',
          }}>
            Esc
          </kbd>
        </div>

        {/* Filter tabs */}
        <div style={{
          display: 'flex', gap: 4, padding: '8px 14px',
          borderBottom: '1px solid var(--kg-hairline)',
          overflowX: 'auto',
        }}>
          {FILTER_TABS.map(tab => {
            const count = tab.key === 'all'
              ? results.length
              : (grouped[tab.key]?.length ?? 0);
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setActiveIdx(-1); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '5px 11px', borderRadius: 100, whiteSpace: 'nowrap',
                  border: `1px solid ${isActive ? 'var(--kg-primary)' : 'var(--kg-hairline)'}`,
                  background: isActive ? 'var(--kg-primary)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--kg-ink-56)',
                  cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  fontFamily: 'inherit', transition: 'all .12s',
                }}
              >
                {tab.label}
                {query.length >= 2 && count > 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    background: isActive ? 'rgba(255,255,255,.3)' : 'var(--kg-surface-mist)',
                    color: isActive ? '#fff' : 'var(--kg-ink-40)',
                    padding: '1px 5px', borderRadius: 100,
                  }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div ref={listRef} style={{ overflowY: 'auto', flex: 1 }}>

          {/* Empty state — no query yet */}
          {query.length < 2 && (
            <div style={{ padding: '6px 0' }}>
              {recent.length > 0 ? (
                <>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 16px 4px',
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--kg-ink-40)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                      Pencarian Terakhir
                    </span>
                    <button onClick={() => { clearRecent(); setRecent([]); }}
                      style={{ fontSize: 11, color: 'var(--kg-ink-40)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                      Hapus semua
                    </button>
                  </div>
                  {recent.map(r => (
                    <div
                      key={r}
                      onClick={() => pickRecent(r)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', cursor: 'pointer' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--kg-surface-mist)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'none'; }}
                    >
                      <Clock size={14} style={{ color: 'var(--kg-ink-40)', flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: 13, color: 'var(--kg-ink)' }}>{r}</span>
                      <button
                        onClick={e => handleRemoveRecent(e, r)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--kg-ink-40)', padding: 2, display: 'flex', alignItems: 'center' }}
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--kg-ink-40)', fontSize: 13 }}>
                  <Hash size={24} style={{ margin: '0 auto 10px', opacity: .3, display: 'block' }} />
                  Ketik minimal 2 karakter untuk mulai mencari
                </div>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && query.length >= 2 && (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--kg-ink-40)', fontSize: 13 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400, margin: '0 auto' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ height: 48, borderRadius: 8, background: 'var(--kg-surface-mist)', animation: 'pulse 1.4s ease-in-out infinite' }} />
                ))}
              </div>
            </div>
          )}

          {/* Empty results */}
          {isEmpty && (
            <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--kg-ink-40)', fontSize: 13 }}>
              <Search size={28} style={{ margin: '0 auto 10px', opacity: .25, display: 'block' }} />
              <p style={{ fontWeight: 600, color: 'var(--kg-ink-56)' }}>Tidak ada hasil untuk &ldquo;{query}&rdquo;</p>
              <p style={{ marginTop: 4, fontSize: 12 }}>Coba kata kunci lain atau ganti filter</p>
            </div>
          )}

          {/* Results — grouped by type when activeTab === 'all' */}
          {!loading && displayResults.length > 0 && (
            activeTab === 'all'
              ? renderGrouped(results, query, activeIdx, navigate)
              : renderFlat(displayResults, query, activeIdx, navigate)
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '8px 16px',
          borderTop: '1px solid var(--kg-hairline)',
          display: 'flex', alignItems: 'center', gap: 16,
          fontSize: 11, color: 'var(--kg-ink-40)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <kbd style={kbdStyle}>↑↓</kbd> navigasi
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <kbd style={kbdStyle}>Enter</kbd> buka
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <kbd style={kbdStyle}>Esc</kbd> tutup
          </span>
          {results.length > 0 && (
            <span style={{ marginLeft: 'auto' }}>
              {results.length} hasil ditemukan
            </span>
          )}
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }`}</style>
    </>
  );
}

// ── Render helpers ────────────────────────────────────────────────────────────

function renderGrouped(
  results: SearchResult[],
  query: string,
  activeIdx: number,
  onNavigate: (r: SearchResult) => void,
) {
  const groups: Record<string, SearchResult[]> = {};
  results.forEach((r, i) => {
    if (!groups[r.type]) groups[r.type] = [];
    groups[r.type].push({ ...r, _idx: i } as SearchResult & { _idx: number });
  });

  return (
    <div style={{ padding: '6px 0' }}>
      {Object.entries(groups).map(([type, items]) => {
        const cfg = TYPE_CONFIG[type as ResultType];
        return (
          <div key={type}>
            <div style={{ padding: '8px 16px 4px', fontSize: 10, fontWeight: 700, color: 'var(--kg-ink-40)', textTransform: 'uppercase', letterSpacing: '.5px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: cfg.color }}>{cfg.icon}</span>
              {cfg.label}
            </div>
            {items.map(item => {
              const globalIdx = results.indexOf(item);
              return <ResultRow key={item.id + type} result={item} query={query} isActive={activeIdx === globalIdx} idx={globalIdx} onNavigate={onNavigate} />;
            })}
          </div>
        );
      })}
    </div>
  );
}

function renderFlat(
  results: SearchResult[],
  query: string,
  activeIdx: number,
  onNavigate: (r: SearchResult) => void,
) {
  return (
    <div style={{ padding: '6px 0' }}>
      {results.map((r, i) => (
        <ResultRow key={r.id + r.type} result={r} query={query} isActive={activeIdx === i} idx={i} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

function ResultRow({ result, query, isActive, idx, onNavigate }: {
  result: SearchResult;
  query: string;
  isActive: boolean;
  idx: number;
  onNavigate: (r: SearchResult) => void;
}) {
  const cfg = TYPE_CONFIG[result.type];
  return (
    <div
      data-idx={idx}
      onClick={() => onNavigate(result)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '9px 16px',
        background: isActive ? 'var(--kg-surface-mist)' : 'transparent',
        cursor: 'pointer', transition: 'background .1s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--kg-surface-mist)'; }}
      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
    >
      {/* Type icon badge */}
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: cfg.bg, color: cfg.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {cfg.icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--kg-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {highlight(result.title, query)}
        </div>
        {result.subtitle && (
          <div style={{ fontSize: 11.5, color: 'var(--kg-ink-40)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>
            {highlight(result.subtitle, query)}
          </div>
        )}
      </div>

      {/* Meta badge */}
      {result.meta && (
        <span style={{
          padding: '2px 7px', borderRadius: 100,
          background: cfg.bg, color: cfg.color,
          fontSize: 10, fontWeight: 700, flexShrink: 0,
        }}>
          {result.meta}
        </span>
      )}

      <ArrowRight size={13} style={{ color: 'var(--kg-ink-40)', flexShrink: 0 }} />
    </div>
  );
}

const kbdStyle: React.CSSProperties = {
  padding: '2px 5px', borderRadius: 4,
  border: '1px solid var(--kg-hairline)',
  background: 'var(--kg-canvas)',
  fontFamily: 'inherit', fontSize: 10,
};
