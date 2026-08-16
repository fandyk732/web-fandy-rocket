export interface Project {
  slug: string;
  id: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  overview: string;
  problem: string;
  solution: string;
  impact: string[]; 
  category: string;
  tech: string[];
  status: 'live' | 'building' | 'completed';
  year: string;
  gradient: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: 'smk-digital-ecosystem',
    id: 'smk-digital-ecosystem',
    title: 'SMK Al Kaaffah Digital Ecosystem',
    description: 'A comprehensive digital platform for vocational school management, student data, and educational resources built from the ground up.',
    longDescription: 'Designed and developed a full-stack digital ecosystem for SMK Al Kaaffah — covering student information systems, learning resources, and administrative workflows. Reduced manual paperwork by 80% and improved teacher-student communication.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Sanity'],
    liveUrl: 'https://smk-alkaaffah-kepanjen.vercel.app',
    githubUrl: 'https://github.com/smk-digital-ecosystem',
    overview: 'A comprehensive digital platform for vocational school management, student data, and educational resources built from the ground up.',
    problem: 'Manual paperwork and inefficient communication between teachers and students.',
    solution: 'A full-stack digital ecosystem that streamlines administrative tasks and improves communication.',
    impact: [
      'Reduced manual paperwork by 80%',
      'Improved teacher-student communication',
      'Enhanced data management and reporting'
    ],
    category: 'Education Technology',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Sanity'],
    status: 'live',
    year: '2023',
    gradient: 'from-amber-900/40 via-stone-900/60 to-card',
    featured: true,
  },
  {
    slug: 'student-log-book',
    id: 'student-log-book',
    title: 'Student Wrong-Doing Log Book',
    description: 'A structured digital log system for tracking student behavior, interventions, and follow-up actions across vocational school grades.',
    longDescription: 'Replaced physical log books with a searchable, filterable digital system. Allows teachers to record incidents, assign follow-up tasks, and generate reports for parent communication.',
    techStack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
    liveUrl: 'https://bukupelanggaransiswaak.freedev.app/login.php?i=1',
    githubUrl: 'https://github.com/student-log-book',
    overview: 'A structured digital log system for tracking student behavior, interventions, and follow-up actions across vocational school grades.',
    problem: 'Inefficient tracking and management of student behavior and interventions.',
    solution: 'A searchable, filterable digital system that streamlines the logging and reporting process.',
    impact: [
      'Improved tracking of student behavior',
      'Enhanced communication with parents',
      'Streamlined administrative tasks'
    ],
    category: 'Education Technology',
    status: 'completed',
    year: '2023',
    gradient: 'from-rose-900/30 via-stone-900/60 to-card',
    featured: true,
    tech: []
  },
  {
    slug: 'tracer-study-system',
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
    techStack: [],
    overview: "",
    problem: "",
    solution: "",
    impact: []
  },
  {
    slug: 'digital-learning-resources',
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
    techStack: [],
    overview: "",
    problem: "",
    solution: "",
    impact: []
  },
];