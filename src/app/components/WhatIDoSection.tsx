import React from 'react';
import SectionTitle from '@/components/SectionTitle';
import ScrollReveal from '@/components/ScrollReveal';

const cards = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    title: 'Educator',
    description: 'Teaching computer networking and IT to vocational students. Building curriculum aligned to national competency standards and real industry expectations.',
    accent: 'from-amber-900/30 to-transparent',
    span: 'lg:col-span-1',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: 'Builder',
    description: 'Designing and shipping digital systems for schools — from student information platforms to alumni tracking tools. Full-stack, production-ready.',
    accent: 'from-blue-900/30 to-transparent',
    span: 'lg:col-span-1',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    ),
    title: 'Digital Transformation',
    description: 'Turning analog school workflows into efficient digital systems. Reducing paperwork, improving data visibility, and connecting teachers, students, and industry.',
    accent: 'from-emerald-900/30 to-transparent',
    span: 'lg:col-span-2',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
    title: 'Industry & Career',
    description: 'Bridging vocational students with real industry opportunities. Managing 30+ partnerships, coordinating internships, and tracking career outcomes.',
    accent: 'from-rose-900/30 to-transparent',
    span: 'lg:col-span-2',
  },
];

export default function WhatIDoSection() {
  return (
    <section className="py-20 lg:py-28 px-6 lg:px-8" aria-labelledby="what-i-do-title">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <SectionTitle
            label="What I Do"
            title="More than a job title."
            subtitle="I sit at the intersection of teaching, building, and connecting. Here's how that looks in practice."
            id="what-i-do-title"
          />
        </ScrollReveal>

        {/* Bento grid - 4 cards asymmetric */}
        {/* 
          BENTO AUDIT:
          Array: [Educator, Builder, Digital Transformation, Industry & Career]
          Row 1 (lg): [col-1: Educator cs-1] [col-2: Builder cs-1] [col-3-4: Digital Transformation cs-2]
          Row 2 (lg): [col-1-2: Industry & Career cs-2] [col-3-4: EMPTY → expand Industry col-span to fill]
          
          Revised:
          Row 1 (lg): [col-1: Educator cs-1] [col-2: Builder cs-1] [col-3-4: Digital Transformation cs-2]
          Row 2 (lg): [col-1-4: Industry & Career cs-4]
          
          Placed 4/4 ✓
        */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 — Educator */}
          <ScrollReveal delay={100} className="lg:col-span-1">
            <div className={`group relative bg-card border border-border rounded-2xl overflow-hidden card-hover h-full min-h-[260px] flex flex-col p-6`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${cards?.[0]?.accent} opacity-60`} aria-hidden="true" />
              <div className="relative z-10 flex flex-col flex-1 gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-300">
                  {cards?.[0]?.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  {cards?.[0]?.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {cards?.[0]?.description}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2 — Builder */}
          <ScrollReveal delay={160} className="lg:col-span-1">
            <div className={`group relative bg-card border border-border rounded-2xl overflow-hidden card-hover h-full min-h-[260px] flex flex-col p-6`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${cards?.[1]?.accent} opacity-60`} aria-hidden="true" />
              <div className="relative z-10 flex flex-col flex-1 gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-300">
                  {cards?.[1]?.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  {cards?.[1]?.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {cards?.[1]?.description}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3 — Digital Transformation (spans 2 cols) */}
          <ScrollReveal delay={220} className="lg:col-span-2">
            <div className={`group relative bg-card border border-border rounded-2xl overflow-hidden card-hover h-full min-h-[260px] flex flex-col p-6`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${cards?.[2]?.accent} opacity-60`} aria-hidden="true" />
              <div className="absolute inset-0 grid-bg opacity-20" aria-hidden="true" />
              <div className="relative z-10 flex flex-col flex-1 gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-300">
                  {cards?.[2]?.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  {cards?.[2]?.title}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed flex-1">
                  {cards?.[2]?.description}
                </p>
                {/* Visual element */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Student Data', 'Admin Tools', 'Learning Resources', 'Reports']?.map((tag) => (
                    <span key={tag} className="mono-label bg-muted/50 text-muted-foreground border border-border px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 4 — Industry & Career (full width row) */}
          <ScrollReveal delay={280} className="md:col-span-2 lg:col-span-4">
            <div className={`group relative bg-card border border-border rounded-2xl overflow-hidden card-hover flex flex-col lg:flex-row p-6 gap-6 min-h-[180px]`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${cards?.[3]?.accent} opacity-40`} aria-hidden="true" />
              <div className="relative z-10 flex flex-col lg:flex-row items-start gap-6 w-full">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-300 flex-shrink-0">
                  {cards?.[3]?.icon}
                </div>
                <div className="flex flex-col lg:flex-row flex-1 gap-6">
                  <div className="flex flex-col gap-3 lg:max-w-md">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {cards?.[3]?.title}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {cards?.[3]?.description}
                    </p>
                  </div>
                  {/* Stats row */}
                  <div className="flex flex-wrap gap-8 lg:ml-auto items-center">
                    {[
                      { v: '30+', l: 'Industry Partners' },
                      { v: '300+', l: 'Internship Students' },
                      { v: '240+', l: 'Alumni Tracked' },
                    ]?.map((s) => (
                      <div key={s?.l} className="flex flex-col gap-1">
                        <span className="text-3xl font-bold text-gradient-gold tracking-tighter">{s?.v}</span>
                        <span className="mono-label text-muted-foreground">{s?.l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}