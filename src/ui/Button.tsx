import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

const button = cva(
  'inline-flex items-center justify-center gap-2 rounded-card font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50',
  {
    variants: {
      variant: {
        solid: 'bg-accent text-accent-foreground hover:bg-accent/90',
        ghost: 'border border-line text-muted hover:text-foreground hover:border-accent',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
      },
    },
    defaultVariants: { variant: 'solid', size: 'md' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export default function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(button({ variant, size }), className)} {...props} />;
}
