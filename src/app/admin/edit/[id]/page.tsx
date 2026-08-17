'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    category: '',
    readingTime: '',
    coverImage: '',
    youtubeId: '',
    metaTitle: '',
    metaDescription: '',
    content: '',
  });

  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch data artikel berdasarkan ID
  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        const res = await fetch('/api/articles');
        const data = await res.json();
        if (data.success) {
          const currentArticle = data.data.find((art: any) => art.id === id);
          if (currentArticle) {
            setFormData({
              title: currentArticle.title || '',
              slug: currentArticle.slug || '',
              excerpt: currentArticle.excerpt || '',
              category: currentArticle.category || '',
              readingTime: currentArticle.reading_time || '',
              coverImage: currentArticle.cover_image || '',
              youtubeId: currentArticle.youtube_id || '',
              metaTitle: currentArticle.meta_title || '',
              metaDescription: currentArticle.meta_description || '',
              content: currentArticle.content || '',
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    fetchArticleDetail();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const res = await fetch('/api/articles', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...formData }),
    });

    if (res.ok) {
      setMessage('✅ Artikel berhasil diperbarui!');
      setTimeout(() => router.push('/admin'), 1200);
    } else {
      setMessage('❌ Gagal memperbarui artikel.');
    }
    setLoading(false);
  };

  if (fetching) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Memuat data artikel...</div>;
  }

  return (
    <main className="min-h-screen bg-background text-foreground py-16 px-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
        <div>
          <Link href="/admin" className="text-xs text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Kembali ke Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Edit Artikel</h1>
        </div>
      </div>

      {message && <p className="mb-6 p-4 rounded-xl border border-border bg-card text-sm font-medium">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Judul Artikel</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Slug URL</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-mono text-muted-foreground"
              required
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Kategori</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Reading Time</label>
            <input
              type="text"
              value={formData.readingTime}
              onChange={(e) => setFormData({ ...formData, readingTime: e.target.value })}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Excerpt / Description</label>
          <textarea
            rows={2}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Isi Artikel (Markdown / HTML)</label>
          <textarea
            rows={10}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-mono"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          {loading ? 'Menyimpan...' : 'Simpan Perubahan 💾'}
        </button>
      </form>
    </main>
  );
}