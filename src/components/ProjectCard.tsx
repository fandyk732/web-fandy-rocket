import React from 'react';
import Link from 'next/link';
import type { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
  size?: 'large' | 'normal';
}

const statusConfig = {
  live: { label: 'Live', color: 'text-emerald-400', dot: 'status-dot-green' },
  building: { label: 'Building', color: 'text-amber-400', dot: 'status-dot-yellow' },
  completed: { label: 'Completed', color: 'text-blue-400', dot: 'status-dot-blue' },
};

export default function ProjectCard({ project, size = 'normal' }: ProjectCardProps) {
  const status = statusConfig[project.status];

  return (
    <article
      className={`group relative bg-card border border-border rounded-2xl overflow-hidden card-hover flex flex-col ${
        size === 'large' ? 'min-h-[340px]' : 'min-h-[280px]'
      }`}
      aria-label={`Project: ${project.title}`}
    >
      {/* Gradient thumbnail */}
      <div className={`relative h-40 bg-gradient-to-br ${project.gradient} flex-shrink-0`}>
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-bg opacity-40" />
        {/* Beam border bottom */}
        <div className="beam-border-h" />
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="mono-label bg-background/80 text-muted-foreground border border-border px-3 py-1.5 rounded-full backdrop-blur-sm">
            {project.category}
          </span>
        </div>
        {/* Status */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${status.dot}`} aria-hidden="true" />
          <span className={`mono-label ${status.color}`}>{status.label}</span>
        </div>
        {/* Year */}
        <div className="absolute bottom-4 right-4">
          <span className="mono-label text-muted-foreground">{project.year}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-3">
        <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
          {project.description}
        </p>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="mono-label bg-muted text-muted-foreground px-2.5 py-1 rounded-md border border-border"
            >
              {t}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-4 pt-4 border-t border-border">
          <Link
            href={`/projects#${project.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors group/link"
            aria-label={`View project: ${project.title}`}
          >
            View Project
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1"
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
    </article>
  );
}