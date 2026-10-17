'use client';

import React, { useState, useEffect } from 'react';
import MateriSection from '@/components/MateriSection';
import { RefreshCw } from 'lucide-react';

// 🔗 WEB APP URL APPS SCRIPT
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzl-dJ67vYAGtuA13tUodzNiMbes9G8F0UXAp9lgGUSd-Bn3u1p16n02APn5orJDdAI/exec';

type AbsenData = {
  timestamp: string;
  nim: string;
  nama: string;
  status: string;
  catatan: string;
};

export default function AbsensiPage() {
  const [nim, setNim] = useState('');
  const [nama, setNama] = useState('');
  const [status, setStatus] = useState('Hadir');
  const [catatan, setCatatan] = useState('');

  // Status Sesi Absensi dari Google Apps Script (Toggle Admin)
  const [isOpen, setIsOpen] = useState(false);
  const [timeMessage, setTimeMessage] = useState('Memeriksa status sesi absensi...');
  const [checkingStatus, setCheckingStatus] = useState(true);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });

  // State Rekap Dosen & Filter Advanced
  const [rekapList, setRekapList] = useState<AbsenData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(''); // Format YYYY-MM-DD
  const [selectedStatus, setSelectedStatus] = useState('ALL'); // ALL, Hadir, Izin, Sakit
  const [loadingRekap, setLoadingRekap] = useState(false);

  // 1. Fetch Status Absensi Real-time dari Apps Script (Sheet Config)
  const fetchAbsensiStatus = async () => {
    setCheckingStatus(true);
    try {
      const res = await fetch(`${APPS_SCRIPT_URL}?action=getStatus`);
      const json = await res.json();

      if (json.success && json.status === 'BUKA') {
        setIsOpen(true);
        setTimeMessage('🟢 Absensi Sedang Dibuka oleh Dosen');
      } else {
        setIsOpen(false);
        setTimeMessage('🔴 Absensi Ditutup. Silakan tunggu hingga sesi dibuka oleh dosen.');
      }
    } catch (err) {
      console.error('Gagal mengambil status absensi:', err);
      setIsOpen(false);
      setTimeMessage('🔴 Gagal terhubung ke server absensi.');
    } finally {
      setCheckingStatus(false);
    }
  };

  // 2. Fetch Rekap Data Absensi
  const fetchRekap = async () => {
    setLoadingRekap(true);
    try {
      const res = await fetch(APPS_SCRIPT_URL);
      const json = await res.json();
      if (json.success) {
        setRekapList(json.data || []);
      }
    } catch (err) {
      console.error('Gagal mengambil rekap:', err);
    } finally {
      setLoadingRekap(false);
    }
  };

  useEffect(() => {
    fetchAbsensiStatus();
    fetchRekap();

    // Polling status absensi setiap 15 detik
    const timer = setInterval(fetchAbsensiStatus, 15000);
    return () => clearInterval(timer);
  }, []);

  // Submit Absen Mahasiswa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOpen) return;

    setLoading(true);
    setFeedback({ type: '', msg: '' });

    try {
      const formData = new URLSearchParams();
      formData.append('nim', nim);
      formData.append('nama', nama);
      formData.append('status', status);
      formData.append('catatan', catatan);

      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: formData.toString(),
      });

      const result = await response.json();

      if (result.success) {
        setFeedback({ type: 'success', msg: '✅ Presensi berhasil dicatat!' });
        setNim('');
        setNama('');
        setCatatan('');
        fetchRekap(); // Auto-refresh tabel rekap setelah mahasiswa absen
      } else {
        setFeedback({ type: 'error', msg: `❌ ${result.message}` });
      }
    } catch (err) {
      console.error('Submit Error:', err);
      setFeedback({ type: 'error', msg: '❌ Terjadi kesalahan pengiriman. Coba lagi.' });
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk konversi format timestamp "DD/MM/YYYY, HH.MM.SS" ke YYYY-MM-DD
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

  // Filter Berlapis: Search Text + Date + Status
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

  // Urutkan data terbaru di paling atas
  const sortedFilteredData = [...allFilteredData].reverse();

  // Ambil 50 data teratas untuk tampilan UI
  const displayRekap = sortedFilteredData.slice(0, 50);

  // Download Laporan ke Excel/CSV
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
    <div className="max-w-4xl mx-auto px-6 pt-28 pb-16 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <span className="text-xs font-mono tracking-wider uppercase px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 inline-block">
          Mata Kuliah Filsafat Pendidikan Islam
        </span>

        <h1 className="text-3xl md:text-4xl font-bold">Absensi Perkuliahan</h1>

        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Dosen Pengampu - R. Ahmad Nur Kholis, M.Pd
        </p>

        {/* Combined Container: Google Meet + Status Absensi */}
        <div className="max-w-md mx-auto w-full flex flex-col gap-2.5 pt-2">
          {/* 🎥 Banner Google Meet Perkuliahan */}
          <a
            href="https://meet.google.com/dwi-bweq-gqw"
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
                  meet.google.com/dwi-bweq-gqw
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500 text-black group-hover:bg-emerald-400 transition-colors shrink-0">
              Join Class
            </span>
          </a>

          {/* Status Sesi Absensi + Tombol Refresh Sesi */}
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
              onClick={fetchAbsensiStatus}
              disabled={checkingStatus}
              title="Cek Ulang Status Sesi"
              className="p-2.5 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all disabled:opacity-50 shrink-0"
            >
              <RefreshCw size={14} className={checkingStatus ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Form Absensi Mahasiswa */}
      <div className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-sm space-y-6">
        <h2 className="text-xl font-bold border-l-4 border-primary pl-3">Form Kehadiran Mahasiswa</h2>

        {feedback.msg && (
          <div
            className={`p-4 rounded-xl text-sm font-medium border ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
            }`}
          >
            {feedback.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase">NIM Mahasiswa</label>
              <input
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="Contoh: 20252010573"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={!isOpen || loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase">Nama Lengkap</label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama sesuai SIAKAD"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={!isOpen || loading}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase">Status Presensi</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isOpen || loading}
              >
                <option value="Hadir">Hadir</option>
                <option value="Izin">Izin</option>
                <option value="Sakit">Sakit</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase">Catatan / Keterangan</label>
              <input
                type="text"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Opsional (misal: alasan izin)"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isOpen || loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isOpen || loading}
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'Kirim Presensi...' : isOpen ? 'Kirim Presensi Sekarang' : 'Absensi Belum Dibuka'}
          </button>
        </form>
      </div>

      {/* Materi Perkuliahan (Google Drive) */}
      <MateriSection />

      {/* Area Rekap untuk Dosen & Ketua Kelas */}
      <div className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-bold border-l-4 border-amber-500 pl-3">Rekapitulasi Presensi (Dosen Area)</h2>
              <p className="text-xs text-muted-foreground mt-1">Laporan data kehadiran yang masuk secara real-time.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tombol Refresh Data Rekap */}
            <button
              type="button"
              onClick={fetchRekap}
              disabled={loadingRekap}
              title="Refresh Data Tabel"
              className="p-2 text-muted-foreground hover:text-foreground rounded-xl border border-border hover:bg-accent transition-all disabled:opacity-50"
            >
              <RefreshCw size={14} className={loadingRekap ? 'animate-spin' : ''} />
            </button>

            {/* Tombol Download CSV */}
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="px-4 py-2 text-xs font-semibold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              📥 Download Excel/CSV ({sortedFilteredData.length} Data)
            </button>
          </div>
        </div>

        {/* Control Bar Filter Advanced */}
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

        {/* Info Counter & Reset Filter */}
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
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase font-mono">
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
    </div>
  );
}