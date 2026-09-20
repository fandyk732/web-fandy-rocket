import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// Instance Supabase Server-Side
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fandyalmana.my.id';

  // 1. Ambil data slug & tanggal artikel dari Supabase
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, created_at');

  // Format URL artikel dinamis
  const articleRoutes: MetadataRoute.Sitemap = (articles || []).map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: article.created_at ? new Date(article.created_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 2. Daftar Halaman Statis Utama
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Gabungkan halaman statis dan artikel dinamis
  return [...staticRoutes, ...articleRoutes];
}