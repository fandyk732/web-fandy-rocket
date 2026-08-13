export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  tech: string[];
  status: 'live' | 'building' | 'completed';
  year: string;
  gradient: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: 'smk-digital-ecosystem',
    title: 'SMK Al Kaaffah Digital Ecosystem',
    description: 'A comprehensive digital platform for vocational school management, student data, and educational resources built from the ground up.',
    longDescription: 'Designed and developed a full-stack digital ecosystem for SMK Al Kaaffah — covering student information systems, learning resources, and administrative workflows. Reduced manual paperwork by 80% and improved teacher-student communication.',
    category: 'Education Technology',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Sanity'],
    status: 'live',
    year: '2023',
    gradient: 'from-amber-900/40 via-stone-900/60 to-card',
    featured: true,
  },
  {
    id: 'student-log-book',
    title: 'Student Wrong-Doing Log Book',
    description: 'A structured digital log system for tracking student behavior, interventions, and follow-up actions across vocational school grades.',
    longDescription: 'Replaced physical log books with a searchable, filterable digital system. Allows teachers to record incidents, assign follow-up tasks, and generate reports for parent communication.',
    category: 'Education Technology',
    tech: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
    status: 'completed',
    year: '2023',
    gradient: 'from-rose-900/30 via-stone-900/60 to-card',
    featured: true,
  },
  {
    id: 'tracer-study-system',
    title: 'Tracer Study System',
    description: 'Alumni tracking and career outcome monitoring platform for vocational graduates — measuring employment rates and industry placement.',
    longDescription: 'Built an end-to-end tracer study system that automates alumni surveys, tracks employment status, and generates BSNP-compliant reports. Currently tracking 240+ alumni.',
    category: 'Data & Career',
    tech: ['React', 'TypeScript', 'Chart.js', 'Supabase'],
    status: 'live',
    year: '2022',
    gradient: 'from-blue-900/30 via-stone-900/60 to-card',
    featured: true,
  },
  {
    id: 'digital-learning-resources',
    title: 'Digital Learning Resources',
    description: 'A curated library of interactive learning materials, video lessons, and assessments for vocational networking and IT curriculum.',
    longDescription: 'Developed a structured content system with multimedia resources aligned to national competency standards. Includes interactive quizzes, video modules, and downloadable materials for 300+ internship students.',
    category: 'Instructional Design',
    tech: ['Next.js', 'MDX', 'Tailwind CSS', 'Vercel'],
    status: 'building',
    year: '2024',
    gradient: 'from-emerald-900/30 via-stone-900/60 to-card',
    featured: false,
  },
];