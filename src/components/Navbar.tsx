'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      {/* 🚀 HEADER UTAMA */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileOpen
            ? 'nav-blur bg-background/80 border-b border-border shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <nav
          className="max-w-7xl mx-auto px-6 lg:px-8"
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group z-50"
              aria-label="Fandy Aziz — Home"
              onClick={() => setMobileOpen(false)}
            >
              <AppLogo size={32} />
              <span className="font-display font-bold text-base tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                Fandy Aziz
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-muted/50"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/about#contact"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-accent transition-all duration-200 hover:scale-105"
              >
                Let&apos;s Talk
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden z-50 w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-muted/50 transition-colors focus:outline-none"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <span
                className={`block w-5 h-0.5 bg-foreground transition-all duration-300 transform origin-center ${
                  mobileOpen ? 'rotate-45 translate-y-[4px]' : ''
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ${
                  mobileOpen ? 'opacity-0 scale-0' : ''
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-foreground transition-all duration-300 transform origin-center ${
                  mobileOpen ? '-rotate-45 -translate-y-[4px]' : ''
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* 📱 MOBILE MENU OVERLAY (Full Screen & Seamless) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex flex-col justify-center items-center bg-background/95 nav-blur backdrop-blur-xl transition-all duration-300">
          <nav className="flex flex-col items-center justify-center gap-8 px-6 text-center">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-3xl font-bold text-foreground hover:text-primary transition-all duration-200 hover:scale-110 active:scale-95"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/about#contact"
              onClick={() => setMobileOpen(false)}
              className="mt-4 px-8 py-3 text-lg font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-accent transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              Let&apos;s Talk
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}