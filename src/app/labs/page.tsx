import React from 'react';
import NetworkTerminal from '@/components/NetworkTerminal';
import CodePlayground from '@/components/CodePlayground';

export const metadata = {
  title: 'Interactive Labs | Fandy Aziz',
  description: 'Network Simulator & Code Playground untuk Siswa.',
};

export default function LabsPage() {
  return (
    <div className="w-full min-h-screen bg-background pt-24 pb-16 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Section 1: Cisco CLI */}
        <div className="space-y-4">
          <div>
            <span className="mono-label text-primary">INTERACTIVE LAB 1</span>
            <h1 className="text-3xl font-bold text-foreground mt-1">Cisco CLI Simulator</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Praktikkan perintah router Cisco IOS langsung di terminal browser.
            </p>
          </div>
          <NetworkTerminal />
        </div>

        {/* Section 2: Code Playground */}
        <div className="space-y-4">
          <div>
            <span className="mono-label text-primary">INTERACTIVE LAB 2</span>
            <h2 className="text-2xl font-bold text-foreground mt-1">Mini Code Playground</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Coba ngetik kode HTML dasar atau logika Python sederhanamu di sini!
            </p>
          </div>
          <CodePlayground />
        </div>
      </div>
    </div>
  );
}