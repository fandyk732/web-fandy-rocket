'use client';

import LogoutButton from '@/components/LogoutButton';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readingTime: string;
  coverImage: string;
  coverImageCredit: string;
  youtubeId: string;
  metaTitle: string;
  metaDescription: string;
  content: string;
}

export default function EditArticlePage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    slug: '',
    excerpt: '',
    category: 'Teknologi',
    readingTime: '5 min read',
    coverImage: '',
    coverImageCredit: '',
    youtubeId: '',
    metaTitle: '',
    metaDescription: '',
    content: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // ============================================================
  // LOAD ARTICLE
  // ============================================================

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/articles?id=${id}`);

        if (!res.ok) {
          throw new Error('Gagal mengambil data artikel.');
        }

        const result = await res.json();

        if (result.success && result.data) {
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
              coverImageCredit: art.cover_image_credit || '',
              youtubeId: art.youtube_id || '',
              metaTitle: art.meta_title || '',
              metaDescription: art.meta_description || '',
              content: art.content || '',
            });
          } else {
            setMessage('❌ Artikel tidak ditemukan.');
          }
        } else {
          setMessage('❌ Gagal memuat data artikel.');
        }
      } catch (err) {
        console.error('Fetch article error:', err);
        setMessage('❌ Gagal memuat data artikel.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchArticle();
    }
  }, [id]);

  // ============================================================
  // HANDLE INPUT
  // ============================================================

  const handleChange = (
    field: keyof ArticleFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ============================================================
  // UPDATE ARTICLE
  // ============================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      setMessage('❌ ID artikel tidak ditemukan.');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const res = await fetch('/api/articles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,

          // Basic article data
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          category: formData.category,
          readingTime: formData.readingTime,

          // Media
          coverImage: formData.coverImage,
          coverImageCredit: formData.coverImageCredit,
          youtubeId: formData.youtubeId,

          // SEO
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,

          // Content
          content: formData.content,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(
          result.error ||
            result.message ||
            'Gagal mengupdate artikel.'
        );
      }

      setMessage('✅ Artikel berhasil diperbarui!');

      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 1200);
    } catch (err) {
      console.error('Update article error:', err);

      setMessage(
        err instanceof Error
          ? `❌ ${err.message}`
          : '❌ Gagal mengupdate artikel.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-muted-foreground">
            Memuat data artikel...
          </p>
        </div>
      </main>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="min-h-screen bg-background text-foreground py-16 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <Link
          href="/admin"
          className="text-sm text-muted-foreground hover:text-primary mb-8 inline-block transition-colors"
        >
          ← Kembali ke Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
          <h1 className="text-3xl font-bold">
            Edit Artikel
          </h1>

          <LogoutButton />
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 rounded-xl border border-border bg-card text-sm font-medium">
            {message}
          </div>
        )}

        {/* =====================================================
            FORM
        ====================================================== */}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ==================================================
              TITLE & SLUG
          =================================================== */}

          <div className="grid sm:grid-cols-2 gap-4">

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Judul Artikel
              </label>

              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  handleChange('title', e.target.value)
                }
                className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm"
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Slug URL
              </label>

              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  handleChange('slug', e.target.value)
                }
                className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-mono text-muted-foreground"
                required
              />

              <p className="text-xs text-muted-foreground">
                Hati-hati mengubah slug karena URL artikel akan ikut berubah.
              </p>
            </div>
          </div>

          {/* ==================================================
              CATEGORY & READING TIME
          =================================================== */}

          <div className="grid sm:grid-cols-2 gap-4">

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Kategori
              </label>

              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  handleChange('category', e.target.value)
                }
                className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm"
              />
            </div>

            {/* Reading Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Reading Time
              </label>

              <input
                type="text"
                value={formData.readingTime}
                onChange={(e) =>
                  handleChange('readingTime', e.target.value)
                }
                placeholder="10 min read"
                className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm"
              />
            </div>
          </div>

          {/* ==================================================
              MEDIA INTEGRATION
          =================================================== */}

          <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-4">

            <h3 className="text-xs font-mono uppercase text-muted-foreground">
              Media Integration
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">

              {/* Cover Image */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  ImageKit.io Cover URL
                </label>

                <input
                  type="url"
                  placeholder="https://ik.imagekit.io/..."
                  value={formData.coverImage}
                  onChange={(e) =>
                    handleChange('coverImage', e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm"
                />
              </div>

              {/* Credit */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Credit / Sumber Foto
                </label>

                <input
                  type="text"
                  placeholder="Koleksi Pribadi / Unsplash / John Doe"
                  value={formData.coverImageCredit}
                  onChange={(e) =>
                    handleChange(
                      'coverImageCredit',
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm"
                />
              </div>
            </div>

            {/* YouTube */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                YouTube Video ID
              </label>

              <input
                type="text"
                placeholder="Contoh: dQw4w9WgXcQ"
                value={formData.youtubeId}
                onChange={(e) =>
                  handleChange('youtubeId', e.target.value)
                }
                className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-mono"
              />

              <p className="text-xs text-muted-foreground">
                Masukkan hanya Video ID YouTube, bukan seluruh URL.
              </p>
            </div>
          </div>

          {/* ==================================================
              SEO SETUP
          =================================================== */}

          <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-4">

            <h3 className="text-xs font-mono uppercase text-muted-foreground">
              SEO Metadata
            </h3>

            {/* Meta Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Meta Title
              </label>

              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) =>
                  handleChange('metaTitle', e.target.value)
                }
                placeholder="Judul yang digunakan untuk SEO"
                className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm"
              />
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Meta Description
              </label>

              <textarea
                rows={3}
                value={formData.metaDescription}
                onChange={(e) =>
                  handleChange(
                    'metaDescription',
                    e.target.value
                  )
                }
                placeholder="Deskripsi singkat artikel untuk search engine..."
                className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm resize-y"
              />

              <p className="text-xs text-muted-foreground">
                Deskripsi khusus untuk mesin pencari. Berbeda dengan excerpt.
              </p>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Excerpt / Ringkasan Artikel
              </label>

              <textarea
                rows={3}
                value={formData.excerpt}
                onChange={(e) =>
                  handleChange('excerpt', e.target.value)
                }
                placeholder="Ringkasan singkat yang ditampilkan pada daftar artikel..."
                className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm resize-y"
                required
              />

              <p className="text-xs text-muted-foreground">
                Ringkasan artikel yang digunakan di halaman daftar artikel.
              </p>
            </div>
          </div>

          {/* ==================================================
              BODY CONTENT
          =================================================== */}

          <div className="space-y-2">

            <label className="text-sm font-medium">
              Isi Artikel (Markdown / HTML)
            </label>

            <textarea
              rows={20}
              value={formData.content}
              onChange={(e) =>
                handleChange('content', e.target.value)
              }
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm font-mono leading-6 resize-y"
              required
            />

            <p className="text-xs text-muted-foreground">
              Konten artikel akan dirender oleh halaman detail artikel.
            </p>
          </div>

          {/* ==================================================
              SUBMIT
          =================================================== */}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? 'Menyimpan...'
              : 'Simpan Perubahan 💾'}
          </button>

        </form>
      </div>
    </main>
  );
}