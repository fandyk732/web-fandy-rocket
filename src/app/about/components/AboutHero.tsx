import React from 'react';

export default function AboutHero() {
  return (
    <section className="relative pt-32 pb-16 px-6 lg:px-8 border-b border-border overflow-hidden" aria-label="About page header">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden="true" />
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at top left, rgba(200,169,110,0.06) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left */}
        <div className="flex flex-col gap-6">
          <span className="mono-label text-primary">About</span>
          <h1 className="section-heading text-foreground">
            More than a<br />
            <span className="text-gradient-gold">job title.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            I&apos;m Fandy Aziz — an educator who builds, a builder who teaches, and someone deeply invested in making technology accessible to vocational students in East Java.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            My work sits at the intersection of pedagogy and engineering. I don&apos;t just teach networking — I build the systems students use to learn it.
          </p>
        </div>

        {/* Right: Visual card */}
        <div className="relative">
          <div className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
            <div className="beam-border-h" aria-hidden="true" />
            <div className="relative z-10 flex flex-col gap-6">
              {/* Identity */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gradient-gold">FA</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Fandy Aziz</h2>
                  <p className="text-sm text-muted-foreground">East Java, Indonesia</p>
                </div>
              </div>

              {/* Role badges */}
              <div className="flex flex-wrap gap-2">
                {['Educator', 'Builder', 'Digital Explorer']?.map((role) => (
                  <span key={role} className="mono-label bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full">
                    {role}
                  </span>
                ))}
              </div>

              {/* Quick facts */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                {[
                  { l: 'Experience', v: '15+ years' },
                  { l: 'Focus', v: 'Vocational Ed' },
                  { l: 'Location', v: 'East Java' },
                  { l: 'Status', v: 'Building' },
                ]?.map((f) => (
                  <div key={f?.l}>
                    <p className="mono-label text-muted-foreground">{f?.l}</p>
                    <p className="text-sm font-semibold text-foreground mt-1">{f?.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}