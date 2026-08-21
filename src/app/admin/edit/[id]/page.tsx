'use client';

import LogoutButton from '@/components/LogoutButton';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditArticlePage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    category: 'Teknologi',
    readingTime: '5 min read',
    coverImage: '',
    coverImageCredit: '', // 📷 Credit Foto
    youtubeId: '',
    metaTitle: '',
    metaDescription: '',
    content: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch data artikel dari Supabase saat halaman dibuka
  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/articles?id=${id}`);
        const result = await res.json();

        if (result.success && result.data) {
          // Cari artikel yang sesuai dengan ID
          const art = Array.isArray(result.data) 
            ? result.data.find((item: any) => item.id === id) 
            : result.data;

          if (art) {
            setFormData({
              title: art.title || '',
              slug: art.slug || '',
              excerpt: art.excerpt || '',
              category: art.category || 'Teknologi',
              readingTime: art.reading_time || '5 min read',
              coverImage: art.cover_image || '',
              coverImageCredit: art.cover_image_credit || '', // Auto fill credit foto
              youtubeId: art.youtube_id || '',
              metaTitle: art.meta_title || '',
              metaDescription: art.meta_description || '',
              content: art.content || '',
            });
          }
        }
      } catch (err) {
        setMessage('❌ Gagal memuat data artikel.');
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchArticle();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    // Kirim update data artikel ke API route (PUT)
    const res = await fetch('/api/articles', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        ...formData,
      }),
    });

    if (res.ok) {
      setMessage('✅ Artikel berhasil diperbarui!');
      setTimeout(() => router.push('/admin'), 1500);
    } else {
      setMessage('❌ Gagal mengupdate artikel.');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground py-16 px-6 max-w-3xl mx-auto">
        <p className="text-center text-muted-foreground">Memuat data artikel...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground py-16 px-6 max-w-3xl mx-auto">
      <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary mb-8 inline-block transition-colors">
        ← Kembali ke Dashboard
      </Link>

      <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-bold">Edit Artikel</h1>
        <LogoutButton />
      </div>

      {message && <p className="mb-6 p-4 rounded-xl border border-border bg-card text-sm font-medium">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Slug */}
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

        {/* Category & Reading Time */}
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

        {/* Media Integration */}
        <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-4">
          <h3 className="text-xs font-mono uppercase text-muted-foreground">Media Integration</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ImageKit.io Cover URL</label>
              <input
                type="url"
                placeholder="https://ik.imagekit.io/..."
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Credit / Sumber Foto</label>
              <input
                type="text"
                placeholder="Unsplash / John Doe"
                value={formData.coverImageCredit}
                onChange={(e) => setFormData({ ...formData, coverImageCredit: e.target.value })}
                className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">YouTube Video ID</label>
            <input
              type="text"
              placeholder="Contoh: dQw4w9WgXcQ"
              value={formData.youtubeId}
              onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm"
            />
          </div>
        </div>

        {/* SEO Setup */}
        <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-4">
          <h3 className="text-xs font-mono uppercase text-muted-foreground">SEO Metadata</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium">Meta Title</label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Excerpt / Meta Description</label>
            <textarea
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm"
              required
            />
          </div>
        </div>

        {/* Body Content */}
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
          disabled={submitting}
          className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          {submitting ? 'Menyimpan...' : 'Simpan Perubahan 💾'}
        </button>
      </form>
    </main>
  );
}