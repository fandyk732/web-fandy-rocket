export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  date: string;
  gradient: string;
  slug: string;
}

export const articles: Article[] = [
  {
    id: 'digital-transformation-smk',
    title: 'How I Digitized a Vocational School in 18 Months',
    excerpt: 'A practical account of transforming analog school operations into a connected digital ecosystem — the wins, failures, and lessons learned.',
    category: 'Digital Transformation',
    readingTime: '8 min read',
    date: 'Jan 2025',
    gradient: 'from-amber-900/50 to-stone-900',
    slug: 'digital-transformation-smk',
  },
  {
    id: 'teaching-networking-vocational',
    title: 'Teaching Cisco Networking to Vocational Students',
    excerpt: 'Why hands-on labs beat theory every time, and how I redesigned the networking curriculum to match real industry expectations.',
    category: 'Education',
    readingTime: '6 min read',
    date: 'Nov 2024',
    gradient: 'from-blue-900/50 to-stone-900',
    slug: 'teaching-networking-vocational',
  },
  {
    id: 'tracer-study-system-build',
    title: 'Building a Tracer Study System from Zero',
    excerpt: 'The story behind building an alumni tracking system that actually gets used — design decisions, tech choices, and adoption strategy.',
    category: 'Product & Engineering',
    readingTime: '10 min read',
    date: 'Sep 2024',
    gradient: 'from-emerald-900/50 to-stone-900',
    slug: 'tracer-study-system-build',
  },
];