import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutHero from '@/app/about/components/AboutHero';
import AboutStory from '@/app/about/components/AboutStory';
import AboutExperience from '@/app/about/components/AboutExperience';
import AboutToolbox from '@/app/about/components/AboutToolbox';
import AboutContact from '@/app/about/components/AboutContact';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <AboutHero />
        <AboutStory />
        <AboutExperience />
        <AboutToolbox />
        <AboutContact />
      </main>
     
    </div>
  );
}