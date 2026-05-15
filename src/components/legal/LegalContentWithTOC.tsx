'use client';

import { useEffect, useRef, useState } from 'react';

interface TocItem { text: string }

export default function LegalContentWithTOC({ html }: { html: string }) {
  const contentRef  = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  // Collect h2 headings, inject eyebrow divs for legacy HTML
  useEffect(() => {
    if (!contentRef.current) return;
    const headings = Array.from(contentRef.current.querySelectorAll('h2'));
    if (headings.length === 0) return;

    const items: TocItem[] = headings.map((h, i) => {
      const num = String(i + 1).padStart(2, '0');

      const prev = h.previousElementSibling;
      if (!prev || !prev.classList.contains('lp-section-eyebrow')) {
        let label = `Section ${num}`;
        // Legacy format: preceding <p> was used as eyebrow label — absorb & remove it
        if (prev && prev.tagName === 'P') {
          label = prev.textContent?.trim() || label;
          prev.parentElement?.removeChild(prev);
        }
        const eyebrow = document.createElement('div');
        eyebrow.className = 'lp-section-eyebrow';
        eyebrow.innerHTML = `<span class="lp-num">${num}</span><span>${label}</span>`;
        h.parentElement?.insertBefore(eyebrow, h);
      }

      return { text: h.textContent?.trim() || '' };
    });

    setToc(items);
  }, [html]);

  // Scroll spy — highlight active TOC item by index
  useEffect(() => {
    if (toc.length === 0) return;
    const onScroll = () => {
      if (!contentRef.current) return;
      const headings = Array.from(contentRef.current.querySelectorAll('h2'));
      let idx = 0;
      for (let i = 0; i < headings.length; i++) {
        if (headings[i].getBoundingClientRect().top <= 128) idx = i;
      }
      setActiveIdx(idx);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [toc]);

  function scrollToHeading(i: number) {
    const headings = contentRef.current?.querySelectorAll('h2');
    headings?.[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="lp-layout">
      {/* TOC sidebar */}
      <aside className="lp-toc" aria-label="Table of contents">
        <div className="lp-toc-eyebrow">Table of Contents</div>
        <ul className="lp-toc-list">
          {toc.map((item, i) => (
            <li key={i}>
              <a
                href={`#s${String(i + 1).padStart(2, '0')}`}
                className={activeIdx === i ? 'active' : ''}
                onClick={e => { e.preventDefault(); scrollToHeading(i); }}
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
