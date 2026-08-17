import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import ScrollReveal from '@/components/ScrollReveal';

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

async function getArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  return (
    <article className="min-h-screen bg-background text-foreground py-24 px-6 max-w-3xl mx-auto">
      {/* Tombol Back */}
      <ScrollReveal delay={0}>
        <Link href="/articles" className="text-sm text-muted-foreground hover:text-primary mb-8 inline-block transition-colors">
          ← Kembali ke Semua Artikel
        </Link>
      </ScrollReveal>

      {/* Header Judul */}
      <ScrollReveal delay={100}>
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="px-3 py-1 bg-primary/10 text-primary font-medium rounded-full text-xs">
              {article.category}
            </span>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.reading_time}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">{article.title}</h1>
        </div>
      </ScrollReveal>

      {/* Cover Image */}
      {article.cover_image && (
        <ScrollReveal delay={200}>
          <div className="rounded-2xl overflow-hidden mb-8 aspect-video">
            <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
          </div>
        </ScrollReveal>
      )}

      {/* YouTube Embed */}
      {article.youtube_id && (
        <ScrollReveal delay={250}>
          <div className="aspect-video w-full rounded-2xl overflow-hidden mb-8 border border-border">
            <iframe
              src={`https://www.youtube.com/embed/${article.youtube_id}`}
              title="YouTube video player"
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </ScrollReveal>
      )}

      {/* Body Content */}
      <ScrollReveal delay={300}>
        <div className="prose prose-invert max-w-none leading-relaxed text-foreground/90 space-y-4">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
      </ScrollReveal>
    </article>
  );
}