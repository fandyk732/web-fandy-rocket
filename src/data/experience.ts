export interface Experience {
  id: string;
  role: string;
  organization: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  type: 'education' | 'operations' | 'finance' | 'tech';
}

export const experiences: Experience[] = [
  {
    id: 'smk-alkaaffah',
    role: 'Head of Computer Networking Department',
    organization: 'SMK Al Kaaffah',
    period: '2021 — Present',
    location: 'East Java, Indonesia',
    description: 'Leading digital transformation of a vocational school — building systems, mentoring students, and coordinating industry partnerships for career placement.',
    highlights: [
      'Built digital ecosystem from scratch (student data, learning resources, admin tools)',
      'Coordinated 300+ internship placements across 30+ industry partners',
      'Mentored 180+ students in networking and IT skills',
      'Established tracer study system tracking 240+ alumni outcomes',
    ],
    type: 'education',
  },
  {
    id: 'jt-express',
    role: 'Operations & Business Development',
    organization: 'J&T Express',
    period: '2016 — 2021',
    location: 'East Java, Indonesia',
    description: 'Managed logistics operations and drove business growth across regional distribution networks.',
    highlights: [
      'Scaled regional operations across multiple districts',
      'Implemented process optimizations reducing delivery time by 20%',
      'Trained and coordinated teams of 20+ staff members',
      'Led digital reporting initiatives for operational data',
    ],
    type: 'operations',
  },
  {
    id: 'bank-mandiri',
    role: 'Network Infrastructure Specialist',
    organization: 'Bank Mandiri Project',
    period: '2015 — 2016',
    location: 'East Java, Indonesia',
    description: 'Contributed to network infrastructure projects for one of Indonesia\'s largest banks, gaining enterprise-level technical experience.',
    highlights: [
      'Deployed and configured enterprise network equipment',
      'Documented network topology and security protocols',
      'Collaborated with cross-functional technical teams',
    ],
    type: 'finance',
  },
  {
    id: 'smk-muhammadiyah',
    role: 'Networking Teacher',
    organization: 'SMK Muhammadiyah',
    period: '2009 — 2014',
    location: 'East Java, Indonesia',
    description: 'Began teaching career in vocational education, developing curriculum for computer networking and building foundational teaching methodologies.',
    highlights: [
      'Developed hands-on networking curriculum from scratch',
      'Prepared students for national competency certifications',
      'Built and maintained school computer lab infrastructure',
    ],
    type: 'education',
  },
];