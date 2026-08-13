export interface SkillGroup {
  category: string;
  icon: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: 'Development',
    icon: 'Code',
    skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Sanity CMS', 'Prisma', 'PostgreSQL', 'Vercel'],
  },
  {
    category: 'Education',
    icon: 'GraduationCap',
    skills: ['Curriculum Design', 'Vocational Training', 'Competency Assessment', 'Student Mentoring', 'KKNI Standards', 'Instructional Design'],
  },
  {
    category: 'Digital',
    icon: 'Globe',
    skills: ['Digital Transformation', 'Systems Architecture', 'Data Management', 'Network Infrastructure', 'Cisco Networking', 'Linux Administration'],
  },
  {
    category: 'Career & Industry',
    icon: 'Briefcase',
    skills: ['Industry Partnerships', 'Internship Coordination', 'Alumni Relations', 'Career Counseling', 'BKK Management', 'Tracer Study'],
  },
];