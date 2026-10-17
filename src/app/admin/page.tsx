'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';
import { Power, Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
}

// ⚠️ Ganti dengan URL Deployment Apps Script kamu
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzl-dJ67vYAGtuA13tUodzNiMbes9G8F0UXAp9lgGUSd-Bn3u1p16n02APn5orJDdAI/exec';

export default function AdminDashboardPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // State Kontrol Absensi
  const [isAbsensiOpen, setIsAbsensiOpen] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(true);
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

  // Fetch Status Absensi dari Google Apps Script
  const fetchAbsensiStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await fetch(`${APPS_SCRIPT_URL}?action=getStatus`);
      const data = await res.json();
      setIsAbsensiOpen(data.status === 'BUKA');
    } catch (err) {
      console.error('Gagal mengambil status absensi:', err);
    } finally {
      setLoadingStatus(false);
    }
  };

  // Toggle Buka / Tutup Absensi di AdminDashboardPage.tsx
const handleToggleAbsensi = async () => {
  const nextStatus = !isAbsensiOpen ? 'BUKA' : 'TUTUP';
  const confirmChange = confirm(`Ubah status absensi menjadi ${nextStatus}?`);
  if (!confirmChange) return;

  setUpdatingStatus(true);
  try {
    const formData = new URLSearchParams();
    formData.append('action', 'setStatus');
    formData.append('status', nextStatus);

    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formData.toString(),
    });
    const data = await res.json();

    if (data.success) {
      setIsAbsensiOpen(data.status === 'BUKA');
    } else {
      alert('Gagal memperbarui status absensi: ' + data.message);
    }
  } catch (err) {
    console.error(err);
    alert('Terjadi kesalahan koneksi ke Apps Script');
  } finally {
    setUpdatingStatus(false);
  }
};

  // Fetch daftar artikel
  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      if (data.success) {
        setArticles(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchAbsensiStatus();
  }, []);

  // Handler Hapus Artikel
  const handleDelete = async (id: string, title: string) => {
    const confirmDelete = confirm(`Yakin mau hapus artikel: "${title}"?`);
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/articles?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setArticles((prev) => prev.filter((art) => art.id !== id));
      } else {
        alert(`Gagal menghapus: ${data.error}`);
      }
    } catch (err) {
      alert('Terjadi kesalahan server.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground py-16 px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola konten website dan kontrol portal absensi.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/create"
            className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
          >
            + Artikel Baru
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* CARD KONTROL ABSENSI MAHASISWA */}
      <div className="mb-10 p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-colors ${
              isAbsensiOpen ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
            }`}
          >
            <Power size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold">Kontrol Sesi Absensi</h2>
              {loadingStatus ? (
                <Loader2 size={14} className="animate-spin text-muted-foreground" />
              ) : isAbsensiOpen ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
                  <CheckCircle2 size={11} /> DIBUKA
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold bg-rose-500/10 text-rose-500 rounded-full border border-rose-500/20">
                  <XCircle size={11} /> DITUTUP
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isAbsensiOpen
                ? 'Mahasiswa saat ini BISA mengisi form absensi.'
                : 'Form absensi terkunci. Mahasiswa TIDAK BISA mengisi absensi.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleAbsensi}
          disabled={loadingStatus || updatingStatus}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
            isAbsensiOpen
              ? 'bg-rose-500 hover:bg-rose-600 text-white'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
          }`}
        >
          {updatingStatus ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <Power size={14} />
              <span>{isAbsensiOpen ? 'Tutup Absensi' : 'Buka Absensi Sekarang'}</span>
            </>
          )}
        </button>
      </div>

      {/* Content Table (Artikel) */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Memuat data artikel...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-2xl">
          <p className="text-muted-foreground mb-4">Belum ada artikel yang dibuat.</p>
          <Link href="/admin/create" className="text-primary font-semibold hover:underline">
            Buat artikel pertama sekarang →
          </Link>
        </div>
      ) : (
        <div className="border border-border rounded-2xl overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-mono uppercase text-muted-foreground">
                  <th className="py-4 px-6">Judul</th>
                  <th className="py-4 px-6">Kategori</th>
                  <th className="py-4 px-6">Tanggal</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-4 px-6 font-medium max-w-xs truncate">{article.title}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 text-xs bg-primary/10 text-primary rounded-full font-medium">
                        {article.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-muted-foreground">{article.date}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        href={`/admin/edit/${article.id}`}
                        className="px-3 py-1.5 text-xs font-semibold border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id, article.title)}
                        disabled={deletingId === article.id}
                        className="px-3 py-1.5 text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                      >
                        {deletingId === article.id ? 'Deleting...' : 'Hapus'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}