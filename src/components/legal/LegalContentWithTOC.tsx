'use client';

import { useEffect, useRef, useState } from 'react';

interface TocItem { id: string; text: string }

export default function LegalContentWithTOC({ html }: { html: string }) {
  const contentRef            = useRef<HTMLDivElement>(null);
  const [toc, setToc]         = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');

  // Build TOC by scanning h2 elements after render
  useEffect(() => {
    if (!contentRef.current) return;
    const headings = Array.from(contentRef.current.querySelectorAll('h2'));
    const items: TocItem[] = headings.map((h, i) => {
      const id = `s${String(i + 1).padStart(2, '0')}`;
      h.id = id;
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
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
