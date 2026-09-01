'use client';

import { useEffect } from 'react';

interface LabModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: string;
  children: React.ReactNode;
}

export default function LabModal({ isOpen, onClose, title, category, children }: LabModalProps) {
  // Prevent body scroll saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[90vh] bg-background border border-border rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div>
            <span className="text-xs font-mono text-primary uppercase tracking-wider">{category}</span>
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
          </div>
         <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all text-xl font-bold border border-border/50"
            aria-label="Tutup Simulator"
            >
            ✕
            </button>
        </div>

        {/* Modal Body / Playground Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-background">
          {children}
        </div>
      </div>
    </div>
  );
}