import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-background text-foreground transition-colors duration-300"
      aria-label="Hero section"
    >
      {/* Animated grid background (Disesuaikan opacity-nya untuk light/dark) */}
      <div className="absolute inset-0 grid-bg opacity-30 dark:opacity-100 transition-opacity" aria-hidden="true" />
      
      {/* Noise texture */}
      <div className="absolute inset-0 noise-overlay opacity-20 dark:opacity-60 transition-opacity" aria-hidden="true" />
      
      {/* Radial glow (Emas lebih transparan di mode terang) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200,169,110,0.12) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to top, var(--background), transparent)' }}
        aria-hidden="true"
      />

      {/* Beam borders */}
      <div className="beam-border-h" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20 lg:pt-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left: Main content */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Location tag */}
            <div className="fade-slide-up-delay-1">
              <span className="inline-flex items-center gap-2 mono-label text-muted-foreground border border-border px-4 py-2 rounded-full bg-card/60 dark:bg-card/50 backdrop-blur-sm shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full status-dot-green" aria-hidden="true" />
                East Java, Indonesia
              </span>
            </div>

            {/* Main headline */}
            <div className="fade-slide-up-delay-2">
              <h1 className="hero-display text-foreground">
                FANDY
                <br />
                <span className="text-gradient-gold">AZIZ</span>
              </h1>
            </div>

            {/* Tagline */}
            <div className="fade-slide-up-delay-3">
              <p className="text-xl lg:text-2xl font-medium text-muted-foreground tracking-tight">
                Educator.{' '}
                <span className="text-foreground font-semibold">Builder.</span>{' '}
                Digital Explorer.
              </p>
            </div>

            {/* Supporting text */}
            <div className="fade-slide-up-delay-3">
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Building digital experiences for education through technology, vocational learning, and meaningful systems.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="fade-slide-up-delay-4 flex flex-col sm:flex-row gap-4">
              <Link
                href="/projects"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-accent transition-all duration-300 hover:scale-105 gold-glow-sm shadow-md"
              >
                Explore My Work
                <svg
                  className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-card text-foreground font-semibold rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all duration-300 shadow-sm"
              >
                About Me
              </Link>
            </div>
          </div>

          {/* Right: Stats sidebar */}
          <div className="lg:col-span-5 relative">
            {/* Vertical beam border */}
            <div className="hidden lg:block beam-border-v" aria-hidden="true" />

            <div className="lg:pl-12 flex flex-col gap-8">
              {/* Year badge */}
              <div className="flex items-center gap-3">
                <span className="mono-label text-muted-foreground">Since</span>
                <span className="text-4xl font-bold text-foreground tracking-tighter">2009</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-6">
                Over a decade building at the intersection of education and technology in vocational schools across East Java.
              </p>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-4 border-t border-border pt-6">
                {[
                  { value: '180+', label: 'Students' },
                  { value: '240+', label: 'Alumni' },
                  { value: '30+', label: 'Partners' },
                  { value: '4', label: 'Systems Built' },
                ]?.map((s) => (
                  <div key={s?.label} className="flex flex-col gap-1">
                    <span className="text-2xl font-bold text-foreground tracking-tighter">{s?.value}</span>
                    <span className="mono-label text-muted-foreground">{s?.label}</span>
                  </div>
                ))}
              </div>

              {/* Current role */}
              <div className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full status-dot-green mt-1 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Currently at SMK Al Kaaffah</p>
                  <p className="text-xs text-muted-foreground mt-1">Head of Computer Networking Department</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}