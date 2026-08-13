import React from 'react';

interface SkillBadgeProps {
  skill: string;
  variant?: 'default' | 'primary';
}

export default function SkillBadge({ skill, variant = 'default' }: SkillBadgeProps) {
  if (variant === 'primary') {
    return (
      <span className="mono-label px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full transition-all duration-200 hover:bg-primary/20 hover:border-primary/40 cursor-default">
        {skill}
      </span>
    );
  }

  return (
    <span className="mono-label px-3 py-1.5 bg-muted text-muted-foreground border border-border rounded-full transition-all duration-200 hover:bg-muted/80 hover:text-foreground cursor-default">
      {skill}
    </span>
  );
}