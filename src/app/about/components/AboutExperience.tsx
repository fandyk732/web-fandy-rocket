import React from 'react';
import SectionTitle from '@/components/SectionTitle';
import Timeline from '@/components/Timeline';
import ScrollReveal from '@/components/ScrollReveal';
import { experiences } from '@/data/experience';

export default function AboutExperience() {
  return (
    <section className="py-20 lg:py-24 px-6 lg:px-8 border-t border-border" aria-labelledby="experience-title">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <SectionTitle
            label="Experience"
            title="Where I&apos;ve worked."
            subtitle="Each role shaped how I think about technology, people, and systems."
            id="experience-title"
          />
        </ScrollReveal>

        <div className="mt-12">
          <Timeline items={experiences} />
        </div>
      </div>
    </section>
  );
}