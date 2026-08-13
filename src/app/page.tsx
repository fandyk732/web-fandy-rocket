import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import WhatIDoSection from '@/app/components/WhatIDoSection';
import ProjectsPreviewSection from '@/app/components/ProjectsPreviewSection';
import ImpactSection from '@/app/components/ImpactSection';
import CurrentlyBuildingSection from '@/app/components/CurrentlyBuildingSection';
import WritingPreviewSection from '@/app/components/WritingPreviewSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <WhatIDoSection />
        <ProjectsPreviewSection />
        <ImpactSection />
        <CurrentlyBuildingSection />
        <WritingPreviewSection />
      </main>
      <Footer />
    </div>
  );
}