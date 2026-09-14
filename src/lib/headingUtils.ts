export type HeadingItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

/**
 * Mengubah React children / nilai heading
 * menjadi plain text.
 *
 * Contoh:
 *
 * "AI sebagai "
 * <strong>mata kedua</strong>
 *
 * menjadi:
 *
 * "AI sebagai mata kedua"
 */
export function extractText(
  value: unknown
): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number'
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => extractText(item))
      .join('');
  }

  if (
    typeof value === 'object' &&
    'props' in value
  ) {
    const props = (
      value as {
        props?: {
          children?: unknown;
        };
      }
    ).props;

    return extractText(props?.children);
  }

  return '';
}

/**
 * Membuat slug heading.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[`*_~]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

/**
 * Membuat ID unik untuk heading.
 *
 * Heading pertama:
 * ai-as-second-set-of-eyes
 *
 * Heading kedua dengan nama sama:
 * ai-as-second-set-of-eyes-2
 */
export function createUniqueHeadingId(
  text: string,
  usedIds: Map<string, number>
): string {
  const baseId =
    slugify(text) || 'heading';

  const currentCount =
    usedIds.get(baseId) || 0;

  const nextCount =
    currentCount + 1;

  usedIds.set(
    baseId,
    nextCount
  );

  if (nextCount === 1) {
    return baseId;
  }

  return `${baseId}-${nextCount}`;
}

/**
 * Mengekstrak H2 dan H3 dari Markdown.
 *
 * Algoritma ID di sini harus sama dengan
 * yang digunakan oleh renderer halaman artikel.
 */
export function extractHeadings(
  content: string
): HeadingItem[] {
  const lines = content.split('\n');

  const headings: HeadingItem[] = [];

  const usedIds =
    new Map<string, number>();

  lines.forEach((line) => {
    const match =
      line.match(/^(#{2,3})\s+(.+)$/);

    if (!match) return;

    const level =
      match[1].length as 2 | 3;

    const text = match[2]
      .replace(/[`*_~]/g, '')
      .trim();

    const id =
      createUniqueHeadingId(
        text,
        usedIds
      );

    headings.push({
      id,
      text,
      level,
    });
  });

  return headings;
}