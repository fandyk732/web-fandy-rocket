import React from 'react';
import type { Article } from '@/data/articles';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article
      className="group bg-card border border-border rounded-2xl overflow-hidden card-hover flex flex-col cursor-pointer"
      aria-label={`Article: ${article.title}`}
    >
      {/* Cover gradient */}
      <div className={`relative h-36 bg-gradient-to-br ${article.gradient} flex-shrink-0`}>
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-4 left-4">
          <span className="mono-label bg-background/70 text-muted-foreground border border-border px-3 py-1.5 rounded-full backdrop-blur-sm">
            {article.category}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          <span className="mono-label text-foreground/60">{article.readingTime}</span>
          <span className="mono-label text-muted-foreground">{article.date}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-3">
        <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors duration-300">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
          {article.excerpt}
        </p>
        <div className="mt-4 pt-4 border-t border-border">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all duration-200">
            Read Article
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}