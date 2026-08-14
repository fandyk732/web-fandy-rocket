import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

export default function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo + name */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <AppLogo size={28} />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              Fandy Aziz
            </span>
            <span className="mono-label text-muted-foreground" style={{ fontSize: '0.6rem' }}>
              Educator · Builder · Digital Explorer
            </span>
          </div>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link href="/projects" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Projects
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <a
            href="mailto:fandyazis17@gmail.com"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Contact
          </a>
        </div>

        {/* Copyright */}
        <p className="mono-label text-muted-foreground">
          © 2026 Fandy Aziz
        </p>
      </div>
    </footer>
  );
}