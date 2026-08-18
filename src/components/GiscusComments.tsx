'use client';

import Giscus from '@giscus/react';

export default function GiscusComments() {
  return (
    <section className="mt-16 pt-8 border-t border-border/60">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span>💬</span> Komentar & Diskusi
      </h3>
      
      <Giscus
        id="comments"
        repo="fandyk732/web-fandy-rocket" // Repositori GitHub lo
        repoId="R_kgDOT3jVvw"    // Diisi nanti dari langkah 2
        category="Announcements"          // Atau nama category Discussion di repo lo
        categoryId="DIC_kwDOT3jVv84DDqXr" // Diisi nanti dari langkah 2
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="noborder_dark"              // Tema gelap yang cocok sama web lo
        lang="id"
        loading="lazy"
      />
    </section>
  );
}