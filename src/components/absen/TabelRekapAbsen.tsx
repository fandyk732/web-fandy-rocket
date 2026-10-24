'use client';

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

export type AbsenData = {
  timestamp: string;
  nim: string;
  nama: string;
  status: string;
  catatan: string;
};

type TabelRekapAbsenProps = {
  rekapList: AbsenData[];
  loadingRekap: boolean;
  onRefresh: () => void;
};

export default function TabelRekapAbsen({
  rekapList,
  loadingRekap,
  onRefresh,
}: TabelRekapAbsenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const parseTimestampToDateStr = (timestampStr: string) => {
    if (!timestampStr) return '';
    const datePart = timestampStr.split(',')[0].trim();
    const parts = datePart.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    return '';
  };

  const allFilteredData = rekapList.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nim.includes(searchTerm);

    const itemDateStr = parseTimestampToDateStr(item.timestamp);
    const matchesDate = selectedDate ? itemDateStr === selectedDate : true;

    const matchesStatus =
      selectedStatus === 'ALL' ? true : item.status === selectedStatus;

    return matchesSearch && matchesDate && matchesStatus;
  });

  const sortedFilteredData = [...allFilteredData].reverse();
  const displayRekap = sortedFilteredData.slice(0, 50);

  const handleDownloadCSV = () => {
    if (sortedFilteredData.length === 0) {
      return alert('Tidak ada data presensi yang sesuai dengan filter!');
    }

    let csvContent = 'data:text/csv;charset=utf-8,Timestamp,NIM,Nama Mahasiswa,Status,Catatan\n';
    sortedFilteredData.forEach((row) => {
      csvContent += `"${row.timestamp}","${row.nim}","${row.nama}","${row.status}","${row.catatan}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Rekap_Presensi_${selectedDate || 'Semua_Tanggal'}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold border-l-4 border-amber-500 pl-3">Rekapitulasi Presensi (Dosen Area)</h2>
          <p className="text-xs text-muted-foreground mt-1">Laporan data kehadiran yang masuk secara real-time.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loadingRekap}
            title="Refresh Data Tabel"
            className="p-2 text-muted-foreground hover:text-foreground rounded-xl border border-border hover:bg-accent transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={loadingRekap ? 'animate-spin' : ''} />
          </button>

          <button
            type="button"
            onClick={handleDownloadCSV}
            className="px-4 py-2 text-xs font-semibold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            📥 Download Excel/CSV ({sortedFilteredData.length} Data)
          </button>
        </div>
      </div>

      {/* Control Bar Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-5">
          <input
            type="text"
            placeholder="🔍 Cari Nama atau NIM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:border-primary"
          />
        </div>

        <div className="sm:col-span-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:border-primary text-muted-foreground"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:border-primary"
          >
            <option value="ALL">Semua Status</option>
            <option value="Hadir">Hadir</option>
            <option value="Izin">Izin</option>
            <option value="Sakit">Sakit</option>
          </select>
        </div>
      </div>

      {/* Info Counter */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Menampilkan <strong className="text-foreground">{displayRekap.length}</strong> dari{' '}
          <strong className="text-foreground">{sortedFilteredData.length}</strong> data terfilter (Total Keseluruhan:{' '}
          {rekapList.length})
        </span>

        {(searchTerm || selectedDate || selectedStatus !== 'ALL') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDate('');
              setSelectedStatus('ALL');
            }}
            className="text-[11px] text-amber-500 underline hover:text-amber-400"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Table Rekap */}
      <div className="overflow-x-auto overflow-y-auto max-h-[400px] border border-border rounded-xl">
        <table className="w-full text-left text-xs relative">
            {/* Pasang sticky top-0 & z-10 di thead agar header nempel saat di-scroll */}
            <thead className="bg-muted/90 backdrop-blur border-b border-border text-muted-foreground uppercase font-mono sticky top-0 z-10">
            <tr>
              <th className="p-3">Waktu</th>
              <th className="p-3">NIM</th>
              <th className="p-3">Nama Mahasiswa</th>
              <th className="p-3">Status</th>
              <th className="p-3">Catatan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loadingRekap ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-muted-foreground italic">
                  Memuat data rekap...
                </td>
              </tr>
            ) : displayRekap.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-muted-foreground italic">
                  Tidak ada data presensi yang sesuai filter.
                </td>
              </tr>
            ) : (
              displayRekap.map((item, idx) => (
                <tr key={idx} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-mono text-muted-foreground">{item.timestamp}</td>
                  <td className="p-3 font-mono font-semibold">{item.nim}</td>
                  <td className="p-3 font-medium text-foreground">{item.nama}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        item.status === 'Hadir'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{item.catatan}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}