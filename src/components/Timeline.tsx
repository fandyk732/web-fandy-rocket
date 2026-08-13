import React from 'react';
import type { Experience } from '@/data/experience';

interface TimelineProps {
  items: Experience[];
}

const typeColors: Record<string, string> = {
  education: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  operations: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  finance: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  tech: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-6 top-0 bottom-0 w-px timeline-line" aria-hidden="true" />

      <div className="space-y-10">
        {items.map((item, index) => (
          <div key={item.id} className="relative flex gap-8 group">
            {/* Dot */}
            <div className="relative z-10 flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-card border-2 border-primary/40 flex items-center justify-center group-hover:border-primary transition-colors duration-300">
                <span className="mono-label text-primary" style={{ fontSize: '0.55rem' }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-start gap-3 mb-2">
                <h3 className="text-lg font-bold text-foreground leading-tight">
                  {item.role}
                </h3>
                <span className={`mono-label px-2.5 py-1 rounded-full border ${typeColors[item.type]}`}>
                  {item.type}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-base font-semibold text-primary">{item.organization}</span>
                <span className="w-1 h-1 rounded-full bg-border" aria-hidden="true" />
                <span className="mono-label text-muted-foreground">{item.period}</span>
                <span className="w-1 h-1 rounded-full bg-border" aria-hidden="true" />
                <span className="mono-label text-muted-foreground">{item.location}</span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {item.description}
              </p>

              <ul className="space-y-2">
                {item.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 flex-shrink-0" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}