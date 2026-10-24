'use client';

import React, { useState } from 'react';

export type TugasData = {
  timestamp: string;
  nim: string;
  nama: string;
  kelompok: string;
  matkul: string;
  fileName: string;
  fileUrl: string;
  fileId: string;
};

type TabelRekapTugasProps = {
  tugasList: TugasData[];
  loading: boolean;
  onRefresh: () => void;
};

export default function TabelRekapTugas({ tugasList, loading, onRefresh }: TabelRekapTugasProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = tugasList.filter(
    (item) =>
      item.kelompok.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.matkul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold border-l-4 border-amber-500 pl-3">
            Daftar Berkas Tugas Presentasi
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            File yang dapat diunduh langsung oleh teman-teman kelas & dosen.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2 text-xs font-semibold bg-background hover:bg-muted border border-border rounded-xl transition-all shadow-sm"
        >
          🔄 {loading ? 'Memuat...' : 'Refresh Data'}
        </button>
      </div>

      <div className="max-w-xs">
        <input
          type="text"
          placeholder="🔍 Cari Kelompok, Matkul, Pengumpul..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs"
        />
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[450px] border border-border rounded-xl">
        <table className="w-full text-left text-xs relative">
          <thead className="bg-muted/90 backdrop-blur border-b border-border text-muted-foreground uppercase font-mono sticky top-0 z-10">
            <tr>
              <th className="p-3">Waktu</th>
              <th className="p-3">Kelompok</th>
              <th className="p-3">Mata Kuliah</th>
              <th className="p-3">Pengumpul</th>
              <th className="p-3">Nama Berkas</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={6} className="p-4 text-center italic text-muted-foreground">Memuat berkas...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center italic text-muted-foreground">Belum ada tugas diunggah.</td></tr>
            ) : (
              [...filtered].reverse().map((item, idx) => (
                <tr key={idx} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-mono text-muted-foreground">{item.timestamp}</td>
                  <td className="p-3 font-semibold text-primary">{item.kelompok}</td>
                  <td className="p-3 font-medium">{item.matkul}</td>
                  <td className="p-3">{item.nama} ({item.nim})</td>
                  <td className="p-3 font-mono text-muted-foreground truncate max-w-[200px]">{item.fileName}</td>
                  <td className="p-3 text-center">
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-[11px] font-semibold"
                    >
                      📥 Unduh Berkas
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}