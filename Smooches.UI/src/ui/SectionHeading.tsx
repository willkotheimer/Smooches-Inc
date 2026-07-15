import type { ReactNode } from 'react';

interface Props {
  /** Font Awesome class, e.g. "fa-solid fa-bell". */
  icon: string;
  children: ReactNode;
}

export default function SectionHeading({ icon, children }: Props) {
  return (
    <h2 className="mt-5 mb-2 flex items-center gap-2.5 text-lg font-bold">
      <i className={`${icon} text-[15px] text-accent`} aria-hidden />
      {children}
    </h2>
  );
}
