'use client';

import { useState } from 'react';
import NetworkTerminal from '@/components/NetworkTerminal';
import CodePlayground from '@/components/CodePlayground';
import LabModal from '@/components/LabModal';

interface LabItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  icon: string;
  component: React.ReactNode;
}

export default function LabsPage() {
  const [activeLab, setActiveLab] = useState<LabItem | null>(null);

  // 🚀 Tambahkan simulator/lab baru kamu di array ini kapan saja!
  const labs: LabItem[] = [
    {
      id: 'cisco-cli',
      badge: 'INTERACTIVE LAB 1',
      title: 'Cisco CLI Simulator',
      description: 'Praktikkan perintah dasar router Cisco IOS langsung di terminal browser.',
      icon: '🖥️',
      component: <NetworkTerminal />,
    },
    {
      id: 'code-playground',
      badge: 'INTERACTIVE LAB 2',
      title: 'Mini Code Playground',
      description: 'Coba ngetik kode HTML dasar atau logika Python sederhanamu di sini!',
      icon: '💻',
      component: <CodePlayground />,
    },
    {
      id: 'network-topology',
      badge: 'INTERACTIVE LAB 3',
      title: 'Visual Network Simulator',
      description: 'Simulasi topologi jaringan interaktif, konfigurasi IP address, dan tes paket PING.',
      icon: '🌐',
      component: (
        <div className="space-y-4 h-full flex flex-col">
          <div className="w-full flex-1 min-h-[500px] rounded-xl border border-border overflow-hidden bg-card">
            <iframe
              src="/simulator/index.html"
              title="Visual Network Simulator"
              className="w-full h-full border-none"
            />
          </div>
          <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-1 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">💡 Petunjuk Praktikum:</p>
            <p>Drag & drop perangkat ke canvas, hubungkan dengan kabel jaringan, atur IP Address, dan lakukan tes PING.</p>
          </div>
        </div>
      ),
    },
    // ➕ Mau nambah Lab 4, 5, dst? Tinggal copas objek di atas di sini!
  ];

  return (
    <div className="w-full min-h-screen bg-background pt-24 pb-16 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="border-b border-border pb-8">
          <span className="text-xs font-mono text-primary uppercase tracking-wider">LABORATORIUM DIGITAL</span>
          <h1 className="text-4xl font-bold text-foreground mt-1">Interactive Labs</h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-2xl">
            Kumpulan tools simulator jaringan, terminal CLI, dan lingkungan koding interaktif untuk pembelajaran siswa.
          </p>
        </div>

        {/* Grid List Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab) => (
            <div
              key={lab.id}
              onClick={() => setActiveLab(lab)}
              className="group cursor-pointer flex flex-col justify-between bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{lab.icon}</span>
                  <span className="text-[10px] font-mono font-medium px-2.5 py-1 bg-primary/10 text-primary rounded-full">
                    {lab.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {lab.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">
                    {lab.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-medium text-primary">
                <span>Buka Simulator</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Popup Simulator */}
      {activeLab && (
        <LabModal
          isOpen={!!activeLab}
          onClose={() => setActiveLab(null)}
          title={activeLab.title}
          category={activeLab.badge}
        >
          {activeLab.component}
        </LabModal>
      )}
    </div>
  );
}