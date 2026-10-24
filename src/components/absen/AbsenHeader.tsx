'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';

type AbsenHeaderProps = {
  isOpen: boolean;
  timeMessage: string;
  checkingStatus: boolean;
  onRefreshStatus: () => void;
};

export default function AbsenHeader({
  isOpen,
  timeMessage,
  checkingStatus,
  onRefreshStatus,
}: AbsenHeaderProps) {
  return (
    <div className="text-center space-y-3">
      <span className="text-xs font-mono tracking-wider uppercase px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 inline-block">
        Mata Kuliah Filsafat Pendidikan Islam
      </span>

      <h1 className="text-3xl md:text-4xl font-bold">Absensi Perkuliahan</h1>

      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Dosen Pengampu - R. Ahmad Nur Kholis, M.Pd
      </p>

      {/* Container: Google Meet + Status Absensi */}
      <div className="max-w-md mx-auto w-full flex flex-col gap-2.5 pt-2">
        {/* Banner Google Meet */}
        <a
          href="https://meet.google.com/ucf-ktvi-nnx"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 hover:border-emerald-500/60 transition-all group shadow-sm"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
              📹
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground group-hover:text-emerald-500 transition-colors">
                Link Perkuliahan Online (Google Meet)
              </p>
              <p className="text-[11px] font-mono text-muted-foreground">
                meet.google.com/ucf-ktvi-nnx
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500 text-black group-hover:bg-emerald-400 transition-colors shrink-0">
            Join Class
          </span>
        </a>

        {/* Status Sesi & Refresh Button */}
        <div className="flex items-center gap-2">
          <div
            className={`flex-1 text-center px-4 py-2.5 rounded-xl text-xs font-medium border shadow-sm transition-all ${
              checkingStatus
                ? 'bg-card border-border text-muted-foreground'
                : isOpen
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 font-semibold'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-500 font-semibold'
            }`}
          >
            {timeMessage}
          </div>

          <button
            type="button"
            onClick={onRefreshStatus}
            disabled={checkingStatus}
            title="Cek Ulang Status Sesi"
            className="p-2.5 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all disabled:opacity-50 shrink-0"
          >
            <RefreshCw size={14} className={checkingStatus ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
}