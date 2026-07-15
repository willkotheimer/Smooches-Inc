import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface Props {
  tone?: 'neutral' | 'accent';
  children: ReactNode;
}

export default function Chip({ tone = 'neutral', children }: Props) {
  return (
    <span
      className={cn(
        'rounded-card px-2.5 py-1 text-xs font-bold',
        tone === 'accent' ? 'bg-accent/20 text-accent' : 'bg-foreground/15 text-foreground/80',
      )}
    >
      {children}
    </span>
  );
}
