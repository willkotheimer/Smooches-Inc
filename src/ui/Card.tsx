import type { HTMLAttributes } from 'react';
import { cn } from '../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Outline color. Dashboard uses rose; other pages use blue. */
  tone?: 'rose' | 'blue';
}

/** Berry card with a thin outline (full color on hover), near-square corners. */
export default function Card({ className, tone = 'rose', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'mb-2 rounded-card border bg-surface p-3 transition-colors hover:bg-surface-elevated',
        tone === 'blue' ? 'border-blue/60 hover:border-blue' : 'border-accent/60 hover:border-accent',
        className,
      )}
      {...props}
    />
  );
}
