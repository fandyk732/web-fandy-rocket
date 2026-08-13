import React from 'react';

export default function ProjectsHero() {
  return (
    <section className="relative pt-32 pb-16 px-6 lg:px-8 border-b border-border overflow-hidden" aria-label="Projects page header">
      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-50" aria-hidden="true" />
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at top right, rgba(200,169,110,0.05) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-7xl mx-auto">
        <span className="mono-label text-primary mb-4 block">Selected Work</span>
        <h1 className="section-heading text-foreground mb-6">
          Projects that matter.
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Digital systems built for real classrooms, real students, and real outcomes. Each project solves a specific problem in vocational education.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-8 mt-10 pt-10 border-t border-border">
          {[
            { v: '4', l: 'Projects Shipped' },
            { v: '3', l: 'In Production' },
            { v: '1', l: 'In Development' },
          ]?.map((s) => (
            <div key={s?.l} className="flex flex-col gap-1">
              <span className="text-3xl font-bold text-foreground tracking-tighter">{s?.v}</span>
              <span className="mono-label text-muted-foreground">{s?.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}