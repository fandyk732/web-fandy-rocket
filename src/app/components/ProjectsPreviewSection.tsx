import React from 'react';
import Link from 'next/link';
import SectionTitle from '@/components/SectionTitle';
import ProjectCard from '@/components/ProjectCard';
import ScrollReveal from '@/components/ScrollReveal';
import { projects } from '@/data/projects';

export default function ProjectsPreviewSection() {
  const featured = projects?.filter((p) => p?.featured);

  return (
    <section className="py-20 lg:py-24 px-6 lg:px-8 border-t border-border" aria-labelledby="projects-preview-title">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <SectionTitle
              label="Selected Work"
              title="Projects that matter."
              subtitle="Digital systems built for real classrooms, real students, real outcomes."
              id="projects-preview-title"
            />
            <Link
              href="/projects"
              className="flex-shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors group"
            >
              All Projects
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>

        {/* Bento Grid layout with dynamic links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Large card 1 */}
          {featured?.[0] && (
            <ScrollReveal delay={100} className="md:col-span-2">
              <Link href={`/projects/${featured[0].slug}`} className="block h-full group">
                <ProjectCard project={featured[0]} size="large" />
              </Link>
            </ScrollReveal>
          )}

          {/* Normal card 1 */}
          {featured?.[1] && (
            <ScrollReveal delay={180} className="md:col-span-1">
              <Link href={`/projects/${featured[1].slug}`} className="block h-full group">
                <ProjectCard project={featured[1]} />
              </Link>
            </ScrollReveal>
          )}

          {/* Normal card 2 */}
          {featured?.[2] && (
            <ScrollReveal delay={220} className="md:col-span-1">
              <Link href={`/projects/${featured[2].slug}`} className="block h-full group">
                <ProjectCard project={featured[2]} />
              </Link>
            </ScrollReveal>
          )}

          {/* Large card 2 */}
          {projects?.[3] && (
            <ScrollReveal delay={280} className="md:col-span-2">
              <Link href={`/projects/${projects[3].slug}`} className="block h-full group">
                <ProjectCard project={projects[3]} size="large" />
              </Link>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}