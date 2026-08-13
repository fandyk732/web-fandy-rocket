import React from 'react';
import SectionTitle from '@/components/SectionTitle';
import StatCard from '@/components/StatCard';
import ScrollReveal from '@/components/ScrollReveal';
import { stats } from '@/data/stats';

export default function ImpactSection() {
  return (
    <section className="py-20 lg:py-24 px-6 lg:px-8 border-t border-border" aria-labelledby="impact-title">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <SectionTitle
            label="Impact"
            title="Numbers that tell the story."
            subtitle="Fifteen years of teaching, building, and connecting students to real opportunities."
            id="impact-title"
          />
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {stats?.map((stat, index) => (
            <StatCard key={stat?.label} stat={stat} delay={index * 120} />
          ))}
        </div>

        {/* Quote */}
        <ScrollReveal delay={200}>
          <div className="mt-12 p-8 bg-card border border-border rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-20" aria-hidden="true" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
              <span className="text-6xl font-bold text-primary/30 leading-none flex-shrink-0">&ldquo;</span>
              <div>
                <p className="text-lg text-foreground leading-relaxed font-medium">
                  This isn&apos;t just a teacher who knows technology. This is someone who genuinely builds meaningful digital solutions for education.
                </p>
                <p className="mt-3 mono-label text-muted-foreground">— The goal behind every project</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}