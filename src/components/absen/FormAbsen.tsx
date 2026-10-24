'use client';

import React, { useState } from 'react';

type FormAbsenProps = {
  appsScriptUrl: string;
  isOpen: boolean;
  onSuccess: () => void;
};

export default function FormAbsen({ appsScriptUrl, isOpen, onSuccess }: FormAbsenProps) {
  const [nim, setNim] = useState('');
  const [nama, setNama] = useState('');
  const [status, setStatus] = useState('Hadir');
  const [catatan, setCatatan] = useState('');

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });

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

      const response = await fetch(appsScriptUrl, {
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
        onSuccess();
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

  return (
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
  );
}