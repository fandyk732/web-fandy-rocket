import { supabase } from '@/lib/supabase';
import ArticlesClient from './ArticlesClient';

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
      <ArticlesClient articles={articles} />
    </main>
  );
}