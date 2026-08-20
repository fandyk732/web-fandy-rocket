import React from 'react';
import SectionTitle from '@/components/SectionTitle';
import ArticleCard from '@/components/ArticleCard';
import ScrollReveal from '@/components/ScrollReveal';
import { supabase } from '@/lib/supabase';


export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getLatestArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6);
  if (error) {
    console.error('Error fetching latest articles:', error);
    return [];
  }

  return data.map((art) => ({
    id: art.id,
    title: art.title,
    slug: art.slug,
    excerpt: art.excerpt,
    category: art.category,
    readingTime: art.reading_time,
    date: art.date,
    coverImage: art.cover_image,
    youtubeId: art.youtube_id,
    content: art.content,
    gradient: art.gradient || 'from-blue-500/20 to-purple-500/20', // <-- TAMBAHKAN INI (Nilai Default Gradient)
  }));
}

export default async function WritingPreviewSection() {
  const articles = await getLatestArticles();

  return (
    <section className="py-20 lg:py-24 px-6 lg:px-8 border-t border-border" aria-labelledby="writing-title">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <SectionTitle
              label="Writing"
              title="Thinking out loud."
              subtitle="Essays on education, technology, and building things that matter."
              id="writing-title"
            />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {articles?.map((article, i) => (
            <ScrollReveal key={article?.id} delay={i * 120}>
              <ArticleCard article={article} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}