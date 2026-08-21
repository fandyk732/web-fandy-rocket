import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import TableOfContents from '@/components/TableOfContents';
import GiscusComments from '@/components/GiscusComments';

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

// Helper fungsi untuk bikin Slug ID yang bersih & konsisten
function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

async function getArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return { title: 'Artikel Tidak Ditemukan — Fandy Aziz' };

  const title = article.meta_title || article.title;
  const description = article.meta_description || article.excerpt || 'Baca artikel lengkap di Fandy Aziz Blog.';
  const imageUrl = article.cover_image || 'https://www.fandyalmana.my.id/assets/images/app_logo.png';

  return {
    title: `${title} — Fandy Aziz`,
    description,
    openGraph: {
      title,
      description,
      url: `https://fandyalmana.my.id/articles/${slug}`, // Sesuaikan tanpa www
      siteName: 'Fandy Aziz',
      type: 'article',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  // Custom Rendering Heading Markdown dengan ID yang Presisi
  const MarkdownComponents = {
    h2: ({ children }: any) => {
      const text = String(children);
      const id = slugify(text);
      return (
        <h2 id={id} className="scroll-mt-28 text-2xl font-bold mt-10 mb-4 text-foreground">
          {children}
        </h2>
      );
    },
    h3: ({ children }: any) => {
      const text = String(children);
      const id = slugify(text);
      return (
        <h3 id={id} className="scroll-mt-28 text-xl font-bold mt-8 mb-3 text-foreground">
          {children}
        </h3>
      );
    },
  };

  return (
    <article className="min-h-screen bg-background text-foreground py-24 px-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Tombol Back */}
      <Link
        href="/articles"
        className="text-sm text-muted-foreground hover:text-primary mb-8 inline-block transition-colors"
      >
        ← Kembali ke Semua Artikel
      </Link>

      {/* Header Judul */}
      <div className="space-y-4 mb-8 max-w-3xl">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="px-3 py-1 bg-primary/10 text-primary font-medium rounded-full text-xs">
            {article.category}
          </span>
          <span>•</span>
          <span>{article.date}</span>
          <span>•</span>
          <span>{article.reading_time}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          {article.title}
        </h1>
      </div>

      {/* Cover Image */}
      {article.cover_image && (
        <figure className="w-full max-w-4xl mx-auto mb-12">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border/50 bg-black/40">
            <img
              src={article.cover_image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-105 pointer-events-none"
            />
            <img
              src={article.cover_image}
              alt={article.title}
              className="relative z-10 w-full h-full object-contain mx-auto"
              loading="lazy"
            />
          </div>

          {/* 📷 Credit / Sumber Foto */}
          {article.cover_image_credit && (
            <figcaption className="mt-2.5 text-center text-xs text-muted-foreground italic font-sans">
              Foto: {article.cover_image_credit}
            </figcaption>
          )}
        </figure>
      )}

      {/* Grid Layout 2 Kolom: Kiri Konten (75%), Kanan TOC Sticky (25%) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 items-start">
        
        {/* Kolom Kiri: Isi Artikel */}
        <div className="w-full min-w-0">
          {/* TOC Khusus Mobile (Tampil Sebelum Konten) */}
          <div className="block lg:hidden mb-8">
            <TableOfContents content={article.content} />
          </div>

          <div className="prose prose-invert max-w-none leading-relaxed text-foreground/90 space-y-6">
            <ReactMarkdown components={MarkdownComponents}>
              {article.content}
            </ReactMarkdown>
          </div>

          {/* YouTube Embed */}
          {article.youtube_id && (
            <div className="aspect-video w-full rounded-2xl overflow-hidden my-12 border border-border shadow-lg">
              <iframe
                src={`https://www.youtube.com/embed/${article.youtube_id}`}
                title="YouTube video player"
                className="w-full h-full"
                allowFullScreen
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* Kolom Kanan: TOC Floating Sticky (Khusus Desktop) */}
        <div className="hidden lg:block sticky top-28">
          <TableOfContents content={article.content} />
        </div>

          <GiscusComments />

      </div>
    </article>
  );
}