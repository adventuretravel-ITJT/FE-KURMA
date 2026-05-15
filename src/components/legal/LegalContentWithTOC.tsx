'use client';

import { useEffect, useRef, useState } from 'react';

interface TocItem { id: string; text: string }

export default function LegalContentWithTOC({ html }: { html: string }) {
  const contentRef            = useRef<HTMLDivElement>(null);
  const [toc, setToc]         = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');

  // Build TOC by scanning h2 elements after render.
  // If an h2 has no lp-section-eyebrow sibling before it, inject one automatically.
  useEffect(() => {
    if (!contentRef.current) return;
    const headings = Array.from(contentRef.current.querySelectorAll('h2'));
    const items: TocItem[] = headings.map((h, i) => {
      const id  = `s${String(i + 1).padStart(2, '0')}`;
      const num = String(i + 1).padStart(2, '0');
      h.id = id;

      const prev = h.previousElementSibling;
      if (!prev || !prev.classList.contains('lp-section-eyebrow')) {
        // If a <p> sits immediately before this h2, treat it as the eyebrow label
        // (legacy content format where eyebrow was typed as a plain paragraph)
        let label = `Section ${num}`;
        if (prev && prev.tagName === 'P') {
          label = prev.textContent?.trim() || label;
          prev.parentElement?.removeChild(prev);
        }
        const eyebrow = document.createElement('div');
        eyebrow.className = 'lp-section-eyebrow';
        eyebrow.innerHTML = `<span class="lp-num">${num}</span><span>${label}</span>`;
        h.parentElement?.insertBefore(eyebrow, h);
      }

      return { id, text: h.textContent?.trim() || '' };
    });
    setToc(items);
  }, [html]);

  // Scroll spy — highlight active TOC item
  useEffect(() => {
    if (toc.length === 0) return;
    const onScroll = () => {
      if (!contentRef.current) return;
      const headings = Array.from(contentRef.current.querySelectorAll('h2'));
      let current = headings[0]?.id ?? '';
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= 128) current = h.id;
      }
      setActiveId(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [toc]);

  return (
    <div className="lp-layout">
      {/* TOC sidebar */}
      <aside className="lp-toc" aria-label="Table of contents">
        <div className="lp-toc-eyebrow">Table of Contents</div>
        <ul className="lp-toc-list">
          {toc.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={activeId === item.id ? 'active' : ''}
                onClick={e => {
                  e.preventDefault();
                  const h2 = contentRef.current?.querySelector<HTMLElement>(`h2[id="${item.id}"]`);
                  h2?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                <span className="lp-num">{String(i + 1).padStart(2, '0')}</span>
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* Content */}
      <main
        ref={contentRef}
        className="lp-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
