'use client';

import { useState } from 'react';

export default function CreateArticlePage() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    category: 'Teknologi',
    readingTime: '5 min read',
    coverImage: '',
    youtubeId: '',
    metaTitle: '',
    metaDescription: '',
    content: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Auto-generate slug dari Title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData({ ...formData, title, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Kirim data artikel ke API endpoint
    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      }),
    });

    if (res.ok) {
      setMessage('✅ Artikel berhasil dibuat!');
      setFormData({ title: '', slug: '', excerpt: '', category: 'Teknologi', readingTime: '5 min read', coverImage: '', youtubeId: '', metaTitle: '', metaDescription: '', content: '' });
    } else {
      setMessage('❌ Gagal menyimpan artikel.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground py-16 px-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-bold">Tambah Artikel Baru</h1>
        <span className="mono-label text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full">Admin Mode</span>
      </div>

      {message && <p className="mb-6 p-4 rounded-xl border border-border bg-card text-sm font-medium">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Judul Artikel</label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Slug URL (Auto)</label>
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

        {/* Integration Links */}
        <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-4">
          <h3 className="text-xs font-mono uppercase text-muted-foreground">Media Integration</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium">ImageKit.io Cover URL</label>
            <input
              type="url"
              placeholder="https://ik.imagekit.io/username/image.jpg"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">YouTube Video ID (Tekno Channel)</label>
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
            rows={8}
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
          {loading ? 'Menyimpan...' : 'Publish Artikel 🚀'}
        </button>
      </form>
    </main>
  );
}