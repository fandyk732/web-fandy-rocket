export interface Stat {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export const stats: Stat[] = [
  { value: 180, suffix: '+', label: 'Students Mentored', description: 'Direct mentoring in networking & IT' },
  { value: 240, suffix: '+', label: 'Alumni Tracked', description: 'Outcomes monitored via tracer study' },
  { value: 30, suffix: '+', label: 'Industry Partners', description: 'Active internship partnerships' },
  { value: 300, suffix: '+', label: 'Internship Students', description: 'Coordinated industry placements' },
  { value: 20, suffix: '+', label: 'Teachers Coordinated', description: 'Cross-department collaboration' },
];