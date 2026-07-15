import type { ReactNode } from 'react';

/** Bold (not huge) page title with the short rose underline. */
export default function PageTitle({ children }: { children: ReactNode }) {
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">{children}</h1>
      <div className="title-rule" />
    </div>
  );
}
