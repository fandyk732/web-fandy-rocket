import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectsHero from '@/app/projects/components/ProjectsHero';
import ProjectsGrid from '@/app/projects/components/ProjectsGrid';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <ProjectsHero />
        <ProjectsGrid />
      </main>
      <Footer />
    </div>
  );
}