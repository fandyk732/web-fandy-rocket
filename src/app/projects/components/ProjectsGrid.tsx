import React from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import { projects } from '@/data/projects';

const statusConfig = {
  live: { label: 'Live', color: 'text-emerald-400', dot: 'status-dot-green', badge: 'bg-emerald-500/10 border-emerald-500/20' },
  building: { label: 'Building', color: 'text-amber-400', dot: 'status-dot-yellow', badge: 'bg-amber-500/10 border-amber-500/20' },
  completed: { label: 'Completed', color: 'text-blue-400', dot: 'status-dot-blue', badge: 'bg-blue-500/10 border-blue-500/20' },
};

export default function ProjectsGrid() {
  return (
    <section className="py-20 px-6 lg:px-8" aria-label="All projects">
      <div className="max-w-7xl mx-auto space-y-6">
        {projects?.map((project, i) => {
          const status = statusConfig?.[project?.status];
          return (
            <ScrollReveal key={project?.id} delay={i * 100}>
              <article
                id={project?.id}
                className="group bg-card border border-border rounded-2xl overflow-hidden card-hover"
                aria-label={`Project: ${project?.title}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Gradient visual */}
                  <div className={`relative lg:col-span-4 bg-gradient-to-br ${project?.gradient} min-h-[200px] lg:min-h-full`}>
                    <div className="absolute inset-0 grid-bg opacity-40" aria-hidden="true" />
                    <div className="beam-border-h" aria-hidden="true" />
                    {/* Year */}
                    <div className="absolute bottom-6 left-6">
                      <span className="mono-label text-foreground/50">{project?.year}</span>
                    </div>
                    {/* Featured badge */}
                    {project?.featured && (
                      <div className="absolute top-6 left-6">
                        <span className="mono-label bg-background/70 text-primary border border-primary/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-8 p-8 flex flex-col gap-5">
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="mono-label text-muted-foreground border border-border px-3 py-1.5 rounded-full bg-muted/30">
                          {project?.category}
                        </span>
                        <span className={`inline-flex items-center gap-2 mono-label ${status?.badge} border px-3 py-1.5 rounded-full`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status?.dot}`} aria-hidden="true" />
                          <span className={status?.color}>{status?.label}</span>
                        </span>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
                      {project?.title}
                    </h2>

                    <p className="text-base text-muted-foreground leading-relaxed">
                      {project?.longDescription}
                    </p>

                    {/* Tech */}
                    <div className="flex flex-wrap gap-2">
                      {project?.tech?.map((t) => (
                        <span
                          key={t}
                          className="mono-label bg-muted text-muted-foreground border border-border px-3 py-1.5 rounded-full hover:text-foreground hover:border-primary/30 transition-colors cursor-default"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                      <Link
                        href={`/projects/${project?.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors group/btn"
                        aria-label={`View details for ${project?.title}`}
                      >
                        View Project Details
                        <svg
                          className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}