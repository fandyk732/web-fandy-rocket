'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Stat } from '@/data/stats';

interface StatCardProps {
  stat: Stat;
  delay?: number;
}

export default function StatCard({ stat, delay = 0 }: StatCardProps) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          setVisible(true);
          setTimeout(() => {
            const duration = 1500;
            const steps = 60;
            const increment = stat.value / steps;
            let current = 0;
            const timer = setInterval(() => {
              current += increment;
              if (current >= stat.value) {
                setCount(stat.value);
                clearInterval(timer);
              } else {
                setCount(Math.floor(current));
              }
            }, duration / steps);
          }, delay);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [stat.value, delay]);

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-2 p-6 bg-card border border-border rounded-2xl card-hover transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-foreground tracking-tighter">
          {count}
        </span>
        <span className="text-2xl font-bold text-primary">{stat.suffix}</span>
      </div>
      <p className="text-base font-semibold text-foreground">{stat.label}</p>
      <p className="text-sm text-muted-foreground leading-relaxed">{stat.description}</p>
    </div>
  );
}