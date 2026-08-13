import React from 'react';

interface SectionTitleProps {
  id?: string;
  label?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionTitle({
  id,
  label,
  title,
  subtitle,
  align = 'left',
  className = '',
}: SectionTitleProps) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      {label && (
        <span className="mono-label text-primary">
          {label}
        </span>
      )}
      <h2 className="section-heading text-foreground">{title}</h2>
      {subtitle && (
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}