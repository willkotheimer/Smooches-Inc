import type { HTMLAttributes } from 'react';
import { cn } from '../lib/utils';

/** Berry card with a thin rose outline (full rose on hover), near-square corners. */
export default function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'mb-2 rounded-card border border-accent/60 bg-surface p-3 transition-colors',
        'hover:border-accent hover:bg-surface-elevated',
        className,
      )}
      {...props}
    />
  );
}
