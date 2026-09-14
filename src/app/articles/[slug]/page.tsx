import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { supabase } from '@/lib/supabase';
import TableOfContents from '@/components/TableOfContents';
import GiscusComments from '@/components/GiscusComments';

import {
  createUniqueHeadingId,
  extractText,
} from '@/lib/headingUtils';

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  category?: string | null;
  cover_image?: string | null;
  cover_image_credit?: string | null;
  published_at?: string | null;
  reading_time?: number | null;
  meta_title?: string | null;
  meta_description?: string | null;
  youtube_id?: string | null;
}

/* =========================================================
   GET ARTICLE
========================================================= */

async function getArticleBySlug(
  slug: string
): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Article;
}

/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan',
    };
  }

  const title =
    article.meta_title || article.title;

  const description =
    article.meta_description ||
    article.excerpt ||
    `Baca artikel ${article.title}.`;

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      type: 'article',

      ...(article.cover_image
        ? {
            images: [
              {
                url: article.cover_image,
                width: 1200,
                height: 630,
                alt: article.title,
              },
            ],
          }
        : {}),
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,

      ...(article.cover_image
        ? {
            images: [article.cover_image],
          }
        : {}),
    },
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function DetailArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  /*
   * Menyimpan ID heading yang sudah digunakan.
   *
   * Contoh:
   *
   * ## AI dan Pendidikan
   * ## AI dan Pendidikan
   *
   * menjadi:
   *
   * #ai-dan-pendidikan
   * #ai-dan-pendidikan-2
   */

  const headingIds = new Map<string, number>();

  /* =======================================================
     MARKDOWN COMPONENTS
  ======================================================= */

  const MarkdownComponents = {
    /* -------------------------------------------------------
       PARAGRAPH
    ------------------------------------------------------- */

    p: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => (
      <p className="mb-6 leading-8 text-muted-foreground">
        {children}
      </p>
    ),

    /* -------------------------------------------------------
       H2
    ------------------------------------------------------- */

    h2: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => {
      const text = extractText(children);

      const id = createUniqueHeadingId(
        text,
        headingIds
      );

      return (
        <h2
          id={id}
          className="
            mt-14
            mb-6
            scroll-mt-28
            border-l-2
            border-[#D4AF37]/80
            pl-5
            text-2xl
            font-bold
            tracking-tight
            text-foreground
            md:text-3xl
          "
        >
          {children}
        </h2>
      );
    },

    /* -------------------------------------------------------
       H3
    ------------------------------------------------------- */

    h3: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => {
      const text = extractText(children);

      const id = createUniqueHeadingId(
        text,
        headingIds
      );

      return (
        <h3
          id={id}
          className="
            mt-10
            mb-4
            scroll-mt-28
            text-xl
            font-semibold
            tracking-tight
            text-foreground
            md:text-2xl
          "
        >
          {children}
        </h3>
      );
    },

    /* -------------------------------------------------------
       STRONG
    ------------------------------------------------------- */

    strong: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => (
      <strong className="font-semibold text-foreground">
        {children}
      </strong>
    ),

    /* -------------------------------------------------------
       EMPHASIS
    ------------------------------------------------------- */

    em: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => (
      <em className="italic text-foreground/90">
        {children}
      </em>
    ),

    /* -------------------------------------------------------
       STRIKETHROUGH
       Supported by remark-gfm
    ------------------------------------------------------- */

    del: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => (
      <del className="text-muted-foreground">
        {children}
      </del>
    ),

    /* -------------------------------------------------------
       LINKS
    ------------------------------------------------------- */

    a: ({
      children,
      href,
    }: {
      children?: React.ReactNode;
      href?: string;
    }) => {
      const isExternal =
        href?.startsWith('http');

      return (
        <a
          href={href}
          target={
            isExternal ? '_blank' : undefined
          }
          rel={
            isExternal
              ? 'noopener noreferrer'
              : undefined
          }
          className="
            font-medium
            text-primary
            underline
            decoration-primary/30
            underline-offset-4
            transition-colors
            hover:decoration-primary
          "
        >
          {children}
        </a>
      );
    },

    /* -------------------------------------------------------
       UNORDERED LIST
    ------------------------------------------------------- */

    ul: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => (
      <ul
        className="
          mb-6
          ml-6
          list-disc
          space-y-2
          text-muted-foreground
        "
      >
        {children}
      </ul>
    ),

    /* -------------------------------------------------------
       ORDERED LIST
    ------------------------------------------------------- */

    ol: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => (
      <ol
        className="
          mb-6
          ml-6
          list-decimal
          space-y-2
          text-muted-foreground
        "
      >
        {children}
      </ol>
    ),

    /* -------------------------------------------------------
       LIST ITEM
    ------------------------------------------------------- */

    li: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => (
      <li className="pl-1 leading-7">
        {children}
      </li>
    ),

    /* -------------------------------------------------------
       CHECKBOX
       remark-gfm generates input elements for:
       - [ ] Task
       - [x] Done
    ------------------------------------------------------- */

    input: ({
      type,
      checked,
      disabled,
    }: {
      type?: string;
      checked?: boolean;
      disabled?: boolean;
    }) => {
      if (type !== 'checkbox') {
        return null;
      }

      return (
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          readOnly
          className="
            mr-2
            h-4
            w-4
            align-middle
            accent-primary
          "
        />
      );
    },

    /* -------------------------------------------------------
       BLOCKQUOTE
    ------------------------------------------------------- */

    blockquote: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => (
      <blockquote
        className="
          my-8
          border-l-4
          border-primary/60
          rounded-r-xl
          bg-card/40
          px-6
          py-5
          italic
          text-muted-foreground
        "
      >
        {children}
      </blockquote>
    ),

    /* -------------------------------------------------------
       IMAGE

       Markdown:

       ![Alt text](image-url "Caption")
    ------------------------------------------------------- */

    img: ({
      src,
      alt,
      title,
    }: {
      src?: string;
      alt?: string;
      title?: string;
    }) => {
      if (!src) {
        return null;
      }

      return (
        <figure className="my-10">
          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-border/50
              bg-card/20
            "
          >
            <img
              src={src}
              alt={
                alt || 'Gambar artikel'
              }
              title={
                title || undefined
              }
              loading="lazy"
              className="
                mx-auto
                h-auto
                w-full
                object-contain
              "
            />
          </div>

          {title && (
            <figcaption
              className="
                mt-3
                text-center
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              {title}
            </figcaption>
          )}
        </figure>
      );
    },

    /* -------------------------------------------------------
       TABLE
       Supported by remark-gfm
    ------------------------------------------------------- */

    table: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => (
      <div className="my-8 overflow-x-auto rounded-xl border border-border/60">
        <table className="w-full border-collapse text-sm">
          {children}
        </table>
      </div>
    ),

    /* -------------------------------------------------------
       TABLE HEAD
    ------------------------------------------------------- */

    thead: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => (
      <thead className="bg-card/60">
        {children}
      </thead>
    ),

    /* -------------------------------------------------------
       TABLE BODY
    ------------------------------------------------------- */

    tbody: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => (
      <tbody>
        {children}
      </tbody>
    ),

    /* -------------------------------------------------------
       TABLE ROW
    ------------------------------------------------------- */

    tr: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => (
      <tr className="border-b border-border/50 last:border-0">
        {children}
      </tr>
    ),

    /* -------------------------------------------------------
       TABLE HEADER
    ------------------------------------------------------- */

    th: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => (
      <th
        className="
          px-4
          py-3
          text-left
          font-semibold
          text-foreground
        "
      >
        {children}
      </th>
    ),

    /* -------------------------------------------------------
       TABLE CELL
    ------------------------------------------------------- */

    td: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => (
      <td
        className="
          px-4
          py-3
          align-top
          text-muted-foreground
        "
      >
        {children}
      </td>
    ),

    /* -------------------------------------------------------
       HORIZONTAL RULE
    ------------------------------------------------------- */

    hr: () => (
      <hr className="my-12 border-border/60" />
    ),

    /* -------------------------------------------------------
       INLINE CODE
    ------------------------------------------------------- */

    code: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => (
      <code
        className="
          rounded
          bg-muted
          px-1.5
          py-0.5
          font-mono
          text-sm
          text-foreground
        "
      >
        {children}
      </code>
    ),

    /* -------------------------------------------------------
       CODE BLOCK
    ------------------------------------------------------- */

    pre: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => (
      <pre
        className="
          my-8
          overflow-x-auto
          rounded-2xl
          border
          border-border/60
          bg-black/30
          p-5
          text-sm
          leading-7
        "
      >
        {children}
      </pre>
    ),
  };

  /* =======================================================
     DATE
  ======================================================= */

  const formattedDate =
    article.published_at
      ? new Intl.DateTimeFormat(
          'id-ID',
          {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }
        ).format(
          new Date(article.published_at)
        )
      : null;

  /* =======================================================
     YOUTUBE
  ======================================================= */

  const youtubeId =
    article.youtube_id || null;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen pb-20">

      {/* =================================================
          HEADER
      ================================================= */}

      <header
        className="
          mx-auto
          max-w-5xl
          px-6
          pt-16
          md:pt-24
        "
      >

        {/* Back */}

        <Link
          href="/articles"
          className="
            mb-8
            inline-flex
            items-center
            gap-2
            text-sm
            text-muted-foreground
            transition-colors
            hover:text-foreground
          "
        >
          ← Kembali ke artikel
        </Link>

        {/* Meta */}

        <div
          className="
            mb-5
            flex
            flex-wrap
            items-center
            gap-3
            text-xs
            font-mono
            uppercase
            tracking-wider
            text-muted-foreground
          "
        >

          {article.category && (
            <span className="text-primary">
              {article.category}
            </span>
          )}

          {article.category &&
            formattedDate && (
              <span>•</span>
            )}

          {formattedDate && (
            <span>
              {formattedDate}
            </span>
          )}

          {article.reading_time && (
            <>
              <span>•</span>

              <span>
                {article.reading_time}{' '}
                min read
              </span>
            </>
          )}

        </div>

        {/* Title */}

        <h1
          className="
            max-w-4xl
            text-4xl
            font-bold
            leading-tight
            tracking-tight
            text-foreground
            md:text-6xl
          "
        >
          {article.title}
        </h1>

        {/* Excerpt */}

        {article.excerpt && (
          <p
            className="
              mt-6
              max-w-3xl
              text-lg
              leading-8
              text-muted-foreground
              md:text-xl
            "
          >
            {article.excerpt}
          </p>
        )}

      </header>

      {/* =================================================
          COVER IMAGE
      ================================================= */}

      {article.cover_image && (
        <div
          className="
            mx-auto
            mt-12
            max-w-5xl
            px-6
          "
        >

          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border
              border-border/50
            "
          >

            {/* Blurred Background */}

            <div
              className="
                absolute
                inset-0
                scale-110
                opacity-30
                blur-3xl
              "
              style={{
                backgroundImage:
                  `url(${article.cover_image})`,
                backgroundSize: 'cover',
                backgroundPosition:
                  'center',
              }}
            />

            {/* Main Image */}

            <div
              className="
                relative
                bg-background/40
                p-2
                md:p-3
              "
            >
              <img
                src={article.cover_image}
                alt={article.title}
                loading="eager"
                className="
                  mx-auto
                  max-h-[650px]
                  w-full
                  rounded-2xl
                  object-contain
                "
              />
            </div>

          </div>

          {/* Cover Image Credit */}

          {article.cover_image_credit && (
            <p
              className="
                mt-3
                text-right
                text-xs
                text-muted-foreground
              "
            >
              {article.cover_image_credit}
            </p>
          )}

        </div>
      )}

      {/* =================================================
          MOBILE TABLE OF CONTENTS
      ================================================= */}

      <div
        className="
          mx-auto
          mt-10
          max-w-6xl
          px-6
          lg:hidden
        "
      >
        <TableOfContents
          content={article.content}
        />
      </div>

      {/* =================================================
          CONTENT + DESKTOP TOC
      ================================================= */}

      <div
        className="
          mx-auto
          mt-14
          grid
          max-w-6xl
          grid-cols-1
          gap-12
          px-6
          lg:grid-cols-[minmax(0,1fr)_280px]
        "
      >

        {/* =================================================
            ARTICLE CONTENT
        ================================================= */}

        <article
          className="
            prose
            prose-invert
            max-w-none
            text-base
            leading-8
          "
        >

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={MarkdownComponents}
          >
            {article.content}
          </ReactMarkdown>

          {/* =================================================
              YOUTUBE
          ================================================= */}

          {youtubeId && (
            <div
              className="
                my-12
                aspect-video
                overflow-hidden
                rounded-2xl
                border
                border-border/50
              "
            >
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={article.title}
                className="h-full w-full"
                loading="lazy"
                allow="
                  accelerometer;
                  autoplay;
                  clipboard-write;
                  encrypted-media;
                  gyroscope;
                  picture-in-picture
                "
                allowFullScreen
              />
            </div>
          )}

        </article>

        {/* =================================================
            DESKTOP TOC
        ================================================= */}

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents
              content={article.content}
            />
          </div>
        </aside>

      </div>

      {/* =================================================
          COMMENTS
      ================================================= */}

      <div
        className="
          mx-auto
          mt-16
          max-w-4xl
          px-6
        "
      >
        <GiscusComments />
      </div>

    </main>
  );
}