'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Download, Loader2, RefreshCw } from 'lucide-react';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  webViewLink?: string;
  webContentLink?: string;
}

export default function MateriSection() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GDRIVE_API_KEY;
  const folderId = process.env.NEXT_PUBLIC_GDRIVE_FOLDER_ID;

  const fetchDriveFiles = async () => {
    if (!apiKey || !folderId) {
      setError('API Key atau Folder ID belum dikonfigurasi di .env.local');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Query untuk mengambil file publik dari Google Drive
      const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
      const fields = encodeURIComponent('files(id, name, mimeType, size, createdTime, webViewLink, webContentLink)');
      const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&orderBy=createdTime%20desc&key=${apiKey}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message || 'Gagal mengambil materi');
      }

      setFiles(data.files || []);
    } catch (err: any) {
      console.error('Drive API Error:', err);
      setError(err.message || 'Gagal memuat materi perkuliahan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriveFiles();
  }, []);

  // Format Helper: Byte ke MB / KB
  const formatFileSize = (bytes?: string) => {
    if (!bytes) return 'File Drive';
    const num = parseInt(bytes, 10);
    if (isNaN(num)) return 'File Drive';
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    return `${(num / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Format Helper: Tanggal Upload
  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="p-5 md:p-8 rounded-2xl bg-card border border-border shadow-sm space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between border-l-4 border-primary pl-3">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-foreground">Materi & Modul Perkuliahan</h2>
          <p className="text-[11px] md:text-xs text-muted-foreground mt-0.5">
            Diunggah langsung oleh Dosen Pengampu
          </p>
        </div>

        <button
          onClick={fetchDriveFiles}
          disabled={loading}
          title="Refresh Materi"
          className="p-2 text-muted-foreground hover:text-foreground rounded-xl border border-border hover:bg-accent transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* State Handling: Loading, Error, Empty, List */}
      {loading ? (
        <div className="flex items-center justify-center py-10 gap-2 text-xs text-muted-foreground">
          <Loader2 className="animate-spin text-primary" size={18} />
          <span>Sinkronisasi materi dari Google Drive...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs">
          {error}
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-10 bg-background/40 rounded-xl border border-dashed border-border">
          <FileText className="mx-auto text-muted-foreground/60 mb-2" size={32} />
          <p className="text-xs font-semibold text-muted-foreground">Belum ada materi diunggah</p>
          <p className="text-[11px] text-muted-foreground/70 mt-0.5">
            Materi akan otomatis tampil di sini saat dosen mengunggahnya
          </p>
        </div>
      ) : (
        /* Container List File dengan Scrollbar & Max Height agar tidak makan tempat */
        <div className="max-h-[360px] md:max-h-[420px] overflow-y-auto pr-1 space-y-2.5 pt-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {files.map((file) => {
              const isPdf = file.mimeType.includes('pdf');
              const downloadUrl = file.webContentLink || file.webViewLink || '#';

              return (
                <div
                  key={file.id}
                  className="p-3.5 rounded-xl border border-border bg-background/50 hover:border-primary/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3 w-full sm:w-auto overflow-hidden">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 group-hover:scale-105 transition-transform ${
                        isPdf
                          ? 'bg-rose-500/10 text-rose-500'
                          : 'bg-blue-500/10 text-blue-500'
                      }`}
                    >
                      {isPdf ? 'PDF' : 'DOC'}
                    </div>

                    {/* Nama file bisa sampai 2 baris (line-clamp-2) & tidak terpotong konyol */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors break-words">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatFileSize(file.size)} • {formatDate(file.createdTime)}
                      </p>
                    </div>
                  </div>

                  {/* Tombol Download di Mobile menyesuaikan lebar */}
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-3 py-2 sm:py-1.5 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-black text-xs font-bold transition-all shrink-0 flex items-center justify-center gap-1.5"
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}