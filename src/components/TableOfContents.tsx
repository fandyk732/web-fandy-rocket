'use client';

import React, { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const lines = content.split('\n');
    const extractedHeadings: TOCItem[] = [];

    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].replace(/[*_~`]/g, '').trim();
        const id = text
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');

        extractedHeadings.push({ id, text, level });
      }
    });

    setHeadings(extractedHeadings);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0.1 }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="p-5 bg-card/40 border border-border/60 rounded-2xl backdrop-blur-md space-y-3">
      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold border-b border-border/40 pb-2.5">
        <span>📑</span> Daftar Isi
      </div>
      <ul className="space-y-2.5 text-xs">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li
              key={heading.id}
              className={heading.level === 3 ? 'pl-3' : 'pl-0'}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(heading.id);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                    setActiveId(heading.id);
                  }
                }}
                className={`block leading-relaxed transition-all hover:text-primary ${
                  isActive
                    ? 'text-primary font-bold translate-x-1'
                    : 'text-muted-foreground hover:translate-x-0.5'
                }`}
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