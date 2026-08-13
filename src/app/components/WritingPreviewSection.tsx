import React from 'react';

import SectionTitle from '@/components/SectionTitle';
import ArticleCard from '@/components/ArticleCard';
import ScrollReveal from '@/components/ScrollReveal';
import { articles } from '@/data/articles';

export default function WritingPreviewSection() {
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