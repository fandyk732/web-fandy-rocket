'use client';

import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';

const APPS_SCRIPT_KRS_URL =
  'https://script.google.com/macros/s/AKfycbzBNbR1Mem-KxaMSSnvA2Lt55fMQuWyDoQWQokut_LiIzFiXKtOqlKnC5HnLasq6lR1Bg/exec';

type KrsData = {
  timestamp: string;
  nim: string;
  nama: string;
  jenisDokumen: string;
  fileName: string;
  fileUrl: string;
  fileId: string;
};

export default function KrsUploadPage() {
  const [nim, setNim] = useState('');
  const [nama, setNama] = useState('');
  const [jenisDokumen, setJenisDokumen] = useState<'KRS' | 'KHS'>('KRS');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingMerge, setLoadingMerge] = useState(false);
  const [loadingRekap, setLoadingRekap] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });

  const [krsList, setKrsList] = useState<KrsData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'KRS' | 'KHS'>('ALL');

  // Fetch Rekap Data KRS/KHS
  const fetchKrsList = async () => {
    setLoadingRekap(true);
    try {
      const res = await fetch(APPS_SCRIPT_KRS_URL);
      const json = await res.json();
      if (json.success) {
        setKrsList(json.data);
      }
    } catch (err) {
      console.error('Gagal mengambil data:', err);
    } finally {
      setLoadingRekap(false);
    }
  };

  useEffect(() => {
    fetchKrsList();
  }, []);

  // Validasi File saat Pengguna Memilih File PDF
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // 1. Check file size 0 KB / Corrupt
    if (file.size === 0) {
      alert('❌ File yang dipilih kosong atau rusak (0 KB)! Silakan pilih file PDF yang valid.');
      e.target.value = '';
      setSelectedFile(null);
      return;
    }

    // 2. Check MIME Type & Extension
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('❌ Format file harus berupa PDF!');
      e.target.value = '';
      setSelectedFile(null);
      return;
    }

    // 3. Max size check (500 KB)
    const MAX_SIZE = 500 * 1024;
    if (file.size > MAX_SIZE) {
      alert('❌ Ukuran file terlalu besar! Maksimal ukuran file adalah 500 KB.');
      e.target.value = '';
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  // Conversion to Clean Base64 String
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Hanya ambil data base64 setelah koma
        const base64Data = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Submit Upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      return alert('Silakan pilih file PDF terlebih dahulu!');
    }

    setLoadingUpload(true);
    setFeedback({ type: '', msg: '' });

    try {
      // 💡 Clean/sanitize Nama & NIM dari karakter khusus, kurung, dan titik ganda
      const cleanNama = nama
        .trim()
        .replace(/[/\\?%*:|"<>()[\]]/g, '') // Hapus karakter khusus & tanda kurung
        .replace(/\s+/g, ' '); // Normalkan spasi ganda

      const cleanNim = nim.trim().replace(/[^0-9]/g, ''); // Hanya simpan angka NIM

      const customFileName = `${jenisDokumen}_${cleanNama}_${cleanNim}.pdf`;

      const base64Data = await fileToBase64(selectedFile);

      const payload = {
        nim: cleanNim,
        nama: nama.trim(),
        jenisDokumen: jenisDokumen,
        fileName: customFileName,
        fileData: base64Data,
      };

      const response = await fetch(APPS_SCRIPT_KRS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setFeedback({
          type: 'success',
          msg: `✅ File ${jenisDokumen} berhasil diupload!`,
        });
        setNim('');
        setNama('');
        setSelectedFile(null);
        fetchKrsList();
      } else {
        setFeedback({ type: 'error', msg: result.message });
      }
    } catch (err) {
      console.error('Upload error:', err);
      setFeedback({
        type: 'error',
        msg: '❌ Terjadi kesalahan pengiriman file. Coba lagi.',
      });
    } finally {
      setLoadingUpload(false);
    }
  };

  // Filter Data untuk Tabel
  const filteredKrs = krsList.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nim.includes(searchTerm) ||
      item.fileName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === 'ALL' || item.jenisDokumen === filterType;

    return matchesSearch && matchesType;
  });

  const sortedKrs = [...filteredKrs].reverse();

  // Helper Delay untuk Mencegah Rate Limit Apps Script
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Merge PDF via Apps Script Proxy dengan Safe Request & Delay
  const handleMergeAllPdf = async () => {
    if (sortedKrs.length === 0) {
      return alert('Belum ada file yang diupload untuk digabungkan!');
    }

    setLoadingMerge(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < sortedKrs.length; i++) {
        const item = sortedKrs[i];

        // Jeda 300ms antar file agar Apps Script tidak kena Limit/Timeout di HP
        if (i > 0) await delay(300);

        const res = await fetch(
          `${APPS_SCRIPT_KRS_URL}?action=getFile&fileId=${item.fileId}`
        );

        // Cek jika response bukan JSON / Error dari Google
        const textRes = await res.text();
        let json;
        try {
          json = JSON.parse(textRes);
        } catch (e) {
          console.error(`Error parsing file ${item.fileName}:`, textRes);
          throw new Error(
            `Gagal mengambil file ${item.fileName}. Batas request Google tercapai, coba lagi dalam beberapa detik.`
          );
        }

        if (!json.success || !json.base64) {
          throw new Error(json.message || `Gagal mengambil file ${item.fileName}`);
        }

        // Decode Base64 ke Uint8Array
        const binaryString = atob(json.base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let j = 0; j < binaryString.length; j++) {
          bytes[j] = binaryString.charCodeAt(j);
        }

        const pdf = await PDFDocument.load(bytes.buffer);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();

      const blob = new Blob([mergedPdfBytes.buffer as ArrayBuffer], {
        type: 'application/pdf',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);

      const titlePrefix =
        filterType === 'ALL' ? 'GABUNGAN_DOKUMEN' : `GABUNGAN_${filterType}`;
      link.download = `${titlePrefix}_MAHASISWA_${new Date().toISOString().slice(0, 10)}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error('Merge error:', err);
      alert(`❌ ${err.message || 'Gagal menggabungkan PDF.'}`);
    } finally {
      setLoadingMerge(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pt-28 pb-16 space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-4">
        <span className="text-xs font-mono tracking-wider uppercase px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
          Portal Dokumen Akademik
        </span>

        <h1 className="text-3xl md:text-4xl font-bold">
          Pengumpulan KRS & KHS Mahasiswa
        </h1>

        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Upload file KRS / KHS lo dalam format PDF (Maks. 500 KB).
        </p>
      </div>

      {/* Form Upload */}
      <div className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-sm space-y-6">
        <h2 className="text-xl font-bold border-l-4 border-primary pl-3">
          Form Upload Dokumen
        </h2>

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
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase">
                Jenis Dokumen
              </label>
              <select
                value={jenisDokumen}
                onChange={(e) =>
                  setJenisDokumen(e.target.value as 'KRS' | 'KHS')
                }
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-primary cursor-pointer font-semibold"
                disabled={loadingUpload}
              >
                <option value="KRS">📄 KRS (Kartu Riwayat Studi)</option>
                <option value="KHS">📜 KHS (Kartu Hasil Studi)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase">
                NIM Mahasiswa
              </label>
              <input
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="Contoh: 20252010573"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-primary"
                required
                disabled={loadingUpload}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama Lengkap sesuai SIAKAD"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-primary"
                required
                disabled={loadingUpload}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase">
              File Dokumen (PDF Only, Maks. 500 KB)
            </label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-primary file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
              required
              disabled={loadingUpload}
            />
            {selectedFile && (
              <p className="text-[11px] text-emerald-500 font-mono mt-1">
                📄 File terpilih: {selectedFile.name} (
                {(selectedFile.size / 1024).toFixed(1)} KB) ➔ Format otomatis:
                {jenisDokumen}_{nama || 'Nama'}_{nim || 'NIM'}.pdf
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loadingUpload}
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
          >
            {loadingUpload
              ? 'Uploading File ke Google Drive...'
              : `Upload ${jenisDokumen} Sekarang`}
          </button>
        </form>
      </div>

      {/* Tabel Status & Rekap Data */}
      <div className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-bold border-l-4 border-amber-500 pl-3">
              Daftar Pengumpulan Dokumen
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Data KRS & KHS mahasiswa yang telah terunggah secara real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchKrsList}
              disabled={loadingRekap}
              className="p-2.5 text-xs font-semibold bg-background hover:bg-muted border border-border rounded-xl transition-all shadow-sm flex items-center justify-center disabled:opacity-50"
              title="Refresh Data Tabel"
            >
              🔄 {loadingRekap ? '...' : 'Refresh'}
            </button>

            <button
              type="button"
              onClick={handleMergeAllPdf}
              disabled={loadingMerge || sortedKrs.length === 0}
              className="px-4 py-2.5 text-xs font-semibold bg-emerald-500 text-black hover:bg-emerald-400 border border-emerald-500/30 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loadingMerge
                ? '⏳ Menggabungkan...'
                : `⚡ Download & Merge (${sortedKrs.length} File)`}
            </button>
          </div>
        </div>

        {/* Filter Tab & Input Cari */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <div className="flex items-center gap-1.5 p-1 bg-muted/40 border border-border rounded-xl">
            <button
              type="button"
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'ALL'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Semua ({krsList.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('KRS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'KRS'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              KRS ({krsList.filter((i) => i.jenisDokumen === 'KRS').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('KHS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'KHS'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              KHS ({krsList.filter((i) => i.jenisDokumen === 'KHS').length})
            </button>
          </div>

          <div className="max-w-xs">
            <input
              type="text"
              placeholder="🔍 Cari Nama, NIM, atau File..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Table Rekap */}
        <div className="overflow-x-auto overflow-y-auto max-h-[500px] border border-border rounded-xl">
          <table className="w-full text-left text-xs relative">
            <thead className="bg-muted/90 backdrop-blur border-b border-border text-muted-foreground uppercase font-mono sticky top-0 z-10">
              <tr>
                <th className="p-3">Waktu</th>
                <th className="p-3">NIM</th>
                <th className="p-3">Nama Mahasiswa</th>
                <th className="p-3">Jenis</th>
                <th className="p-3">Nama File Format</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loadingRekap ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-4 text-center text-muted-foreground italic"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : sortedKrs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-4 text-center text-muted-foreground italic"
                  >
                    Belum ada data pengumpulan.
                  </td>
                </tr>
              ) : (
                sortedKrs.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-3 font-mono text-muted-foreground">
                      {item.timestamp}
                    </td>
                    <td className="p-3 font-mono font-semibold">{item.nim}</td>
                    <td className="p-3 font-medium text-foreground">
                      {item.nama}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.jenisDokumen === 'KHS'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        }`}
                      >
                        {item.jenisDokumen}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-muted-foreground">
                      {item.fileName}
                    </td>
                    <td className="p-3 text-center">
                      <a
                        href={`https://drive.google.com/uc?export=download&id=${item.fileId}`}
                        download={item.fileName}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors text-[11px] font-semibold"
                      >
                        📥 Download
                      </a>
                    </td>
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