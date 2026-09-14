'use client';

import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

type Props = {
  value: string;
  onChange: (val: string) => void;
};

type MarkdownImageProps = {
  src?: string;
  alt?: string;
  title?: string;
};

export default function MarkdownEditor({ value, onChange }: Props) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Menyisipkan Markdown ke posisi cursor.
   */
  const insertTextAtCursor = (
    before: string,
    after: string = '',
    defaultText: string = ''
  ) => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selectedText =
      value.substring(start, end) || defaultText;

    const replacement =
      `${before}${selectedText}${after}`;

    const newValue =
      value.substring(0, start) +
      replacement +
      value.substring(end);

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();

      const selectionStart =
        start + before.length;

      const selectionEnd =
        selectionStart + selectedText.length;

      textarea.setSelectionRange(
        selectionStart,
        selectionEnd
      );
    }, 0);
  };

  /**
   * Menambahkan H2 / H3.
   *
   * Heading selalu dimulai dari baris baru
   * agar Markdown tetap valid dan rapi.
   */
  const handleInsertHeading = (level: 2 | 3) => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const before = value.substring(0, start);
    const selectedText = value.substring(start, end);
    const after = value.substring(end);

    const prefix = `${'#'.repeat(level)} `;

    const headingText =
      selectedText.trim() || `Heading ${level}`;

    const needsNewLine =
      before.length > 0 && !before.endsWith('\n');

    const leadingBreak =
      needsNewLine ? '\n\n' : '';

    const replacement =
      `${leadingBreak}${prefix}${headingText}`;

    const newValue =
      before +
      replacement +
      after;

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();

      const cursorPosition =
        before.length +
        leadingBreak.length +
        prefix.length +
        headingText.length;

      textarea.setSelectionRange(
        cursorPosition,
        cursorPosition
      );
    }, 0);
  };

  /**
   * Menambahkan gambar dengan:
   * 1. URL
   * 2. ALT TEXT
   * 3. CAPTION
   *
   * Format Markdown:
   *
   * ![ALT TEXT](URL "CAPTION")
   */
  const handleInsertImage = () => {
    const url = prompt(
      'Masukkan URL Gambar (ImageKit / Unsplash):'
    );

    if (!url?.trim()) return;

    const alt = prompt(
      'Masukkan ALT TEXT gambar:\n\nContoh: Aktivitas pemantauan gunung api menggunakan sensor digital'
    ) || '';

    const caption = prompt(
      'Masukkan CAPTION gambar:\n\nContoh: Teknologi dapat membantu manusia membaca data bencana secara lebih cepat.'
    ) || '';

    const imageMarkdown =
      `\n\n![${alt.trim()}](${url.trim()} "${caption.trim()}")\n\n`;

    insertTextAtCursor(imageMarkdown);
  };

  /**
   * Menambahkan blockquote / callout.
   */
  const handleInsertCallout = () => {
    const quote =
      '\n\n> 💡 **Catatan Penting:** Tulis poin atau highlight artikel di sini.\n\n';

    insertTextAtCursor(quote);
  };

  /**
   * Custom renderer untuk Live Preview.
   *
   * Dibuat mengikuti renderer di DetailArticlePage.
   */
  const PreviewComponents = {
    h1: ({ children }: any) => (
      <h1 className="text-3xl md:text-4xl font-bold leading-tight border-l-4 border-primary pl-3 my-8 text-foreground">
        {children}
      </h1>
    ),

    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold leading-tight border-l-4 border-primary pl-3 mt-10 mb-4 text-foreground">
        {children}
      </h2>
    ),

    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold leading-tight border-l-4 border-sky-400 pl-3 mt-8 mb-3 text-foreground">
        {children}
      </h3>
    ),

    p: ({ children }: any) => (
      <p className="my-5 leading-8 text-foreground/90">
        {children}
      </p>
    ),

    strong: ({ children }: any) => (
      <strong className="font-semibold text-foreground">
        {children}
      </strong>
    ),

    em: ({ children }: any) => (
      <em className="italic">
        {children}
      </em>
    ),

    a: ({ href, children }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-4 hover:opacity-80"
      >
        {children}
      </a>
    ),

    ul: ({ children }: any) => (
      <ul className="my-5 pl-6 list-disc space-y-2">
        {children}
      </ul>
    ),

    ol: ({ children }: any) => (
      <ol className="my-5 pl-6 list-decimal space-y-2">
        {children}
      </ol>
    ),

    li: ({ children }: any) => (
      <li className="leading-7">
        {children}
      </li>
    ),

    blockquote: ({ children }: any) => (
      <blockquote className="my-7 p-5 bg-muted/40 border-l-4 border-amber-400 rounded-r-xl text-foreground/90 italic">
        {children}
      </blockquote>
    ),

    img: ({
      src,
      alt,
      title,
    }: MarkdownImageProps) => (
      <figure className="my-8 bg-muted/20 p-2.5 rounded-2xl border border-border/60 shadow-sm">
        <img
          src={src}
          alt={alt || 'Gambar artikel'}
          className="w-full h-auto rounded-xl object-cover max-h-[500px]"
          loading="lazy"
        />

        {title && (
          <figcaption className="mt-3 px-3 text-center text-xs text-muted-foreground italic font-sans border-t border-border/30 pt-2">
            📷 {title}
          </figcaption>
        )}
      </figure>
    ),

    hr: () => (
      <hr className="my-10 border-border" />
    ),

    code: ({ children }: any) => (
      <code className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono">
        {children}
      </code>
    ),
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      {/* =========================
          TOOLBAR
      ========================== */}
      <div className="flex flex-wrap items-center justify-between border-b border-border bg-muted/30 px-3 py-2 gap-2">
        {/* Format */}
        <div className="flex items-center gap-1 flex-wrap">
          {/* H2 */}
          <button
            type="button"
            onClick={() => handleInsertHeading(2)}
            className="px-2.5 py-1 text-xs font-bold bg-background hover:bg-muted border border-border rounded-lg transition-colors"
            title="Tambah Heading 2"
          >
            H2
          </button>

          {/* H3 */}
          <button
            type="button"
            onClick={() => handleInsertHeading(3)}
            className="px-2.5 py-1 text-xs font-bold bg-background hover:bg-muted border border-border rounded-lg transition-colors"
            title="Tambah Heading 3"
          >
            H3
          </button>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Bold */}
          <button
            type="button"
            onClick={() =>
              insertTextAtCursor(
                '**',
                '**',
                'teks tebal'
              )
            }
            className="px-2.5 py-1 text-xs font-bold bg-background hover:bg-muted border border-border rounded-lg transition-colors"
            title="Teks Tebal"
          >
            B
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() =>
              insertTextAtCursor(
                '*',
                '*',
                'teks miring'
              )
            }
            className="px-2.5 py-1 text-xs italic font-semibold bg-background hover:bg-muted border border-border rounded-lg transition-colors"
            title="Teks Miring"
          >
            I
          </button>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Image */}
          <button
            type="button"
            onClick={handleInsertImage}
            className="px-2.5 py-1 text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 rounded-lg flex items-center gap-1 transition-colors"
            title="Sisipkan gambar"
          >
            🖼️ Sisip Gambar
          </button>

          {/* Callout */}
          <button
            type="button"
            onClick={handleInsertCallout}
            className="px-2.5 py-1 text-xs font-semibold bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg flex items-center gap-1 transition-colors"
            title="Tambah quote atau callout"
          >
            💡 Quote/Callout
          </button>
        </div>

        {/* =========================
            TAB SWITCHER
        ========================== */}
        <div className="flex items-center bg-background border border-border p-0.5 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'write'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Editor
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'preview'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Preview Artikel
          </button>
        </div>
      </div>

      {/* =========================
          CONTENT
      ========================== */}

      {activeTab === 'write' ? (
        <textarea
          ref={textareaRef}
          rows={18}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={`Tulis artikel kamu di sini...

Gunakan:
## H2
### H3
**teks tebal**
*teks miring*

Untuk gambar gunakan tombol "Sisip Gambar".`}
          className="w-full p-5 bg-transparent text-sm font-mono focus:outline-none leading-relaxed resize-y min-h-[420px]"
          required
        />
      ) : (
        <div className="p-6 md:p-8 max-w-none min-h-[420px] bg-background text-foreground">
          {value ? (
            <ReactMarkdown
              components={PreviewComponents}
            >
              {value}
            </ReactMarkdown>
          ) : (
            <p className="text-muted-foreground italic text-sm">
              Belum ada konten artikel untuk ditayangkan.
            </p>
          )}
        </div>
      )}
    </div>
  );
}