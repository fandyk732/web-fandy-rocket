'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category?: string;
  date: string;
  reading_time?: string;
  cover_image?: string;
}

const ITEMS_PER_PAGE = 6; // 📌 Paginasi per 6 card

export default function ArticlesClient({ articles }: { articles: Article[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // 📌 Restore & Simpan Halaman Paginasi Terakhir di Session Storage
  useEffect(() => {
    const savedPage = sessionStorage.getItem('last_articles_page');
    if (savedPage) {
      setCurrentPage(Number(savedPage));
    }
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    sessionStorage.setItem('last_articles_page', String(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 📌 Fitur Search Filter berdasarkan Keyword
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const q = searchQuery.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.excerpt?.toLowerCase().includes(q) ||
        art.category?.toLowerCase().includes(q)
      );
    });
  }, [articles, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    sessionStorage.setItem('last_articles_page', '1');
  };

  // 📌 Hitung Paginasi (6 Items per Halaman)
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  return (
    <>
      {/* Header & Search Bar Input */}
      <ScrollReveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border pb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-3">Articles & Thoughts</h1>
            <p className="text-muted-foreground">Berbagi pemikiran tentang web dev, edukasi, dan eksplorasi digital.</p>
          </div>

          {/* Input Search */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                  sessionStorage.setItem('last_articles_page', '1');
                }}
                className="absolute right-3 top-2.5 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Grid Artikel dengan Delay Stagger */}
      {paginatedArticles.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {paginatedArticles.map((article, i) => (
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
      ) : (
        <div className="py-20 text-center border border-dashed border-border rounded-2xl mb-12">
          <p className="text-muted-foreground text-sm">Tidak ada artikel yang cocok dengan kata kunci "{searchQuery}".</p>
        </div>
      )}

      {/* Tombol Navigasi Paginasi */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-border bg-card rounded-xl text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors"
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 border rounded-xl text-sm font-medium transition-all ${
                currentPage === page
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:bg-muted text-foreground'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-border bg-card rounded-xl text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
}