import React from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import SectionTitle from '@/components/SectionTitle';

const buildingItems = [
  {
    status: 'green',
    label: 'Active',
    title: 'Building digital education tools',
    description: 'SMK Al Kaaffah digital ecosystem — student portal, teacher dashboard, and learning resource library.',
    dotClass: 'status-dot-green',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    status: 'yellow',
    label: 'Exploring',
    title: 'Learning AI workflows',
    description: 'Integrating AI-assisted content generation and student assessment tools into the education platform.',
    dotClass: 'status-dot-yellow',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  {
    status: 'blue',
    label: 'Research',
    title: 'Exploring interactive web experiences',
    description: 'Experimenting with motion design and interactive learning interfaces for complex networking concepts.',
    dotClass: 'status-dot-blue',
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
];

export default function CurrentlyBuildingSection() {
  return (
    <section className="py-20 lg:py-24 px-6 lg:px-8 border-t border-border" aria-labelledby="building-title">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <SectionTitle
            label="Status"
            title="Currently building."
            subtitle="What's on the workbench right now."
            id="building-title"
          />
        </ScrollReveal>

        <div className="mt-12 flex flex-col gap-4">
          {buildingItems?.map((item, i) => (
            <ScrollReveal key={item?.title} delay={i * 120}>
              <div className="group flex items-start gap-6 p-6 bg-card border border-border rounded-2xl card-hover">
                {/* Status indicator */}
                <div className="flex-shrink-0 flex flex-col items-center gap-2 pt-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${item?.dotClass}`} aria-hidden="true" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {item?.title}
                      </h3>
                      <span className={`mono-label px-2.5 py-1 rounded-full border ${item?.badgeClass}`}>
                        {item?.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item?.description}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}