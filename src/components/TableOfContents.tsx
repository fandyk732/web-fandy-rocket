'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import {
  extractHeadings,
  type HeadingItem,
} from '@/lib/headingUtils';

export default function TableOfContents({
  content,
}: {
  content: string;
}) {
  const [
    headings,
    setHeadings,
  ] = useState<HeadingItem[]>([]);

  const [
    activeId,
    setActiveId,
  ] = useState<string>('');

  /**
   * =========================
   * EXTRACT HEADINGS
   * =========================
   */
  useEffect(() => {
    const extracted =
      extractHeadings(content);

    setHeadings(extracted);
  }, [content]);

  /**
   * =========================
   * INTERSECTION OBSERVER
   * =========================
   */
  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const elements =
      headings
        .map((heading) =>
          document.getElementById(
            heading.id
          )
        )
        .filter(
          (
            element
          ): element is HTMLElement =>
            element !== null
        );

    if (elements.length === 0) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const visibleEntries =
            entries.filter(
              (entry) =>
                entry.isIntersecting
            );

          if (
            visibleEntries.length === 0
          ) {
            return;
          }

          /**
           * Ambil heading yang posisi
           * terdekat dengan bagian atas viewport.
           */
          const sorted =
            [...visibleEntries].sort(
              (a, b) =>
                a.boundingClientRect.top -
                b.boundingClientRect.top
            );

          const current =
            sorted[0];

          if (current?.target?.id) {
            setActiveId(
              current.target.id
            );
          }
        },
        {
          rootMargin:
            '-100px 0px -65% 0px',
          threshold: 0.1,
        }
      );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  /**
   * Tidak render TOC kalau artikel
   * tidak memiliki H2/H3.
   */
  if (headings.length === 0) {
    return null;
  }

  /**
   * =========================
   * RENDER
   * =========================
   */
  return (
    <nav
      aria-label="Daftar Isi"
      className="p-5 bg-card/40 border border-border/60 rounded-2xl backdrop-blur-md"
    >
      {/* Header */}
      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold border-b border-border/40 pb-3 mb-3">
        <span aria-hidden="true">
          📑
        </span>

        <span>Daftar Isi</span>
      </div>

      {/* Items */}
      <ul className="space-y-2.5 text-xs">
        {headings.map((heading) => {
          const isActive =
            activeId === heading.id;

          return (
            <li
              key={heading.id}
              className={
                heading.level === 3
                  ? 'pl-4'
                  : 'pl-0'
              }
            >
              <a
                href={`#${heading.id}`}
                onClick={(event) => {
                  event.preventDefault();

                  const element =
                    document.getElementById(
                      heading.id
                    );

                  if (!element) {
                    return;
                  }

                  element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });

                  setActiveId(
                    heading.id
                  );

                  /**
                   * Update URL hash tanpa
                   * membuat browser lompat.
                   */
                  window.history.replaceState(
                    null,
                    '',
                    `#${heading.id}`
                  );
                }}
                className={`
                  block
                  leading-relaxed
                  transition-all
                  hover:text-primary
                  ${
                    isActive
                      ? 'text-primary font-bold translate-x-1'
                      : 'text-muted-foreground hover:translate-x-0.5'
                  }
                `}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}