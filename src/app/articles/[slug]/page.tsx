import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';

export const revalidate = 60;

async function getArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data;
}

// 1. Definisikan tipe params sebagai Promise (Next.js 15 Requirement)
type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ArticleDetailPage({ params }: Props) {
  // 2. Await params-nya di sini!
  const { slug } = await params;
  
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-background text-foreground py-24 px-6 max-w-3xl mx-auto">
      <Link href="/articles" className="text-sm text-muted-foreground hover:text-primary mb-8 inline-block">
        ← Kembali ke Semua Artikel
      </Link>

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

      {article.cover_image && (
        <div className="rounded-2xl overflow-hidden mb-8 aspect-video">
          <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* YouTube Embed jika ada */}
      {article.youtube_id && (
        <div className="aspect-video w-full rounded-2xl overflow-hidden mb-8 border border-border">
          <iframe
            src={`https://www.youtube.com/embed/${article.youtube_id}`}
            title="YouTube video player"
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-invert max-w-none leading-relaxed text-foreground/90 space-y-4">
         <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>
    </article>
  );
}