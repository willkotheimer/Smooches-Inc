import type { ReactNode } from 'react';

/** Narrow, centered, tight-padding column shared by every page. */
export default function PageLayout({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-full max-w-3xl px-4 py-5">{children}</main>;
}
