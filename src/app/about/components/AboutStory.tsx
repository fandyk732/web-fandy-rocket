import React from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import SectionTitle from '@/components/SectionTitle';

const timelineEvents = [
  { year: '2009', event: 'Teaching begins', detail: 'First classroom at SMK Muhammadiyah. Built networking lab from scratch.' },
  { year: '2015', event: 'Network project experience', detail: 'Enterprise-level work on Bank Mandiri infrastructure. Bridged theory and practice.' },
  { year: '2016', event: 'Operations & Business', detail: 'Joined J&T Express. Learned systems thinking at scale across logistics.' },
  { year: '2021', event: 'SMK Al Kaaffah', detail: 'Returned to education with new tools. Started digitizing everything.' },
  { year: '2026', event: 'Digital Transformation', detail: 'Full digital ecosystem live. 240+ alumni tracked. 300+ students placed.' },
];

export default function AboutStory() {
  return (
    <section className="py-20 lg:py-24 px-6 lg:px-8 border-t border-border" aria-labelledby="story-title">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Left: Text */}
        <ScrollReveal>
          <div className="flex flex-col gap-8 lg:sticky lg:top-24">
            <SectionTitle
              label="The Story"
              title="Fifteen years in the making."
              id="story-title"
            />
            <p className="text-base text-muted-foreground leading-relaxed">
              I started teaching in 2009 with a whiteboard and a packet tracer simulation. What I didn&apos;t know then was that I&apos;d spend the next 15 years building a bridge between vocational education and the real digital world.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Every experience — from teaching basic networking to managing enterprise infrastructure at a bank, from logistics operations to digital transformation — fed back into my understanding of what education should actually prepare people for.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Today I build the systems I wish existed when I started teaching. Not because someone asked me to, but because the students deserve better tools.
            </p>
          </div>
        </ScrollReveal>

        {/* Right: Visual timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px timeline-line" aria-hidden="true" />

          <div className="space-y-8">
            {timelineEvents?.map((ev, i) => (
              <ScrollReveal key={ev?.year} delay={i * 100}>
                <div className="relative flex gap-8 group">
                  {/* Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-card border-2 border-border flex items-center justify-center group-hover:border-primary transition-colors duration-300">
                      <span className="w-2 h-2 rounded-full bg-primary/60 group-hover:bg-primary transition-colors duration-300" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-1 pb-2 flex-1">
                    <span className="mono-label text-primary">{ev?.year}</span>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {ev?.event}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{ev?.detail}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}