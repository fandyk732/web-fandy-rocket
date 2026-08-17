import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ScrollReveal from '@/components/ScrollReveal';

export const revalidate = 60;

async function getArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data;
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <main className="min-h-screen bg-background text-foreground py-24 px-6 max-w-6xl mx-auto">
      {/* Header dengan ScrollReveal */}
      <ScrollReveal>
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3">Articles & Thoughts</h1>
          <p className="text-muted-foreground">Berbagi pemikiran tentang web dev, edukasi, dan eksplorasi digital.</p>
        </div>
      </ScrollReveal>

      {/* Grid Artikel dengan Delay Stagger */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, i) => (
          <ScrollReveal key={article.id} delay={i * 100}>
            <Link
              href={`/articles/${article.slug}`}
              className="group flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:scale-[1.02]"
            >
              {article.cover_image && (
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    {article.category || 'Teknologi'}
                  </span>
                  <span>•</span>
                  <span>{article.reading_time || '5 min read'}</span>
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                  {article.excerpt}
                </p>
                <span className="text-xs font-mono text-muted-foreground">{article.date}</span>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </main>
  );
}