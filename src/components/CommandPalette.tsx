'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

type HistoryItem = {
  command: string;
  output: React.ReactNode;
};

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: 'welcome',
      output: (
        <div className="text-muted-foreground text-xs space-y-1">
          <p>Welcome, Just4fun, type it</p>
          <p>Ketik <span className="text-primary font-bold">help</span> untuk melihat daftar perintah yang tersedia.</p>
        </div>
      ),
    },
  ]);

  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Shortcut Listener (Ctrl + K / Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto focus ke input saat terminal terbuka & auto scroll ke bawah
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Handler Perintah Terminal
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    let output: React.ReactNode = null;

    switch (cmd) {
      case 'help':
        output = (
          <div className="text-xs space-y-1 text-muted-foreground">
            <p className="text-foreground font-semibold">Perintah yang tersedia:</p>
            <p><span className="text-primary font-mono font-bold w-20 inline-block">articles</span> - Buka halaman list artikel</p>
            <p><span className="text-primary font-mono font-bold w-20 inline-block">about</span> - Informasi singkat tentang Fandy</p>
            <p><span className="text-primary font-mono font-bold w-20 inline-block">skills</span> - Lihat daftar tech stack & keahlian</p>
            <p><span className="text-primary font-mono font-bold w-20 inline-block">contact</span> - Tampilkan kontak & sosial media</p>
            <p><span className="text-primary font-mono font-bold w-20 inline-block">home</span> - Kembali ke halaman utama</p>
            <p><span className="text-primary font-mono font-bold w-20 inline-block">clear</span> - Bersihkan riwayat terminal</p>
            <p><span className="text-primary font-mono font-bold w-20 inline-block">exit</span> - Tutup modal terminal</p>
          </div>
        );
        break;

      case 'about':
        output = (
          <p className="text-xs text-muted-foreground">
            Fandy Aziz — Educator, Builder & Digital Explorer. Berfokus pada pengembangan web, edukasi vokasi, dan transformasi digital.
          </p>
        );
        break;

      case 'skills':
        output = (
          <div className="text-xs text-muted-foreground space-y-1">
            <p>⚡ <span className="text-foreground font-medium">Frontend:</span> React, Next.js, TypeScript, Tailwind CSS</p>
            <p>🗄️ <span className="text-foreground font-medium">Backend & DB:</span> Node.js, Supabase, PostgreSQL, REST API</p>
            <p>🛠️ <span className="text-foreground font-medium">Tools:</span> Git, VSCode, Vercel, Docker</p>
          </div>
        );
        break;

      case 'contact':
        output = (
          <div className="text-xs text-muted-foreground space-y-1">
            <p>📧 Email: <a href="mailto:fandyazis17@gmail.com" className="text-primary hover:underline">Kontak via Website</a></p>
            <p>🌐 Website: <a href="https://www.fandyalmana.my.id" target="_blank" className="text-primary hover:underline">fandyalmana.my.id</a></p>
          </div>
        );
        break;

      case 'articles':
        output = <p className="text-xs text-green-400">Navigasi ke /articles...</p>;
        setTimeout(() => {
          setIsOpen(false);
          router.push('/articles');
        }, 500);
        break;

      case 'home':
        output = <p className="text-xs text-green-400">Navigasi ke /...</p>;
        setTimeout(() => {
          setIsOpen(false);
          router.push('/');
        }, 500);
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'exit':
        setIsOpen(false);
        setInput('');
        return;

      default:
        output = (
          <p className="text-xs text-red-400">
            Perintah &apos;{cmd}&apos; tidak dikenali. Ketik <span className="underline cursor-pointer" onClick={() => setInput('help')}>help</span> untuk bantuan.
          </p>
        );
        break;
    }

    setHistory((prev) => [...prev, { command: input, output }]);
    setInput('');
  };

  return (
    <>
      {/* Tombol Trigger Mungil di UI (Bisa Ditaro di Navbar/Floating) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 z-40 flex items-center gap-2 px-3 py-2 text-xs font-mono bg-card border border-border shadow-2xl rounded-xl hover:border-primary/50 transition-all group"
        title="Buka Terminal (Ctrl + K)"
      >
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        <span className="text-muted-foreground group-hover:text-foreground">Terminal</span>
        <kbd className="px-1.5 py-0.5 text-[10px] bg-muted border border-border rounded font-semibold text-muted-foreground">
          Ctrl K
        </kbd>
      </button>

      {/* Modal Backdrop & Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl bg-card/95 border border-border/80 shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[420px] font-mono"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Window Terminal */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={() => setIsOpen(false)}></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <span className="ml-2 text-xs text-muted-foreground">fandy@workspace:~</span>
              </div>
              <span className="text-[10px] text-muted-foreground">ESC to close</span>
            </div>

            {/* Output History Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm">
              {history.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs">
                    <span>❯</span>
                    <span>{item.command}</span>
                  </div>
                  <div className="pl-4">{item.output}</div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input Command Line */}
            <form onSubmit={handleCommand} className="flex items-center gap-2 px-4 py-3 border-t border-border/60 bg-background/50">
              <span className="text-primary font-bold text-sm">❯</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik perintah... (contoh: help, articles, skills)"
                className="w-full bg-transparent border-none outline-none text-xs text-foreground placeholder:text-muted-foreground/60 font-mono"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}