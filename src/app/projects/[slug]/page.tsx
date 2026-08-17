import { projects } from '@/data/projects';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound(); // Lempar ke halaman 404 kalau slug gak ketemu
  }

  // Fallback array jika property techStack atau tech di data berbeda
  const techList = project.techStack || (project as any).tech || [];
  const impactList = project.impact || [];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 max-w-5xl mx-auto w-full">
        {/* Back Button */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Projects
        </Link>

        {/* Header Section */}
        <div className="flex flex-col gap-4 border-b border-border pb-10 mb-10">
          <div className="flex items-center gap-3">
            <span className="mono-label text-xs text-primary border border-border px-3 py-1 rounded-full bg-card w-fit">
              {project.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            {project.title}
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
            {project.description}
          </p>

          {/* Tech Stack Badges */}
          {techList.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {techList.map((tech: string) => (
                <span
                  key={tech}
                  className="mono-label text-xs bg-muted border border-border text-muted-foreground px-3 py-1 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Visual Banner Preview / Live URL Link */}
            {project.liveUrl ? (
            <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative w-full h-64 sm:h-80 rounded-2xl bg-gradient-to-br ${
                project.gradient || 'from-neutral-900 to-neutral-950'
                } border border-border overflow-hidden flex items-center justify-center mb-12 shadow-xl hover:border-primary/50 transition-all duration-300 block`}
            >
                <div className="absolute inset-0 grid-bg opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="text-center p-6 z-10 flex flex-col items-center gap-3">
                <span className="mono-label text-xs text-primary border border-primary/30 bg-primary/10 px-3 py-1 rounded-full group-hover:scale-105 transition-transform flex items-center gap-1.5">
                    Visit Live Website
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                </h3>
                </div>
            </a>
            ) : (
            <div
                className={`relative w-full h-64 sm:h-80 rounded-2xl bg-gradient-to-br ${
                project.gradient || 'from-neutral-900 to-neutral-950'
                } border border-border overflow-hidden flex items-center justify-center mb-12 shadow-xl`}
            >
                <div className="absolute inset-0 grid-bg opacity-40" />
                <div className="text-center p-6 z-10">
                <span className="mono-label text-xs text-muted-foreground uppercase tracking-widest block mb-2">Project Preview</span>
                <h3 className="text-2xl font-bold text-foreground">{project.title}</h3>
                </div>
            </div>
            )}

        {/* Content Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-8">
            {project.overview && (
              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">Overview</h2>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {project.overview}
                </p>
              </section>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {project.problem && (
                <div className="p-6 bg-card border border-border rounded-xl space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">The Problem</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{project.problem}</p>
                </div>
              )}

              {project.solution && (
                <div className="p-6 bg-card border border-border rounded-xl space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">The Solution</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{project.solution}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Key Impact */}
          {impactList.length > 0 && (
            <div className="space-y-6">
              <div className="p-6 bg-card border border-border rounded-xl space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-3">Key Impact</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {impactList.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      
    </div>
  );
}