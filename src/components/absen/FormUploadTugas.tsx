'use client';

import React, { useState } from 'react';

type FormUploadTugasProps = {
  appsScriptUrl: string;
  onUploadSuccess: () => void;
};

export default function FormUploadTugas({ appsScriptUrl, onUploadSuccess }: FormUploadTugasProps) {
  const [nim, setNim] = useState('');
  const [nama, setNama] = useState('');
  const [kelompok, setKelompok] = useState('Kelompok 1');
  const [matkul, setMatkul] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.size === 0) {
      alert('❌ File yang dipilih kosong (0 KB)!');
      e.target.value = '';
      return;
    }

    // Batas Maksimal 5 MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert('❌ Ukuran file maksimal 5 MB!');
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const res = reader.result as string;
        resolve(res.includes(',') ? res.split(',')[1] : res);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return alert('Silakan pilih file tugas!');

    setLoading(true);
    setFeedback({ type: '', msg: '' });

    try {
      const cleanNama = nama.trim().replace(/[/\\?%*:|"<>()[\]]/g, '');
      const cleanNim = nim.trim().replace(/[^0-9]/g, '');
      const ext = selectedFile.name.split('.').pop() || 'docx';

      const customFileName = `TUGAS_${kelompok.replace(/\s+/g, '')}_${cleanNama}_${cleanNim}.${ext}`;
      const base64Data = await fileToBase64(selectedFile);

      const payload = {
        nim: cleanNim,
        nama: nama.trim(),
        kelompok,
        matkul: matkul.trim(),
        fileName: customFileName,
        fileData: base64Data,
        mimeType: selectedFile.type,
      };

      const res = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        setFeedback({ type: 'success', msg: `✅ ${result.message}` });
        setNim('');
        setNama('');
        setMatkul('');
        setSelectedFile(null);
        onUploadSuccess();
      } else {
        setFeedback({ type: 'error', msg: result.message });
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', msg: '❌ Gagal mengunggah file. Coba lagi.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-sm space-y-6">
      <h2 className="text-xl font-bold border-l-4 border-primary pl-3">
        Upload Tugas Presentasi
      </h2>

      {feedback.msg && (
        <div className={`p-4 rounded-xl text-sm font-medium border ${
          feedback.type === 'success' 
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
            : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
        }`}>
          {feedback.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase">Kelompok</label>
            <select
              value={kelompok}
              onChange={(e) => setKelompok(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold"
              disabled={loading}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => (
                <option key={num} value={`Kelompok ${num}`}>👥 Kelompok {num}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase">Mata Kuliah</label>
            <input
              type="text"
              value={matkul}
              onChange={(e) => setMatkul(e.target.value)}
              placeholder="Contoh: Filsafat Pendidikan Islam"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase">NIM Perwakilan</label>
            <input
              type="text"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              placeholder="NIM Pengumpul"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase">Nama Pengumpul</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama Lengkap"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase">
            File Tugas (DOCX, PPTX, PDF, ZIP — Maks. 5 MB)
          </label>
          <input
            type="file"
            accept=".docx,.doc,.pptx,.ppt,.pdf,.zip"
            onChange={handleFileChange}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary cursor-pointer"
            required
            disabled={loading}
          />
          {selectedFile && (
            <p className="text-[11px] text-emerald-500 font-mono mt-1">
              📁 Terpilih: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {loading ? 'Mengunggah Berkas Tugas...' : '🚀 Upload Tugas Sekarang'}
        </button>
      </form>
    </div>
  );
}